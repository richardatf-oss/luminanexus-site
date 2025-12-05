exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error("Missing OPENAI_API_KEY");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing OPENAI_API_KEY" }),
      };
    }

    const body = JSON.parse(event.body || "{}");
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

    // System prompt that defines ChavrutaGPT's style
    const messages = [
      {
        role: "system",
        content:
          "You are ChavrutaGPT, a gentle, non-polemical Torah study partner on LuminaNexus.org. " +
          "You help the user explore Jewish texts, Sefaria sources, and the Celestial Library of 231 Gates. " +
          "You explain calmly, ask helpful questions sometimes, and avoid giving halachic rulings.",
      },
      ...incomingMessages,
    ];

    // Call OpenAI's Chat Completions API directly with fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI error:", response.status, text);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "OpenAI API error" }),
      };
    }

    const data = await response.json();
    const assistantMessage =
      data.choices?.[0]?.message ||
      { role: "assistant", content: "I’m not sure how to respond right now." };

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: assistantMessage }),
    };
  } catch (err) {
    console.error("Chavruta function error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
