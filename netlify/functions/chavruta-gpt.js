// netlify/functions/chavruta-gpt.js

// This is a simple Netlify Function that responds in a chavruta style.
// It expects a POST request with JSON like:
// { "message": "your question or text", "conversation": [ ... ] }

exports.handler = async (event, context) => {
  try {
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: "Please use POST for ChavrutaGPT." }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const conversation = body.conversation || [];

    console.log("Chavruta function received:", { message, conversation });

    let reply;

    if (!message) {
      reply =
        "Shalom. Bring me a verse, a question, or a thought, and we’ll begin learning together.";
    } else {
      reply =
        `You brought: "${message}". ` +
        "If we sit with these words for a moment, what stands out to you most — a single word, an image, or a feeling?";
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Chavruta function error:", err);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reply:
          "There was a server error in the Chavruta function. Please try again in a little while.",
      }),
    };
  }
};
