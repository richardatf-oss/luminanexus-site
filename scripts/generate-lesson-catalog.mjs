import {readFileSync,writeFileSync} from 'node:fs';
const catalog={};
for(const track of ['Aleph','Bet','Gimel']) {
  const data=JSON.parse(readFileSync(`docs/curriculum/${track.toLowerCase()}-track.json`,'utf8'));
  catalog[track]=data.lessons.map(lesson=>({id:lesson.id,title:lesson.title,goal:lesson.goal||lesson.focus,practice:lesson.practice||lesson.steps||[lesson.cue],href:`/${track.toLowerCase()}-track.html#lesson-${lesson.id}`}));
}
writeFileSync('public/lesson-catalog.json',JSON.stringify(catalog,null,2)+'\n');
