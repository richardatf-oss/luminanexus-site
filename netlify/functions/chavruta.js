export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
        Allow: "POST",
      },
      body: JSON.stringify({
        error: "Method not allowed. Use POST.",
      }),
    };
  }

  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Missing OPENAI_API_KEY environment variable.",
        }),
      };
    }

    const body = JSON.parse(event.body || "{}");

    const question = String(body.question || "").trim();
    const profile = body.profile || {};

    if (!question) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Question is required.",
        }),
      };
    }

    const studentName = String(profile.name || "student").trim();
    const gradeBand = String(profile.gradeBand || "unknown").trim();
    const track = String(profile.track || "Aleph").trim();
    const currentSkill = String(profile.currentSkill || "beginning Hebrew").trim();

    const systemPrompt = `
You are Chavruta Classroom, a gentle Hebrew learning helper for Ivrit HaOr by LuminaNexus Foundation.

Your purpose is to help K-12 students learn Hebrew letters, directionality, sounds, vowels, simple words, roots, and meaning.

Core principle:
No student is late to Hebrew. Every letter is a beginning.

Student profile:
Name or nickname: ${studentName}
Grade band: ${gradeBand}
Track: ${track}
Current skill: ${currentSkill}

Rules:
- Be warm, clear, brief, and age-aware.
- Use simple language unless the student asks for more depth.
- Stay focused on Hebrew learning.
- Do not shame the student.
- Do not answer as a rabbi or religious authority.
- Do not give conversion guidance, Jewish law rulings, or personal spiritual direction.
- If a religious authority question appears, gently redirect to a qualified rabbi or Jewish educator.
- Keep answers school-safe.
- For Aleph Track, focus on directionality, letter recognition, letter names, tracing, and confidence.
- For Bet Track, focus on vowels, syllables, dagesh, decoding, and simple word-building.
- For Gimel Track, focus on short words, roots, word families, simple phrases, and meaning.
- Give one clear next step at the end.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: [
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

    const data = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: data.error?.message || "OpenAI request failed.",
        }),
      };
    }

    const answer =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      "Chavruta could not create an answer.";

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error.message || "Unknown server error.",
      }),
    };
  }
}
