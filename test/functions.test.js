import assert from "node:assert/strict";
import test from "node:test";

import { handler as chavruta } from "../netlify/functions/chavruta.js";
import { handler as sefaria } from "../netlify/functions/sefaria.js";

test("Sefaria requires a text reference", async () => {
  const response = await sefaria({
    httpMethod: "GET",
    queryStringParameters: {},
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body, /Missing ref parameter/);
});

test("Sefaria returns normalized bilingual text", async (context) => {
  const originalFetch = globalThis.fetch;
  context.after(() => {
    globalThis.fetch = originalFetch;
  });

  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    text: async () =>
      JSON.stringify({
        ref: "Genesis 1:1",
        versions: [
          { language: "he", text: "בראשית" },
          { language: "en", text: "In the beginning" },
        ],
      }),
  });

  const response = await sefaria({
    httpMethod: "GET",
    queryStringParameters: { ref: "Genesis 1:1" },
  });
  const body = JSON.parse(response.body);

  assert.equal(response.statusCode, 200);
  assert.equal(body.he, "בראשית");
  assert.equal(body.en, "In the beginning");
});

test("Chavruta rejects an empty question before calling OpenAI", async (context) => {
  const originalKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = "test-key";
  context.after(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  });

  const response = await chavruta({
    httpMethod: "POST",
    body: "{}",
  });

  assert.equal(response.statusCode, 400);
  assert.match(response.body, /Question is required/);
});
