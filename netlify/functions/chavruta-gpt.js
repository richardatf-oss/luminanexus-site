// netlify/functions/chavruta-gpt.js

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Helper to build JSON responses
function jsonResponse(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

exports.handler = async (event, context) => {
  try {
    const method = event.httpMethod || "GET";
    let message = "";
    let conversation = [];
    let source = "luminanexus-chavruta-page";

    if (method === "GET") {
      // Read from query string for GET
      const params = event.queryStringParameters || {};
      message = params.message || "";
      source = params.source || source;

      if (params.conversation) {
        try {
          conversation = JSON.parse(params.conversation);
        } catch {
          conversation = [];
        }
      }
    } else if (method === "POST") {
      // Read from JSON body for POST
      const body = JSON.parse(event.body || "{}");
      message = body.message || "";
      conversation = Array.isArray(body.conversation) ? body.conversation : [];
      source = body.source || source;
    }

    console.log("ChavrutaGPT received:", { method, message, source, conversationLength: conversation.length });

    if (!OPENAI_API_KEY) {
      console.error("Missing OPENAI_API_KEY environment variable.");
      return jsonResponse(500, {
        reply:
          "ChavrutaGPT is not fully configured yet (missing API key on the server). Please let the builder know.",
      });
    }

    if (!message) {
      return jsonResponse(200, {
        reply:
          "Shalom. Bring me a verse, a question, or a thought, and we’ll begin learning together.",
      });
    }

    const systemPrompt = `
You are **ChavrutaGPT**, a gentle, thoughtful chavruta (study partner) for Torah, Tanakh, Midrash, and classical Jewish and mystical texts.

Your job is:
- To ask good questions, not just give answers.
- To help the learner notice patterns, words, and themes.
- To suggest relevant classical sources (Tanakh, Mishnah, Talmud, Midrash, Rambam, etc.) when appropriate.
- To keep a warm, respectful tone.

Guidelines:
- Do NOT give halachic rulings or psak. For any halachic questions, gently suggest they ask a trusted rabbi or posek.
- If the user shares something personal or painful, respond with care and validation before analysis.
- Prefer short paragraphs and lists over huge walls of text.
- Occasionally ask: "What stands out to you most in this text?" or a similar reflective question.

When answering:
1. Briefly reflect what they brought (one or two sentences).
2. Offer 1–3 insights, questions, or source suggestions.
3. End with a question that invites them deeper into the learning.
`.trim();

    // Map conversation into OpenAI format (last few turns to keep it short)
    const historyMessages = (conversation || [])
      .slice(-8)
      .map((c) => ({
        role: c.role === "assistant" ? "assistant" : "user",
        content: c.content || "",
      }))
      .filter((m) => m.content);

    const openAiMessages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: openAiMessages,
        temperature: 0.6,
        max_tokens: 600,
      }),
    });

    console.log("OpenAI status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI error:", response.status, errorText);
      return jsonResponse(500, {
        reply:
          "ChavrutaGPT had trouble reaching the learning engine just now. Please try again in a moment.",
      });
    }

    const data = await response.json();
    const reply =
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content
        ? data.choices[0].message.content.trim()
        : "I received a response from the learning engine, but I couldn’t parse it. Please try again.";

    return jsonResponse(200, { reply });
  } catch (err) {
    console.error("ChavrutaGPT server error:", err);
    return jsonResponse(500, {
      reply:
        "There was an internal server error in ChavrutaGPT. Please try again soon.",
    });
  }
};
