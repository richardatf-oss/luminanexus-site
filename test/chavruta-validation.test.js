import test from 'node:test';
import assert from 'node:assert/strict';
import { handler, validateStudyRequest } from '../netlify/functions/chavruta.js';
test('accepts a bounded question without requiring a name',()=>assert.equal(validateStudyRequest({question:'Help me review Mem.'}),null));
test('rejects oversized questions and malformed profile fields',()=>{
 for(const body of [{question:'x'.repeat(1201)},{question:42},{question:'x',profile:null},{question:'x',profile:{name:[]}},{question:'x',profile:{track:'Other'}},{question:'x',profile:{currentSkill:'x'.repeat(201)}}]) assert.ok(validateStudyRequest(body));
});
test('malformed JSON is a client error before any upstream call',async()=>{
 const result=await handler({httpMethod:'POST',body:'{'});assert.equal(result.statusCode,400);
});
