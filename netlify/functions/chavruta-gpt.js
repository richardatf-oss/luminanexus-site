// netlify/functions/chavruta-gpt.js
//
// "Offline" ChavrutaGPT — no OpenAI needed.
// Works with both GET and POST, and matches the frontend's expectations:
//   - GET / .netlify/functions/chavruta-gpt?message=...&conversation=[...]
//   - Returns JSON: { reply: "..." }

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

    console.log("Offline ChavrutaGPT received:", {
      method,
      messageSnippet: message.slice(0, 80),
      source,
      conversationLength: conversation.length,
    });

    // No text? Greet gently.
    if (!message) {
      return jsonResponse(200, {
        reply:
          "Shalom. Bring me a verse, a line of Torah, or even just a feeling, and we’ll begin learning together.",
      });
    }

    // Build a small "context" from the last user message in the convo
    const lastTurn = [...conversation].reverse().find((c) => c.role === "user");
    const lastMessage = lastTurn ? lastTurn.content : null;

    // Simple chavruta-style reply (hand-crafted, no external API)
    let reply = "";

    reply += `You brought: "${message}".\n\n`;

    if (lastMessage && lastMessage !== message) {
      reply += `Previously you said: "${lastMessage}". I’m holding that together with what you just shared.\n\n`;
    }

    reply +=
      "Let’s treat this like we’re sitting over an open sefer together:\n\n";

    reply +=
      "1. **Notice a word or phrase** that pulls at you. What is it, and why do you think it stands out?\n";
    reply +=
      "2. **Where have you seen something like this before?** Another verse, a teaching, or a moment in your own life?\n";
    reply +=
      "3. **What is the question behind your question?** If you had to name the deeper thing you’re really asking, what would it be?\n\n";

    reply +=
      "If you’d like, tell me:\n- The exact pasuk (book / chapter / verse), or\n- Whether this feels more like a question of pshat (simple meaning), drash (interpretation), sod (mystery), or your own life right now.\n\n";

    reply += "What stands out to you most in what you just brought?";

    return jsonResponse(200, { reply });
  } catch (err) {
    console.error("Offline ChavrutaGPT server error:", err);
    return jsonResponse(500, {
      reply:
        "There was an internal error in the chavruta function. Please try again in a little while.",
    });
  }
};
