// netlify/functions/chavruta-gpt.js

exports.handler = async (event, context) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const message = body.message || "";
    const conversation = body.conversation || [];

    console.log("Chavruta function received:", { message, conversation });

    // For now, just respond chavruta-style to whatever they send:
    const reply = message
      ? `You brought: "${message}". What word or phrase stands out to you most, and why?`
      : "Bring me a verse, a question, or a thought, and we’ll begin.";

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
        reply: "There was a server error in the Chavruta function. Please try again.",
      }),
    };
  }
};
