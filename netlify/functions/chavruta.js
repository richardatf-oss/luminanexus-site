exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Method not allowed.',
      }),
    }
  }

  try {
    const { question, mode } = JSON.parse(event.body || '{}')

    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'A valid question is required.',
        }),
      }
    }

    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'Missing OPENAI_API_KEY environment variable.',
        }),
      }
    }

    const systemPrompt = `
You are ChavrutaGPT for LuminaNexus.

Your role:
- guide study with humility, clarity, and reverence
- do not act like a generic assistant
- distinguish between established teaching, interpretation, and reflection
- when useful, connect ideas to the Tree of Life, Hebrew language, contemplative practice, the library, or symbolic architecture
- be concise but meaningful
- never return markdown fences
- return valid JSON only

The JSON schema must be:
{
  "response": "string",
  "relatedPaths": ["string", "string", "string"],
  "nextStep": "string"
}

Rules:
- "response" must be a thoughtful answer
- "relatedPaths" should contain 0 to 5 short pathway strings
- "nextStep" should be one practical or contemplative next step
- output must be valid JSON only, with no commentary before or after

Mode: ${mode || 'study'}
    `.trim()

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5',
        input: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: question,
          },
        ],
      }),
    })

    const data = await openaiResponse.json()

    if (!openaiResponse.ok) {
      return {
        statusCode: openaiResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: data.error?.message || 'OpenAI request failed.',
        }),
      }
    }

    const rawText =
      data.output_text ||
      ''

    if (!rawText) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'The model returned an empty response.',
        }),
      }
    }

    let parsed

    try {
      parsed = JSON.parse(rawText)
    } catch (parseError) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: 'The model returned invalid JSON.',
          raw: rawText,
        }),
      }
    }

    const safeResult = {
      response:
        typeof parsed.response === 'string'
          ? parsed.response.trim()
          : 'No response was returned.',
      relatedPaths: Array.isArray(parsed.relatedPaths)
        ? parsed.relatedPaths
            .filter((item) => typeof item === 'string')
            .map((item) => item.trim())
            .filter(Boolean)
        : [],
      nextStep:
        typeof parsed.nextStep === 'string'
          ? parsed.nextStep.trim()
          : '',
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(safeResult),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: error.message || 'Unexpected server error.',
      }),
    }
  }
}
