// netlify/functions/chavruta-gpt.js
//
// Hybrid ChavrutaGPT:
// - Always returns a thoughtful "offline" chavruta-style reply.
// - If a valid OPENAI_API_KEY is present and OpenAI responds successfully,
//   it uses that richer answer instead.
//
// Works with:
//   GET  /.netlify/functions/chavruta-gpt?message=...&conversation=[...]&mode=...
//   POST /.netlify/functions/chavruta-gpt  { message, conversation, source, mode }

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

// Offline chavruta "brain" – no external API
function buildOfflineReply(message, conversation, mode) {
  const trimmed = (message || "").trim();
  const shortMsg = trimmed.length > 160 ? trimmed.slice(0, 157) + "..." : trimmed;
  const safeMode = mode || "questions";

  const lastUserTurn = [...(conversation || [])]
    .reverse()
    .find((c) => c.role === "user" && c.content && c.content !== message);

  let reply = "";

  // Shared intro
  reply += `You brought: "${shortMsg}".\n\n`;

  if (lastUserTurn) {
    const lastShort =
      lastUserTurn.content.length > 160
        ? lastUserTurn.content.slice(0, 157) + "..."
        : lastUserTurn.content;
    reply += `Earlier you shared: "${lastShort}". I’m holding that together with what you just brought now.\n\n`;
  }

  // Mode-specific voice
  if (safeMode === "pshat") {
    reply +=
      "Let’s begin with *pshat* — the simple, surface meaning:\n\n" +
      "1. What is this verse or idea saying in the most straightforward way?\n" +
      "2. Who is speaking, and to whom?\n" +
      "3. If you had to restate it in your own words, how would you say it?\n\n";
  } else if (safeMode === "sod") {
    reply +=
      "Let’s listen for hints of *sod* — the inner, hidden resonance:\n\n" +
      "1. What image, symbol, or word feels charged with mystery for you here?\n" +
      "2. If this line were a doorway, where do you sense it might lead in your inner world?\n" +
      "3. How might this connect to the Tree of Life, the sefirot, or your own journey of teshuvah?\n\n";
  } else if (safeMode === "life") {
    reply +=
      "Let’s look at how this touches your actual life right now:\n\n" +
      "1. Where in your life do you feel closest to this verse or teaching?\n" +
      "2. Is there a decision, relationship, or pattern that this text seems to illuminate?\n" +
      "3. If this line were gentle advice to you today, what do you hear it saying?\n\n";
  } else if (safeMode === "meditation") {
    reply +=
      "Let’s turn this into a short, soft meditation. You might read this slowly, even aloud:\n\n" +
      "• Take a gentle breath in through the nose… and out through the mouth.\n" +
      "• As you breathe, let the words you brought rest quietly in your chest.\n" +
      "• With each breath, ask: what light is this verse trying to bring into me?\n" +
      "• Notice any word, memory, or feeling that surfaces — without judging it.\n" +
      "• When you are ready, offer a quiet thank you — to the Source of this teaching, and to your own soul for listening.\n\n";
  } else {
    // default: questions / chavruta mode
    reply +=
      "Let’s sit with this like we’re at a small wooden table, a sefer open between us:\n\n" +
      "1. **Notice a word or phrase** that pulls at you. What is it, and why do you think it stands out?\n" +
      "2. **Where have you met this feeling or idea before?** Another verse, a teaching, a story, or a moment in your own life?\n" +
      "3. **If this line were speaking directly to you**, what do you feel it might be trying to say?\n\n";
  }

  // Shared closing with source-hints
  reply +=
    "If you’d like, you can tell me:\n" +
    "- The exact pasuk (book / chapter / verse), or\n" +
    "- Whether you’re looking more for *pshat* (simple meaning), *drash* (interpretation), *sod* (mystery), or how this touches your life right now.\n" +
    "- You can also mention a text (e.g. “Bereishit 1”, “Tehillim 23”, “Zohar on Bereshit”) and we can talk about it like we’re opening Sefaria together.\n\n";

  reply += "What stands out to you most in what you just brought?";

  return reply;
}

exports.handler = async (event, context) => {
  try {
    const method = event.httpMethod || "GET";
    let message = "";
    let conversation = [];
    let source = "luminanexus-chavruta-page";
    let mode = "questions";

    if (method === "GET") {
      const params = event.queryStringParameters || {};
      message = params.message || "";
      source = params.source || source;
      mode = params.mode || mode;

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
      mode = body.mode || mode;
    }

    console.log("ChavrutaGPT received:", {
      method,
      mode,
      messageSnippet: (message || "").slice(0, 80),
      source,
      conversationLength: (conversation || []).length,
    });

    if (!message || !message.trim()) {
      return jsonResponse(200, {
        reply:
          "Shalom. Bring me a verse, a line of Torah, or even just a feeling in your heart, and we’ll begin learning together.",
      });
    }

    // Always prepare an offline backup answer
    const offlineReply = buildOfflineReply(message, conversation, mode);

    // If no API key, just return offline chavruta-style reply
    if (!OPENAI_API_KEY) {
      console.warn("ChavrutaGPT: no OPENAI_API_KEY set, using offline mode only.");
      return jsonResponse(200, { reply: offlineReply });
    }

    // Try OpenAI; on any error, fall back to offlineReply
    try {
      const systemPrompt = `
You are **ChavrutaGPT**, a gentle, thoughtful chavruta (study partner) for Torah, Tanakh, Midrash, and classical Jewish and mystical texts.

The current mode is: "${mode}". Interpret it as:
- "questions": emphasize asking probing, open-ended questions more than giving answers.
- "pshat": emphasize clear, grounded explanation of the simple meaning of the text.
- "sod": emphasize hints of deeper, mystical resonance without being fanciful; stay rooted.
- "life": emphasize how the text might illuminate the learner's real-life situation.
- "meditation": respond as a short, gentle guided meditation that can be read slowly.

Your job is:
- To ask good questions, not just give conclusions.
- To help the learner notice patterns, words, and themes in what they bring.
- To suggest relevant classical sources (Tanakh, Mishnah, Talmud, Midrash, Rambam, Zohar, etc.) when appropriate, often by name (e.g., "This echoes Tehillim 23", "See Mishnah Avot 1:6").
- To keep a warm, respectful, grounded tone.

Guidelines:
- Do NOT give halachic rulings or psak. For any halachic questions, gently suggest they ask a trusted rabbi or posek.
- If the user shares something personal or painful, respond first with care and validation before any analysis.
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
          max_tokens: 700,
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
