import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {resolve,join,extname} from 'node:path';
const root=resolve('dist'),pages=readdirSync(root).filter(name=>name.endsWith('.html'));
const ids=new Map(),issues=[];
function addIds(set,text){for(const match of text.matchAll(/\bid=["']([^"']+)["']/g))set.add(match[1]);for(const match of text.matchAll(/\.id\s*=\s*["']([\w-]+)["']/g))set.add(match[1]);}
for(const name of pages){
 const html=readFileSync(join(root,name),'utf8'),set=new Set();addIds(set,html);
 for(const match of html.matchAll(/<script[^>]*src=["']([^"']+)["']/g)){
  const path=join(root,match[1].replace(/^\//,''));if(existsSync(path))addIds(set,readFileSync(path,'utf8'));
 }
 ids.set('/'+(name==='index.html'?'':name),set);
}
// The homepage is rendered by its active React component graph.
const visited=new Set();function readReact(path){if(visited.has(path)||!existsSync(path))return;visited.add(path);const text=readFileSync(path,'utf8');addIds(ids.get('/'),text);for(const match of text.matchAll(/from\s+["'](\.[^"']+)["']/g))readReact(resolve(path,'..',match[1]));}
readReact(resolve('src/App.jsx'));
// Gimel's runtime builds its lesson IDs from the canonical lesson sequence.
for(const lesson of JSON.parse(readFileSync('docs/curriculum/gimel-track.json','utf8')).lessons)ids.get('/gimel-track.html').add('lesson-'+lesson.id);
let count=0;
function check(raw,from){
 raw=raw.replaceAll('&amp;','&');if(!raw||raw==='#'){issues.push(`${from}: empty destination`);return;}
 const url=new URL(raw,'https://internal.test'+from);if(url.origin!=='https://internal.test'||url.pathname.startsWith('/.netlify/'))return;
 const path=url.pathname==='/index.html'?'/':url.pathname;
 if(extname(path)&&extname(path)!=='.html')return;
 if(!ids.has(path)){issues.push(`${from} -> ${raw}: missing page`);return;}
 if(url.hash&&!ids.get(path).has(decodeURIComponent(url.hash.slice(1))))issues.push(`${from} -> ${raw}: missing section`);
 count++;
}
for(const name of pages){const from='/'+(name==='index.html'?'':name),html=readFileSync(join(root,name),'utf8');for(const match of html.matchAll(/<a\b[^>]*href=["']([^"']*)["']/g))check(match[1],from);}
for(const path of visited){const text=readFileSync(path,'utf8');for(const match of text.matchAll(/href=["']([^"']+)["']/g))if(!match[1].includes('${'))check(match[1],'/');}
for(const match of readFileSync('public/site-navigation.js','utf8').matchAll(/["'](\/[^"'\s]*)["']/g))if(!match[1].includes('${'))check(match[1],'/');
if(issues.length)throw Error('Broken navigation:\n'+issues.join('\n'));
console.log(`Validated ${count} local page and section destinations across ${pages.length} pages.`);
