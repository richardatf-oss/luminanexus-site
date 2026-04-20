const helpers = require('./lib/findLibraryContext')

function extractText(data) {
  if (
    data &&
    typeof data.output_text === 'string' &&
    data.output_text.trim()
  ) {
    return data.output_text.trim()
  }

  if (data && Array.isArray(data.output)) {
    var chunks = []

    for (var i = 0; i < data.output.length; i += 1) {
      var item = data.output[i]

      if (item && Array.isArray(item.content)) {
        for (var j = 0; j < item.content.length; j += 1) {
          var part = item.content[j]

          if (part && typeof part.text === 'string' && part.text.trim()) {
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

function buildContextBlock(matches) {
  if (!matches || !matches.length) {
    return 'No matching LuminaNexus context was found.'
  }

  return matches
    .map(function (entry, index) {
      return [
        '[Context ' + (index + 1) + ']',
        'Title: ' + entry.title,
        'Tags: ' + entry.tags.join(', '),
        'Content: ' + entry.content,
      ].join('\n')
    })
    .join('\n\n')
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
    var parsedBody = JSON.parse(event.body || '{}')
    var question = parsedBody.question
    var mode = parsedBody.mode

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

    var apiKey = process.env.OPENAI_API_KEY

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

    var selectedMode = mode || 'study'
    var matches = helpers.findLibraryContext(question, 3)
    var contextBlock = buildContextBlock(matches)

    var systemPrompt = [
      'You are ChavrutaGPT for LuminaNexus.',
      'You are a calm, reverent, structured study companion.',
      'You are not a generic chatbot.',
      'Use the supplied LuminaNexus context when it is relevant.',
      'Do not pretend the context says more than it says.',
      'When speaking about a sefirah, locate it relationally within the Tree when appropriate.',
      'Occasionally use a shared-study tone such as "we can see" or "we might notice" when natural.',
      'Return valid JSON only.',
      'Schema:',
      '{',
      '  "response": "string",',
      '  "relatedPaths": [',
      '    { "label": "string", "href": "string" }',
      '  ],',
      '  "nextStep": "string"',
      '}',
      'Use anchors when helpful: #tree, #library, #chavruta, #ivritcode, #support.',
      'Keep the response concise and meaningful.',
      'Mode: ' + selectedMode,
      '',
      'LuminaNexus context:',
      contextBlock,
    ].join('\n')

    var controller = new AbortController()
    var timeoutId = setTimeout(function () {
      controller.abort()
    }, 18000)

    var openaiResponse

    try {
      openaiResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_output_tokens: 300,
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
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeoutId)
    }

    var data = await openaiResponse.json()

    if (!openaiResponse.ok) {
      return {
        statusCode: openaiResponse.status,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error:
            data &&
            data.error &&
            data.error.message
              ? data.error.message
              : 'OpenAI request failed.',
        }),
      }
    }

    var rawText = extractText(data)

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

    var parsedResult

    try {
      parsedResult = JSON.parse(rawText)
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

    var safeRelatedPaths = []

    if (Array.isArray(parsedResult.relatedPaths)) {
      for (var k = 0; k < parsedResult.relatedPaths.length; k += 1) {
        var item = parsedResult.relatedPaths[k]

        if (
          item &&
          typeof item.label === 'string' &&
          typeof item.href === 'string'
        ) {
          var cleanItem = {
            label: item.label.trim(),
            href: item.href.trim(),
          }

          if (cleanItem.label && cleanItem.href) {
            safeRelatedPaths.push(cleanItem)
          }
        }
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response:
          parsedResult && typeof parsedResult.response === 'string'
            ? parsedResult.response.trim()
            : 'No response was returned.',
        relatedPaths: safeRelatedPaths,
        nextStep:
          parsedResult && typeof parsedResult.nextStep === 'string'
            ? parsedResult.nextStep.trim()
            : '',
      }),
    }
  } catch (error) {
    var message =
      error && error.name === 'AbortError'
        ? 'ChavrutaGPT timed out while waiting for a response.'
        : error && error.message
          ? error.message
          : 'Unexpected server error.'

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: message,
      }),
    }
  }
}
