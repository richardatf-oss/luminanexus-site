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
- answer in three parts:
  1. Response
  2. Related Paths
  3. Suggested Next Step

Keep the tone calm, thoughtful, and grounded.
Be concise but meaningful.
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

    const text =
      data.output_text ||
      'I was able to reflect on your question, but I could not format the response as expected.'

    // Very simple first-pass formatting.
    // Later we can make the model return strict JSON.
    const parts = text.split(/\n\s*\n/).map((part) => part.trim()).filter(Boolean)

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response: parts[0] || text,
        relatedPaths: parts[1]
          ? parts[1]
              .replace(/^Related Paths:?/i, '')
              .split(/\n|,|•|-/)
              .map((item) => item.trim())
              .filter(Boolean)
          : [],
        nextStep: parts[2]
          ? parts[2].replace(/^Suggested Next Step:?/i, '').trim()
          : '',
      }),
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
