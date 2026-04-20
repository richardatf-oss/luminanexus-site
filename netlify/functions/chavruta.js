const helpers = require('./lib/findLibraryContext')

function extractText(data) {
  if (data && typeof data.output_text === 'string' && data.output_text.trim()) {
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  try {
    var parsedBody = JSON.parse(event.body || '{}')
    var question = parsedBody.question
    var mode = parsedBody.mode || 'study'

    if (!question || typeof question !== 'string') {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'A valid question is required.' }),
      }
    }

    var apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing OPENAI_API_KEY environment variable.' }),
      }
    }

    var matches = helpers.findLibraryContext(question, 3)
    var contextBlock = buildContextBlock(matches)

    var systemPrompt = [
      'You are ChavrutaGPT for LuminaNexus.',
      'You are a calm, reverent, structured study companion.',
      'You are not a generic chatbot.',
      'Use the LuminaNexus context when relevant.',
      'Do not invent details not present in the context.',
      'When discussing a sefirah, place it relationally within the Tree.',
      'Occasionally use shared language like "we can see" or "we might notice".',
      'Return valid JSON only.',
      'Schema:',
      '{',
      '  "response": "string",',
      '  "relatedPaths": [ { "label": "string", "href": "string" } ],',
      '  "nextStep": "string"',
      '}',
      'Use anchors: #tree, #library, #chavruta, #ivritcode',
      'Keep the response concise.',
      'Mode: ' + mode,
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
          Authorization: 'Bearer ' + apiKey,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          max_output_tokens: 300,
          input: [
            {
              role: 'system',
              content: [{ type: 'input_text', text: systemPrompt }],
            },
            {
              role: 'user',
              content: [{ type: 'input_text', text: question }],
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: data && data.error ? data.error.message : 'OpenAI request failed.',
        }),
      }
    }

    var rawText = extractText(data)

    if (!rawText) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'The model returned an empty response.' }),
      }
    }

    var parsedResult

    try {
      parsedResult = JSON.parse(rawText)
    } catch (e) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON from model.', debug: rawText }),
      }
    }

    var safePaths = []
    if (Array.isArray(parsedResult.relatedPaths)) {
      parsedResult.relatedPaths.forEach(function (item) {
        if (item && item.label && item.href) {
          safePaths.push({
            label: item.label.trim(),
            href: item.href.trim(),
          })
        }
      })
    }

    var sources = matches.map(function (entry) {
      return {
        label: entry.title,
        href: '#library',
      }
    })

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        response: parsedResult.response || '',
        relatedPaths: safePaths,
        nextStep: parsedResult.nextStep || '',
        sources: sources,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.name === 'AbortError'
          ? 'Request timed out.'
          : error.message,
      }),
    }
  }
}
