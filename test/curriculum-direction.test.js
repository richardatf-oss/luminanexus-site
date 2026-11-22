import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {execFileSync} from 'node:child_process';

test('all 100 canonical lessons have valid answers and no ambiguous arrow strings', () => {
  let count=0;
  for(const name of ['aleph','bet','gimel']) {
    const data=JSON.parse(readFileSync(`docs/curriculum/${name}-track.json`,'utf8'));
    data.lessons.forEach((lesson,index)=> {
      assert.equal(lesson.id,index+1);
      const choices=lesson.options||lesson.choices||lesson.checks;
      if(lesson.options||lesson.choices) assert.ok(Number.isInteger(lesson.answer)&&lesson.answer>=0&&lesson.answer<choices.length);
      assert.ok(!/[←→]/u.test(JSON.stringify(lesson)),`${name} lesson ${lesson.id} must use a physical direction diagram rather than a mixed-script arrow string`);
      for (const question of lesson.questions || []) assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
      count++;
    });
  }
  assert.equal(count,100);
});
test('English examples are not labeled as Hebrew in generated pages',()=> {
  for(const file of readdirSync('public').filter(file=>file.endsWith('.html'))) {
    const html=readFileSync(`public/${file}`,'utf8');
    for(const match of html.matchAll(/<(?:span|bdi)[^>]*lang="he"[^>]*>([^<]*)<\//g)) {
      assert.ok(!/[A-Za-z]/.test(match[1]),`${file}: English text mislabeled as Hebrew: ${match[1]}`);
    }
  }
});
test('sample renderer separates English explanations from Hebrew words',()=> {
  const source='from scripts.curriculum_text import sample_html; import json; print(json.dumps([sample_html("A B C"),sample_html("בַּת (daughter)"),sample_html("א ב ג")]))';
  const [english,mixed,hebrew]=JSON.parse(execFileSync('python3',['-c',source],{encoding:'utf8'}));
  assert.match(english,/lang="en" dir="ltr"/);
  assert.doesNotMatch(english,/lang="he"/);
  assert.match(mixed,/<bdi[^>]*lang="he" dir="rtl">בַּת<\/bdi> \(daughter\)/);
  assert.match(hebrew,/lang="he" dir="rtl">א ב ג/);
});
test('the public editable Aleph workbook matches its current source',()=>{
  assert.deepEqual(readFileSync('public/downloads/Aleph_Track_Printable.docx'),readFileSync('docs/workbooks-source/Aleph_Track_Curriculum.docx'));
});
