// functions/chavruta-chat.js

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event, context) {
  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // Only allow POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Missing OPENAI_API_KEY");
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server configuration error",
        detail: "OPENAI_API_KEY is not set on Netlify.",
      }),
    };
  }

  let incomingMessages = [];
  try {
    const body = JSON.parse(event.body || "{}");
    if (Array.isArray(body.messages)) {
      incomingMessages = body.messages;
    }
  } catch (err) {
    console.error("Bad JSON body:", err);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Bad Request",
        detail: "Could not parse JSON body.",
      }),
    };
  }

  const systemMessage = {
    role: "system",
    content:
      "You are ChavrutaGPT, a gentle, non-polemical Torah study partner on LuminaNexus.org. " +
      "You help the user explore Jewish texts, Sefaria sources, and the Celestial Library of 231 Gates. " +
      "You explain calmly, ask clarifying questions when helpful, and always stay respectful and grounded.",
  };

  const payload = {
    model: "gpt-4o-mini",
    messages: [systemMessage, ...incomingMessages],
    temperature: 0.7,
  };

  try {
    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
    });

    const text = await apiRes.text();

    if (!apiRes.ok) {
      console.error("OpenAI error:", apiRes.status, text);
      return {
        statusCode: apiRes.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "OpenAI API error",
          detail: text,
        }),
      };
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse OpenAI JSON:", err, text);
      return {
        statusCode: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Bad response from OpenAI",
          detail: "Could not parse JSON.",
        }),
      };
    }

    const message =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message;

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    };
  } catch (err) {
    console.error("Chavruta function error:", err);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Server error",
        detail: err.message || String(err),
      }),
    };
  }
};
