import test from 'node:test';
import assert from 'node:assert/strict';
import { calendarOptions, studyWeek, normalizePortion, loadWeeklyPortion } from '../netlify/functions/lib/weeklyPortion.js';
import { handler as weeklyHandler } from '../netlify/functions/weekly-portion.js';
import { handler as chavruta, validateStudyRequest } from '../netlify/functions/chavruta.js';

function calendar(date, name='Vayishlach', ref='Genesis 32:4-36:43') {
  return {date,calendar_items:[{title:{en:'Parashat Hashavua'},displayValue:{en:name,he:'וישלח'},ref,
    extraDetails:{aliyot:Array.from({length:8},(_,i)=>`Genesis 32:${i+4}`)},description:{en:'A source overview.'}}]};
}

test('the weekly key stays stable Sunday through Saturday and advances on Sunday',()=>{
  for (let day=22;day<=28;day++) assert.equal(studyWeek(new Date(`2026-11-${day}T12:00Z`),'America/Phoenix').shabbat,'2026-11-28');
  assert.equal(studyWeek(new Date('2026-11-29T12:00Z'),'America/Phoenix').shabbat,'2026-12-05');
  assert.equal(studyWeek(new Date('2026-12-31T12:00Z'),'UTC').shabbat,'2027-01-02');
});

test('local dates determine the week on opposite sides of midnight',()=>{
  const now=new Date('2026-11-29T02:00Z');
  assert.deepEqual(studyWeek(now,'America/Phoenix'),{date:'2026-11-28',shabbat:'2026-11-28',studyDay:7});
  assert.deepEqual(studyWeek(now,'Asia/Jerusalem'),{date:'2026-11-29',shabbat:'2026-12-05',studyDay:1});
});

test('both regional schedules use all three explicit Shabbat date parameters',async()=>{
  for(const diaspora of ['0','1']) {
    let requested;
    const data=await loadWeeklyPortion({diaspora,timezone:'America/Phoenix'},{now:new Date('2026-11-22T12:00Z'),fetcher:async url=>{
      requested=new URL(url);return {ok:true,json:async()=>calendar('2026-11-28')};
    }});
    assert.equal(requested.searchParams.get('diaspora'),diaspora);
    for(const [key,value] of [['year','2026'],['month','11'],['day','28']]) assert.equal(requested.searchParams.get(key),value);
    assert.equal(data.name,'Vayishlach');assert.equal(data.readings.length,7);
    assert.equal(data.readings.at(-1),'Genesis 32:10'); // Exclude the eighth, maftir entry.
  }
});

test('festival and combined readings retain the calendar’s name and reference',()=>{
  const week={date:'2026-03-29',shabbat:'2026-04-04',studyDay:1};
  for(const name of ['Pesach Shabbat Chol haMoed','Matot-Masei']) {
    const data=normalizePortion(calendar(week.shabbat,name,'Exodus 33:12-34:26'),calendarOptions(),week);
    assert.equal(data.name,name);assert.equal(data.ref,'Exodus 33:12-34:26');
  }
  assert.throws(()=>normalizePortion(calendar('2026-03-28'),calendarOptions(),week));
  assert.throws(()=>normalizePortion({date:week.shabbat,calendar_items:[]},calendarOptions(),week));
});

test('calendar failure never substitutes a hard-coded portion',async()=>{
  await assert.rejects(()=>loadWeeklyPortion({}, {fetcher:async()=>({ok:false})}));
  assert.ok(validateStudyRequest({question:'This week?',calendar:{diaspora:'2'}}));
  assert.ok(validateStudyRequest({question:'This week?',calendar:{timezone:'Invalid/Zone'}}));
  assert.equal((await weeklyHandler({httpMethod:'GET',queryStringParameters:{timezone:'Invalid/Zone'}})).statusCode,400);
  assert.equal((await weeklyHandler({httpMethod:'POST'})).statusCode,405);
});

test('Chavruta receives verified weekly context and explicitly handles an outage',async context=>{
  const originalFetch=globalThis.fetch, originalKey=process.env.OPENAI_API_KEY;
  context.after(()=>{globalThis.fetch=originalFetch;if(originalKey===undefined)delete process.env.OPENAI_API_KEY;else process.env.OPENAI_API_KEY=originalKey;});
  process.env.OPENAI_API_KEY='test-key';
  for(const available of [true,false]) {
    let prompt='';
    globalThis.fetch=async(url,options)=>{
      if(url.startsWith('https://www.sefaria.org/')) {
        const params=new URL(url).searchParams;
        assert.equal(params.get('diaspora'),'0');
        return {ok:available,json:async()=>calendar(`${params.get('year')}-${params.get('month')}-${params.get('day')}`)};
      }
      prompt=JSON.parse(options.body).messages[0].content;
      return {ok:true,json:async()=>({choices:[{message:{content:'A study response.'}}]})};
    };
    const response=await chavruta({httpMethod:'POST',body:JSON.stringify({question:'Help me study this week.',mode:'noahide-parcha',calendar:{diaspora:'0',timezone:'Asia/Jerusalem'}})});
    assert.equal(response.statusCode,200);
    if(available){assert.match(prompt,/Verified calendar data/);assert.match(prompt,/Vayishlach/);assert.match(prompt,/Genesis 32:4-36:43/);}
    else {assert.match(prompt,/Calendar verification is unavailable for this request/);assert.doesNotMatch(prompt,/Verified calendar data/);}
  }
});
