const headers = {
  "Content-Type": "application/json",
};

function json(statusCode, payload) {
  return {
    statusCode: statusCode,
    headers: headers,
    body: JSON.stringify(payload),
  };
}

function extractText(data) {
  if (data && typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  if (data && Array.isArray(data.output)) {
    var chunks = [];

    for (var i = 0; i < data.output.length; i += 1) {
      var item = data.output[i];

      if (item && Array.isArray(item.content)) {
        for (var j = 0; j < item.content.length; j += 1) {
          var part = item.content[j];

          if (part && typeof part.text === "string" && part.text.trim()) {
            chunks.push(part.text.trim());
          }
        }
      }
    }

    if (chunks.length) {
      return chunks.join("\n").trim();
    }
  }

  return "";
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  try {
    var parsedBody = JSON.parse(event.body || "{}");
    var question = parsedBody.question;
    var mode = parsedBody.mode || "hebrew-classroom";

    if (!question || typeof question !== "string") {
      return json(400, { error: "A valid question is required." });
    }

    var apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return json(500, {
        error: "Missing OPENAI_API_KEY environment variable.",
      });
    }

    var systemPrompt = [
      "You are Chavruta Classroom for LuminaNexus Foundation.",
      "You are a warm, clear, school-safe Hebrew enrichment tutor for K-12 students.",
      "The curriculum is Ivrit HaOr: Hebrew for Every Grade, Every Beginning.",
      "",
      "Core principle:",
      "No student is late to Hebrew. Every letter is a beginning.",
      "Place students by readiness, not shame, age, or grade level.",
      "",
      "Your educational focus:",
      "- Hebrew letters",
      "- Hebrew directionality, right to left",
      "- letter recognition",
      "- sounds and pronunciation",
      "- vowels and syllables",
      "- simple vocabulary",
      "- roots when appropriate",
      "- names in Hebrew",
      "- culture, meaning, memory, and language",
      "- confidence-building practice",
      "",
      "Tracks:",
      "Aleph Track: total beginners at any age or grade. Focus on directionality, letter shapes, sounds, names, and confidence.",
      "Bet Track: students who know some letters and are ready for vowels, syllables, decoding, simple words, and roots.",
      "Gimel Track: students ready for short phrases, reading with meaning, fluency, roots, and cultural context.",
      "",
      "Tone:",
      "Be encouraging, simple, age-aware, and practical.",
      "Use short paragraphs.",
     "Give one clear next step.",
"Do not include a Next step section inside the response field. Put the next step only in the nextStep field.",
"When explaining Bet, say that the dot is called a dagesh.",
"Avoid making any student feel behind.",
"Do not over-spiritualize beginner questions.",
      "Do not use Kabbalah, sefirot, Tree of Life, gematria, or mystical interpretations unless the user specifically asks for that and the answer remains age-appropriate.",
      "",
      "Religious and cultural boundaries:",
      "This program may mention God or sacred tradition respectfully, but it is primarily Hebrew enrichment.",
      "Keep prayers, blessings, sacred phrases, conversion issues, Jewish law, and theology minimal unless directly asked.",
      "If asked for Jewish law, conversion guidance, religious rulings, or personal spiritual authority, gently say that a qualified rabbi or Jewish educator should guide that question.",
      "Do not present yourself as a rabbi.",
      "",
      "Hebrew accuracy notes:",
      "Aleph is the first Hebrew letter.",
      "Aleph is usually silent by itself and carries the vowel sound placed with it.",
      "Do not teach Aleph as simply making an 'ah' sound. Say that an 'ah' sound comes from a vowel mark, not from Aleph alone.",
      "Bet can sound like B with a dot, and Vet can sound like V without the dot in many Hebrew learning systems.",
      "Hey is the fifth Hebrew letter.",
      "Ayin is usually silent in modern beginner Hebrew pronunciation and carries its vowel.",
      "",
      "When answering, return ONLY valid JSON.",
      "Do not include markdown fences.",
      "Do not include commentary outside the JSON object.",
      "",
      "The JSON must have:",
      "response: the main answer",
      "relatedPaths: an array of helpful site links",
      "nextStep: one simple suggested next action",
      "",
      "Useful site anchors:",
      "#ivrit-haor, #chavruta, #tracks, #pilot, #support",
      "",
      "Mode: " + mode,
    ].join("\n");
"Do not include a Next step section inside the response field. Put the next step only in the nextStep field.",
"When explaining Bet, say that the dot is called a dagesh.",
    var controller = new AbortController();
    var timeoutId = setTimeout(function () {
      controller.abort();
    }, 18000);

    var openaiResponse;

    try {
      openaiResponse = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + apiKey,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_output_tokens: 450,
          text: {
            format: {
              type: "json_schema",
              name: "chavruta_classroom_response",
              strict: true,
              schema: {
                type: "object",
                additionalProperties: false,
                properties: {
                  response: {
                    type: "string",
                  },
                  relatedPaths: {
                    type: "array",
                    items: {
                      type: "object",
                      additionalProperties: false,
                      properties: {
                        label: {
                          type: "string",
                        },
                        href: {
                          type: "string",
                        },
                      },
                      required: ["label", "href"],
                    },
                  },
                  nextStep: {
                    type: "string",
                  },
                },
                required: ["response", "relatedPaths", "nextStep"],
              },
            },
          },
          input: [
            {
              role: "system",
              content: [
                {
                  type: "input_text",
                  text: systemPrompt,
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "input_text",
                  text: question,
                },
              ],
            },
          ],
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    var data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      return json(openaiResponse.status, {
        error:
          data && data.error && data.error.message
            ? data.error.message
            : "OpenAI request failed.",
      });
    }

    var rawText = extractText(data);

    if (!rawText) {
      return json(500, {
        error: "The model returned an empty response.",
      });
    }

    var parsedResult;

    try {
      parsedResult = JSON.parse(rawText);
    } catch (error) {
      return json(500, {
        error: "Invalid JSON from model.",
        debug: rawText.slice(0, 300),
      });
    }

    var safePaths = [];

    if (Array.isArray(parsedResult.relatedPaths)) {
      parsedResult.relatedPaths.forEach(function (item) {
        if (item && item.label && item.href) {
          safePaths.push({
            label: String(item.label).trim(),
            href: String(item.href).trim(),
          });
        }
      });
    }

    return json(200, {
      response: parsedResult.response || "",
      relatedPaths: safePaths,
      nextStep: parsedResult.nextStep || "",
      sources: [],
    });
  } catch (error) {
    return json(500, {
      error:
        error && error.name === "AbortError"
          ? "Chavruta Classroom timed out."
          : error && error.message
            ? error.message
            : "Unexpected server error.",
    });
  }
};
