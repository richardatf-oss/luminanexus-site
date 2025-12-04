import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // set this in Netlify, NOT in code
});

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

    // Prepend a system prompt that defines ChavrutaGPT’s style
    const messages = [
      {
        role: "system",
        content:
          "You are ChavrutaGPT, a gentle, non-polemical Torah study partner on LuminaNexus.org. " +
          "You help the user explore Jewish texts, Sefaria sources, and the Celestial Library of 231 Gates. " +
          "You ask clarifying questions sometimes, explain calmly, and always respect halakhic and spiritual sensitivity.",
      },
      ...incomingMessages,
    ];

    const response = await client.chat.completions.create({
      model: "gpt-5.1-chat-latest",
      messages,
    }); // :contentReference[oaicite:1]{index=1}

    const assistantMessage = response.choices[0].message;

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
}
