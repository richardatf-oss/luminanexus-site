import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const scriptPath = path.join(root, "public/gimel-track.js");
const pagePath = path.join(root, "public/gimel-track.html");
const startMarker = "<!-- GIMEL STATIC FALLBACK START -->";
const endMarker = "<!-- GIMEL STATIC FALLBACK END -->";

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));

const source = await readFile(scriptPath, "utf8");
const dataMatch = source.match(/const lessons = (\[[\s\S]*?\]);\s*const firstLessonData/);
if (!dataMatch) throw new Error("Could not find the Gimel lesson data array.");
const lessons = JSON.parse(dataMatch[1]);
if (lessons.length !== 31) throw new Error(`Expected 31 lessons after lesson 1; found ${lessons.length}.`);

const lessonCards = lessons.map((lesson, index) => {
  const number = index + 2;
  const choices = lesson.choices.map((choice) => `<li>${escapeHTML(choice)}</li>`).join("");
  return `
          <li class="gimel-fallback-lesson">
            <details>
              <summary>Lesson ${number} · ${escapeHTML(lesson.title)}</summary>
              <p><strong>Goal:</strong> ${escapeHTML(lesson.focus)}</p>
              <p class="gimel-word" lang="he" dir="rtl">${escapeHTML(lesson.word)}</p>
              <p><strong>Read it:</strong> ${escapeHTML(lesson.say)} · <strong>Meaning:</strong> ${escapeHTML(lesson.meaning)}.</p>
              <p><strong>Practice:</strong> ${escapeHTML(lesson.cue)}</p>
              <p><strong>Check your understanding:</strong> ${escapeHTML(lesson.question)}</p>
              <ul>${choices}</ul>
              <details><summary>Show the answer</summary><p>${escapeHTML(lesson.choices[lesson.answer])} · ${escapeHTML(lesson.word)} means ${escapeHTML(lesson.meaning)}.</p></details>
            </details>
          </li>`;
}).join("\n");

const fallback = `${startMarker}
      <section id="gimel-static-fallback" class="card" aria-labelledby="gimel-fallback-heading">
        <h2 id="gimel-fallback-heading">Gimel Lessons · Text-Only Path</h2>
        <p>Interactive checks need JavaScript, but the complete 32-lesson sequence is still available here. Lesson 1 appears above; open a lesson below to read the word, practice cue, choices, and self-check answer. Your progress will not be saved in this mode.</p>
        <p><a class="button" href="/downloads/Gimel_Track_Printable.pdf">Download the printable workbook</a></p>
        <ol class="gimel-fallback-list">${lessonCards}
        </ol>
      </section>
    ${endMarker}`;

let page = await readFile(pagePath, "utf8");
if (page.includes(startMarker) && page.includes(endMarker)) {
  const begin = page.indexOf(startMarker);
  const finish = page.indexOf(endMarker, begin) + endMarker.length;
  page = `${page.slice(0, begin)}${fallback}${page.slice(finish)}`;
} else {
  const insertionPoint = page.lastIndexOf("    </main>");
  if (insertionPoint < 0) throw new Error("Could not find the Gimel main section to insert the fallback.");
  page = `${page.slice(0, insertionPoint)}    ${fallback}\n${page.slice(insertionPoint)}`;
}

await writeFile(pagePath, page);
