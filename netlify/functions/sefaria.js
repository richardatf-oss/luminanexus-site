exports.handler = async function (event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed.' }),
    }
  }

  try {
    const ref = event.queryStringParameters && event.queryStringParameters.ref

    if (!ref) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Missing ref parameter.' }),
      }
    }

    const encodedRef = encodeURIComponent(ref)
    const url = `https://www.sefaria.org/api/v3/texts/${encodedRef}?context=0`

    const response = await fetch(url, {
      headers: {
        Accept: 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: data.error || 'Sefaria request failed.',
        }),
      }
    }

    const versions = data.versions || []
    const hebrewVersion = versions.find((item) => item.language === 'he')
    const englishVersion = versions.find((item) => item.language === 'en')

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
      body: JSON.stringify({
        ref: data.ref || ref,
        he: hebrewVersion ? hebrewVersion.text : '',
        en: englishVersion ? englishVersion.text : '',
        url: `https://www.sefaria.org/${ref.replaceAll(' ', '.')}`,
      }),
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        error: error.message || 'Unexpected Sefaria error.',
      }),
    }
  }
}
