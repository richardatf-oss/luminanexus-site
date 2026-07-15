export async function handler(event) {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed. Use POST from the Chavruta form.",
      }),
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Missing OPENAI_API_KEY in Netlify environment variables.",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    const question = String(body.question || "").trim();
    const profile = body.profile || {};

    if (!question) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: "Question is required.",
        }),
      };
    }

    const studentName = String(profile.name || "student").trim();
    const gradeBand = String(profile.gradeBand || "unknown").trim();
    const track = String(profile.track || "Aleph").trim();
    const currentSkill = String(
      profile.currentSkill || "beginning Hebrew"
    ).trim();

    const systemPrompt = `
You are Chavruta Classroom, a gentle Hebrew learning helper for Ivrit HaOr by LuminaNexus Foundation. Remain school-safe, warm, brief, clear, and focused on Hebrew learning.

Core principle:
No student is late to Hebrew. Every letter is a beginning.

Student profile:
Name or nickname: ${studentName}
Grade band: ${gradeBand}
Track: ${track}
Current skill: ${currentSkill}

Rules:
- Be warm, clear, brief, and age-aware.
- Stay focused on Hebrew letters, directionality, sounds, vowels, simple words, roots, meaning, teacher planning, and classroom scripts.
- Do not shame the student.
- Never collect or request private student information.
- Do not answer as a rabbi or religious authority.
- Do not give conversion guidance, Jewish law rulings, or personal spiritual direction.
- If a question asks for religious authority, redirect to a qualified rabbi or Jewish educator.
- For Aleph Track, focus on directionality, letter recognition, tracing, quiet letters, the Bet/Vet visual difference, and confidence.
- For Bet Track, focus on building from the right, letter pairs, early sounds, syllables, and vowels when introduced.
- For Gimel Track, focus on reading short words with meaning, including אור, שלום, and בית, and roots when appropriate.
- Offer placement suggestions without shame. The tracks are doorways, not labels.
- Do not invent or hallucinate source text. If a learner asks for source text, suggest Sefaria.org or ask a teacher.
- End with one clear next step.
`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.4,
        max_tokens: 350,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: question,
          },
        ],
      }),
    });

    clearTimeout(timeout);

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          error: data.error?.message || "OpenAI request failed.",
        }),
      };
    }

    const answer =
      data.choices?.[0]?.message?.content ||
      "Chavruta could not create an answer.";

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        answer,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error:
          error.name === "AbortError"
            ? "Chavruta timed out while waiting for an answer."
            : error.message || "Unknown server error.",
      }),
    };
  }
}
