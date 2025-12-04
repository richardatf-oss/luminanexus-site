// netlify/functions/chavruta-chat.js

// Simple Netlify Function that proxies chat to OpenAI
exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  // Make sure we have an API key
  if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OPENAI_API_KEY env var");
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Server configuration error",
        detail: "OPENAI_API_KEY is not set on Netlify.",
      }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

    const systemMessage = {
      role: "system",
      content:
        "You are ChavrutaGPT, a gentle, non-polemical Torah study partner on LuminaNexus.org. " +
        "You help the user explore Jewish texts, Sefaria sources, and the Celestial Library of 231 Gates. " +
        "You explain calmly, ask clarifying questions when helpful, and always stay respectful and grounded.",
    };

    const payload = {
      model: "gpt-4o-mini", // safe, affordable chat model :contentReference[oaicite:0]{index=0}
      messages: [systemMessage, ...incomingMessages],
    };

    // Call OpenAI Chat Completions API :contentReference[oaicite:1]{index=1}
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!apiRes.ok) {
      const errText = await apiRes.text();
      console.error("OpenAI error:", apiRes.status, errText);
      return {
        statusCode: apiRes.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "OpenAI API error",
          detail: errText,
        }),
      };
    }

    const data = await apiRes.json();
    const message =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message;

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ message }),
    };
  } catch (err) {
    console.error("Chavruta function error:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        error: "Server error",
        detail: err.message || String(err),
      }),
    };
  }
};
