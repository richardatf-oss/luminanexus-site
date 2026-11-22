import test from "node:test";
import assert from "node:assert/strict";
import { readLessonContext } from "../src/data/chavruta-navigation.js";

test("lesson links carry a bounded course context and a local return path", () => {
  const params = new URLSearchParams({chavrutaLesson:"/bet-track.html#lesson-12",chavrutaSkill:"Meet Zayin"});
  assert.deepEqual(readLessonContext(params), {track:"Bet",currentSkill:"Meet Zayin",lesson:12,lessonHref:"/bet-track.html#lesson-12"});
});
test("lesson context rejects external paths and lessons outside their track", () => {
  for (const path of ["https://example.com/aleph-track.html#lesson-1","//example.com/aleph-track.html#lesson-1","/bet-track.html#lesson-33","/aleph-track.html#lesson-37","/gimel-track.html#lesson-0","/teacher-guide.html#lesson-1"]) {
    assert.deepEqual(readLessonContext(new URLSearchParams({chavrutaLesson:path})), {});
  }
});
test("valid course boundaries are accepted and lesson titles are bounded", () => {
  for (const [track,limit] of [["aleph",36],["bet",32],["gimel",32]]) {
    const context = readLessonContext(new URLSearchParams({chavrutaLesson:`/${track}-track.html#lesson-${limit}`,chavrutaSkill:"a".repeat(300)}));
    assert.equal(context.lesson,limit);
    assert.equal(context.currentSkill.length,160);
  }
});
