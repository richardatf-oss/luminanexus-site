import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseTrackKey } from '../src/data/placement.js';
test('missing foundations cannot be compensated by other answers', () => {
 for(let d=0;d<=2;d++) for(let l=0;l<=2;l++) for(let w=0;w<=2;w++) for(let c=0;c<=2;c++) for(let r=0;r<=2;r++) {
  const result=chooseTrackKey([d,l,w,c,r]);
  if(d===0 || l===0 || c!==2) assert.equal(result,'Aleph');
  if(result==='Gimel') assert.deepEqual([d,l,w,c,r],[2,2,2,2,2]);
 }
});
test('Gimel requires demonstrated decoding',()=> {
 assert.equal(chooseTrackKey([2,2,2,2,0]),'Bet');
 assert.equal(chooseTrackKey([2,2,2,2,2]),'Gimel');
 assert.equal(chooseTrackKey([1,1,0,2,0]),'Bet');
});
test('incomplete or malformed placement stays at a supported beginning',()=> {
 for(const input of [null,[],[2,2,2],[2,2,2,2,9]]) assert.equal(chooseTrackKey(input),'Aleph');
});
