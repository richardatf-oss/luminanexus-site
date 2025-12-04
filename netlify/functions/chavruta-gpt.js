// netlify/functions/chavruta-gpt.js
//
// Hybrid ChavrutaGPT:
// - Always returns a thoughtful "offline" chavruta-style reply.
// - If a valid OPENAI_API_KEY is present and OpenAI responds successfully,
//   it uses that richer answer instead.
//
// Works with:
//   GET  /.netlify/functions/chavruta-gpt?message=...&conversation=[...]
//   POST /.netlify/functions/chavruta-gpt  { message, conversation, source }

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

// Simple offline chavruta "brain" – no external API
function buildOfflineReply(message, conversation) {
  const trimmed = (message || "").trim();
  const shortMsg = trimmed.length > 120 ? trimmed.slice(0, 117) + "..." : trimmed;

  const lastUserTurn = [...(conversation || [])]
    .reverse()
    .find((c) => c.role === "user" && c.content && c.content !== message);

  let reply = "";

  reply += `You brought: "${shortMsg}".\n\n`;

  if (lastUserTurn) {
    const lastShort =
      lastUserTurn.content.length > 120
        ? lastUserTurn.content.slice(0, 117) + "..."
        : lastUserTurn.content;
    reply += `Earlier you shared: "${lastShort}". I’m holding that together with what you just brought now.\n\n`;
  }

  reply += "Let’s sit with this like we’re at a small wooden table, a sefer open between us:\n\n";

  reply +=
    "1. **Notice a word or phrase** that pulls at you. What is it, and why do you think it stands out?\n";
  reply +=
    "2. **Where have you met this feeling or idea before?** Another verse, a teaching, a story, or a moment in your own life?\n";
  reply +=
    "3. **If this line were speaking directly to you**, what do you feel it might be trying to say?\n\n";

  reply +=
    "If you’d like, you can tell me:\n" +
    "- The exact pasuk (book / chapter / verse), or\n" +
    "- Whether you’re looking more for *pshat* (simple meaning), *drash* (interpretation), *sod* (mystery), or how this touches your life right now.\n\n";

  reply += "What stands out to you most in what you just brought?";

  return reply;
}

exports.handler = async (event, context) => {
  try {
    const method = event.httpMethod || "GET";
    let message = "";
    let conversation = [];
    let source = "luminanexus-chavruta-page";

    if (method === "GET") {
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
      const body = JSON.parse(event.body || "{}");
      message = body.message || "";
      conversation = Array.isArray(body.conversation) ? body.conversation : [];
      source = body.source || source;
    }

    console.log("ChavrutaGPT received:", {
      method,
      messageSnippet: (message || "").slice(0, 80),
      source,
      conversationLength: (conversation || []).length,
    });

    // No text? Greet gently.
    if (!message || !message.trim()) {
      return jsonResponse(200, {
        reply:
          "Shalom. Bring me a verse, a line of Torah, or even just a feeling in your heart, and we’ll begin learning together.",
      });
    }

    // Always prepare an offline backup answer
    const offlineReply = buildOfflineReply(message, conversation);

    // If no API key, just return offline chavruta-style reply
    if (!OPENAI_API_KEY) {
      console.warn("ChavrutaGPT: no OPENAI_API_KEY set, using offline mode only.");
      return jsonResponse(200, { reply: offlineReply });
    }

    // Try OpenAI; on any error, fall back to offlineReply
    try {
      const systemPrompt = `
You are **ChavrutaGPT**, a gentle, thoughtful chavruta (study partner) for Torah, Tanakh, Midrash, and classical Jewish and mystical texts.

Your job is:
- To ask good questions, not just give answers.
- To help the learner notice patterns, words, and themes in what they bring.
- To suggest relevant classical sources (Tanakh, Mishnah, Talmud, Midrash, Rambam, etc.) when appropriate.
- To keep a warm, respectful, grounded tone.

Guidelines:
- Do NOT give halachic rulings or psak. For any halachic questions, gently suggest they ask a trusted rabbi or posek.
- If the user shares something personal or painful, respond first with care and validation before analysis.
- Prefer short paragraphs and lists over long walls of text.
- Often end with a gentle question that invites the learner deeper into the text or into their own heart.
`.trim();

      const historyMessages = (conversation || [])
        .slice(-12)
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
        // Fall back gracefully
        return jsonResponse(200, { reply: offlineReply });
      }

      const data = await response.json();
      const aiReply =
        data.choices &&
        data.choices[0] &&
        data.choices[0].message &&
        data.choices[0].message.content
          ? data.choices[0].message.content.trim()
          : null;

      if (!aiReply) {
        console.warn("ChavrutaGPT: OpenAI returned no usable content, using offline reply.");
        return jsonResponse(200, { reply: offlineReply });
      }

      // Success – use the AI reply
      return jsonResponse(200, { reply: aiReply });
    } catch (err) {
      console.error("ChavrutaGPT OpenAI call failed, using offline reply:", err);
      return jsonResponse(200, { reply: offlineReply });
    }
  } catch (err) {
    console.error("ChavrutaGPT server error:", err);
    return jsonResponse(500, {
      reply:
        "There was an internal error in the chavruta function. Please try again in a little while.",
    });
  }
};
