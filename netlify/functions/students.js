const STORE_NAME = "chavruta-students";
const INDEX_KEY = "index";
const STUDENT_PREFIX = "student-";

const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, X-Teacher-Pin",
  "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
};

function json(statusCode, payload) {
  return {
    statusCode,
    headers,
    body: JSON.stringify(payload),
  };
}

async function getStore() {
  const blobs = await import("@netlify/blobs");
  return blobs.getStore(STORE_NAME);
}

function getHeader(event, name) {
  const target = name.toLowerCase();
  const found = Object.keys(event.headers || {}).find(
    (key) => key.toLowerCase() === target
  );

  return found ? event.headers[found] : "";
}

function requireTeacherPin(event) {
  const expectedPin = process.env.CHAVRUTA_TEACHER_PIN;

  if (!expectedPin) {
    return {
      ok: false,
      response: json(500, {
        error:
          "Missing CHAVRUTA_TEACHER_PIN environment variable in Netlify.",
      }),
    };
  }

  const providedPin = getHeader(event, "x-teacher-pin");

  if (providedPin !== expectedPin) {
    return {
      ok: false,
      response: json(401, {
        error: "Teacher access required.",
      }),
    };
  }

  return { ok: true };
}

function parseBody(event) {
  try {
    return JSON.parse(event.body || "{}");
  } catch (error) {
    return null;
  }
}

function makeId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return (
    "student_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  );
}

function cleanText(value, maxLength) {
  return String(value || "")
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLength);
}

function cleanId(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "")
    .slice(0, 80);
}

function choose(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function cleanStringArray(value, maxItems, maxLength) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => cleanText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function studentKey(id) {
  return STUDENT_PREFIX + cleanId(id);
}

function summarizeStudent(student) {
  return {
    id: student.id,
    displayName: student.displayName,
    gradeBand: student.gradeBand,
    track: student.track,
    currentSkill: student.currentSkill,
    lastLesson: student.lastLesson,
    updatedAt: student.updatedAt,
  };
}

function sanitizeStudent(input, existing) {
  const now = new Date().toISOString();

  const id = existing && existing.id ? existing.id : cleanId(input.id) || makeId();

  return {
    id,

    displayName:
      cleanText(input.displayName, 60) ||
      (existing && existing.displayName) ||
      "New Student",

    gradeBand: choose(
      input.gradeBand,
      ["K-2", "3-5", "6-8", "9-12", "Mixed", "Unknown"],
      existing && existing.gradeBand ? existing.gradeBand : "Unknown"
    ),

    track: choose(
      input.track,
      ["Aleph", "Bet", "Gimel", "Review", "Unknown"],
      existing && existing.track ? existing.track : "Aleph"
    ),

    confidence: choose(
      input.confidence,
      ["new", "beginner", "growing", "confident", "unknown"],
      existing && existing.confidence ? existing.confidence : "new"
    ),

    currentSkill:
      cleanText(input.currentSkill, 160) ||
      (existing && existing.currentSkill) ||
      "Finding Hebrew starting point",

    lastLesson:
      cleanText(input.lastLesson, 160) ||
      (existing && existing.lastLesson) ||
      "",

    progressSummary:
      cleanText(input.progressSummary, 700) ||
      (existing && existing.progressSummary) ||
      "",

    teacherNotes:
      cleanText(input.teacherNotes, 700) ||
      (existing && existing.teacherNotes) ||
      "",

    skillsMastered: cleanStringArray(
      input.skillsMastered ||
        (existing && existing.skillsMastered) ||
        [],
      40,
      100
    ),

    needsPractice: cleanStringArray(
      input.needsPractice ||
        (existing && existing.needsPractice) ||
        [],
      40,
      100
    ),

    createdAt: existing && existing.createdAt ? existing.createdAt : now,
    updatedAt: now,
  };
}

async function getIndex(store) {
  const index = await store.get(INDEX_KEY, { type: "json" });
  return Array.isArray(index) ? index : [];
}

async function saveIndex(store, index) {
  const cleanIndex = index
    .filter((item) => item && item.id)
    .sort((a, b) => String(a.displayName).localeCompare(String(b.displayName)));

  await store.setJSON(INDEX_KEY, cleanIndex);
}

async function upsertIndex(store, student) {
  const index = await getIndex(store);
  const summary = summarizeStudent(student);
  const nextIndex = index.filter((item) => item.id !== student.id);

  nextIndex.push(summary);

  await saveIndex(store, nextIndex);
}

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers,
      body: "",
    };
  }

  const teacherCheck = requireTeacherPin(event);

  if (!teacherCheck.ok) {
    return teacherCheck.response;
  }

  try {
    const store = await getStore();
    const params = event.queryStringParameters || {};
    const id = cleanId(params.id);

    if (event.httpMethod === "GET") {
      if (id) {
        const student = await store.get(studentKey(id), { type: "json" });

        if (!student) {
          return json(404, { error: "Student not found." });
        }

        return json(200, { student });
      }

      const students = await getIndex(store);
      return json(200, { students });
    }

    if (event.httpMethod === "POST") {
      const body = parseBody(event);

      if (!body) {
        return json(400, { error: "Invalid JSON body." });
      }

      const student = sanitizeStudent(body, null);

      await store.setJSON(studentKey(student.id), student);
      await upsertIndex(store, student);

      return json(201, { student });
    }

    if (event.httpMethod === "PUT" || event.httpMethod === "PATCH") {
      const body = parseBody(event);

      if (!body) {
        return json(400, { error: "Invalid JSON body." });
      }

      const targetId = cleanId(body.id || id);

      if (!targetId) {
        return json(400, { error: "Student id is required." });
      }

      const existing = await store.get(studentKey(targetId), { type: "json" });

      if (!existing) {
        return json(404, { error: "Student not found." });
      }

      const student = sanitizeStudent(
        {
          ...existing,
          ...body,
          id: targetId,
        },
        existing
      );

      await store.setJSON(studentKey(student.id), student);
      await upsertIndex(store, student);

      return json(200, { student });
    }

    if (event.httpMethod === "DELETE") {
      if (!id) {
        return json(400, { error: "Student id is required." });
      }

      await store.delete(studentKey(id));

      const index = await getIndex(store);
      const nextIndex = index.filter((item) => item.id !== id);

      await saveIndex(store, nextIndex);

      return json(200, { deleted: true, id });
    }

    return json(405, { error: "Method not allowed." });
  } catch (error) {
    return json(500, {
      error: error && error.message ? error.message : "Unexpected server error.",
    });
  }
};
