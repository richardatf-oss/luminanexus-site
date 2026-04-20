function extractText(data) {
  if (typeof data?.output_text === 'string' && data.output_text.trim()) {
    return data.output_text.trim()
  }

  if (Array.isArray(data?.output)) {
    const chunks = []

    for (const item of data.output) {
      if (Array.isArray(item?.content)) {
        for (const part of item.content) {
          if (typeof part?.text === 'string' && part.text.trim()) {
            chunks.push(part.text.trim())
          }
        }
      }
    }

    if (chunks.length) {
      return chunks.join('\n').trim()
    }
  }

  return ''
}

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

    const selectedMode = mode || 'study'

    const systemPrompt = `
You are ChavrutaGPT for LuminaNexus.

You are not a generic chatbot. You are a guided study companion within a digital sanctuary shaped by the Tree of Life.

Your tone:
- calm
- reverent
- clear
- structured
- companion-like rather than performative
- thoughtful without being vague

Your method:
- guide the user as if studying with them, not lecturing at them
- when relevant, locate the answer within the Tree of Life structure
- distinguish between established teaching, interpretation, and reflection
- prefer spiritually grounded clarity over abstraction
- do not overclaim certainty
- do not use markdown fences
- return valid JSON only

The JSON schema must be:
{
  "response": "string",
  "relatedPaths": [
    { "label": "string", "href": "string" }
  ],
  "nextStep": "string"
}

Rules:
- "response" should feel like guided chavruta
- when discussing a sefirah, place it in relation to other sefirot when appropriate
- "relatedPaths" should contain 0 to 5 meaningful next pathways
- each related path must include a label and href
- use site anchors when possible:
  - #tree
  - #library
  - #chavruta
  - #ivritcode
  - #support
- "nextStep" should be one real contemplative or practical next movement
- output must be valid JSON only, with no commentary before or after

Mode: ${selectedMode}
    `.trim()

    const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: \`Bearer \${apiKey}\`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        input: [
          {
            role: 'system',
            content: [
              {
                type: 'input_text',
                text: systemPrompt,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: question,
              },
            ],
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
          error: data?.error?.message || 'OpenAI request failed.',
        }),
      }
    }

    const rawText = extractText(data)

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
          debug: rawText,
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
            .filter(
              (item) =>
                item &&
                typeof item.label === 'string' &&
                typeof item.href === 'string'
            )
            .map((item) => ({
              label: item.label.trim(),
              href: item.href.trim(),
            }))
            .filter((item) => item.label && item.href)
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
