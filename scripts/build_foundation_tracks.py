"""Generate Aleph and Gimel lesson pages and print workbooks from curriculum JSON."""
from html import escape
import json
from pathlib import Path
import subprocess
import sys
from urllib.parse import urlencode

from docx import Document
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.shared import Inches, Pt, RGBColor

ROOT = Path(__file__).resolve().parents[1]
CURRICULUM = ROOT / "docs" / "curriculum"
PUBLIC = ROOT / "public"
DOWNLOADS = PUBLIC / "downloads"
WORKBOOKS = ROOT / "docs" / "workbooks-source"


def read_data(track):
    return json.loads((CURRICULUM / f"{track.lower()}-track.json").read_text())


def hebrew(text):
    return f'<span lang="he" dir="rtl">{escape(text)}</span>'


def chavruta_url(track, lesson):
    prompt = (f"I am studying {track} Track lesson {lesson['id']}: "
              f"{lesson['title']}. {lesson['goal']} Help me practice the focus "
              f"{lesson['focus']} and these examples: {'; '.join(lesson['examples'])}.")
    return "/?" + urlencode({"chavrutaMode": "hebrew-classroom", "chavrutaQuestion": prompt}) + "#chavruta"


def make_page(data):
    track = data["track"]
    slug = track.lower()
    lessons = data["lessons"]
    title = escape(data["title"])
    html = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} | Ivrit HaOr</title><meta name="description" content="{escape(data['description'])}">
<link rel="stylesheet" href="/styles/hebrew.css"><link rel="stylesheet" href="/styles/lesson-practice.css"><link rel="stylesheet" href="/styles/foundation-track.css"><script src="/lesson-practice.js" defer></script>
<link rel="stylesheet" href="/styles/site-navigation.css">
<script src="/site-navigation.js" defer></script>

<link rel="stylesheet" href="/styles/learning-journey.css">
<script src="/learning-journey.js" defer></script>
</head>
<body><luminanexus-navigation></luminanexus-navigation><header><p>Ivrit HaOr · LuminaNexus Foundation</p><h1>{escape(track)} Track</h1><p class="lead">{escape(data['description'])}</p></header>
<nav class="course-nav" aria-label="{escape(track)} Track navigation"><a href="/downloads/{escape(track)}_Track_Printable.pdf">Printable workbook</a><a href="#lessons">Lesson map</a></nav>
<main id="main-content" tabindex="-1"><section class="intro"><h2>Welcome to {escape(track)}</h2><p>{escape(data['description'])}</p><p>Use a steady rhythm: look carefully, listen to a model, practice together, then try independently. The printable workbook and online lessons follow this same sequence.</p></section>
<section id="lessons"><h2>{len(lessons)} lessons</h2><ol class="lesson-map">'''
    for lesson in lessons:
        html += f'<li><a href="#lesson-{lesson["id"]}">{escape(lesson["title"])}</a><p>{escape(lesson["goal"])}</p></li>'
    html += '</ol></section>'
    for lesson in lessons:
        n = lesson["id"]
        html += f'''<section class="track-lesson" id="lesson-{n}"><p class="eyebrow">{escape(track)} lesson {n} of {len(lessons)}</p>
<h2>{escape(lesson['title'])}</h2><p><strong>Focus:</strong> {hebrew(lesson['focus'])}</p><p><strong>Goal:</strong> {escape(lesson['goal'])}</p>
<h3>Learn together</h3><ul>{''.join(f'<li>{escape(line)}</li>' for line in lesson['teach'])}</ul>
<h3>Read or notice</h3><div class="examples">{''.join(f'<p>{hebrew(item)}</p>' for item in lesson['examples'])}</div>
<h3>Practice</h3><ol>{''.join(f'<li>{escape(item)}</li>' for item in lesson['practice'])}</ol>
<form class="practice-check" data-answer="{lesson['answer']}" data-correct="{escape(lesson['feedback'], quote=True)}" data-retry="Look at the focus and examples above, then try once more.">
<fieldset><legend>{escape(lesson['question'])}</legend>{''.join(f'<label><input type="radio" name="{slug}-{n}" value="{i}"><span>{hebrew(option) if any(0x590 <= ord(ch) <= 0x5ff for ch in option) else escape(option)}</span></label>' for i, option in enumerate(lesson['options']))}</fieldset>
<button type="submit">Check my answer</button><p class="practice-feedback" role="status" aria-live="polite"></p></form>
<p class="readiness"><strong>Ready when:</strong> {escape(lesson['check'])}</p><details><summary>Teacher note and answer</summary><p>{escape(lesson['teacher_note'])}</p><p>{escape(lesson['feedback'])}</p></details>
<div class="lesson-actions">{f'<a href="#lesson-{n-1}">Previous lesson</a>' if n>1 else ''}{f'<a href="#lesson-{n+1}">Next lesson</a>' if n<len(lessons) else '<a href="/placement-quick-check.html">Review placement guidance</a>'}<a href="{escape(chavruta_url(track, lesson), quote=True)}">Ask Chavruta about this lesson</a></div></section>'''
    html += f'''</main><footer>© 2026 LuminaNexus Foundation · Ivrit HaOr · <a href="/downloads/{escape(track)}_Track_Printable.pdf">Download the printable workbook</a></footer></body></html>'''
    (PUBLIC / f"{slug}-track.html").write_text(html)


def make_gimel_runtime(data):
    template = (ROOT / "scripts" / "templates" / "gimel-track-runtime.js").read_text()
    # Lesson one remains in the static page; this file renders lessons 2–32.
    records = [{key: value for key, value in lesson.items() if key != "id"} for lesson in data["lessons"][1:]]
    first = {key: value for key, value in data["lessons"][0].items() if key != "id"}
    runtime = template.replace("__LESSONS_JSON__", json.dumps(records, ensure_ascii=False))
    runtime = runtime.replace("__FIRST_LESSON_JSON__", json.dumps(first, ensure_ascii=False))
    (PUBLIC / "gimel-track.js").write_text(runtime)
    page = PUBLIC / "gimel-track.html"
    text = page.read_text().replace(
        "The linked PDF is an earlier edition. Use the online lessons for the expanded 32-lesson sequence.",
        "The printable workbook follows the same 32-lesson sequence as the online course.",
    )
    text = text.replace("אור", first["word"])
    text = text.replace(
        "This Gimel Track page will continue to grow as the workbook expands.\n          Upcoming lessons may include more simple Hebrew words, word families,\n          roots, short phrases, careful reading from right to left, and meaning\n          connections.",
        "The full 32-lesson Gimel reading sequence is available online and in\n          the matching printable workbook. It builds from decoding familiar\n          words to phrases, dialogue, and connected meaning.",
    )
    text = text.replace(
        "The online track is expanded to 32 lessons. The linked printable PDF is an earlier edition and will need a matching expansion.",
        "The online lessons and printable workbook follow the same 32-lesson sequence.",
    )
    page.write_text(text)


def make_workbook(data):
    track = data["track"]
    doc = Document()
    section = doc.sections[0]
    section.top_margin = section.bottom_margin = Inches(.7)
    section.left_margin = section.right_margin = Inches(.75)
    normal = doc.styles["Normal"]
    normal.font.name = "Aptos"
    normal.font.size = Pt(11)
    normal.font.color.rgb = RGBColor(37, 49, 58)
    normal.paragraph_format.space_after = Pt(6)

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run("IVRIT HAOR\n")
    r.bold = True
    r.font.size = Pt(14)
    r.font.color.rgb = RGBColor(182, 138, 50)
    r = p.add_run(f"{track} Track\nStudent Workbook")
    r.bold = True
    r.font.size = Pt(30)
    doc.add_paragraph(data["description"])
    doc.add_paragraph(f"{len(data['lessons'])} lessons · Look carefully · Read gently · Explain meaning")
    doc.add_paragraph("Student: _____________________________________    Hebrew name: __________________________")
    doc.add_page_break()

    doc.add_heading("Lesson map", 0)
    for lesson in data["lessons"]:
        goal = lesson.get("goal", lesson.get("focus", lesson.get("meaning", "")))
        doc.add_paragraph(f"{lesson['id']}. {lesson['title']} — {goal}")
    doc.add_paragraph("Use one lesson at a time. A learner may repeat a lesson or split it across sessions.")

    for lesson in data["lessons"]:
        doc.add_page_break()
        doc.add_heading(f"Lesson {lesson['id']}: {lesson['title']}", 0)
        doc.add_heading("Focus", 2)
        p = doc.add_paragraph(lesson.get("word", lesson["focus"]))
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Frank Ruhl Libre"
            run.font.size = Pt(28)
        doc.add_heading("Goal", 2)
        doc.add_paragraph(lesson.get("goal", lesson.get("focus", "")))
        if lesson.get("say"):
            doc.add_paragraph(f"Read it: {lesson['say']} · Meaning: {lesson['meaning']}")
        if lesson.get("teach"):
            doc.add_heading("Learn together", 2)
            for line in lesson["teach"]:
                doc.add_paragraph(line, style="List Bullet")
        doc.add_heading("Examples", 2)
        for example in lesson.get("examples", [lesson.get("word", "")]):
            p = doc.add_paragraph(example)
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            for run in p.runs:
                run.font.name = "Frank Ruhl Libre"
                run.font.size = Pt(20)
        doc.add_heading("Practice", 2)
        tasks = lesson.get("practice", [lesson.get("cue", "Read the word, write it, then explain what it means."), "Read the word again and show the meaning."])
        for task in tasks:
            doc.add_paragraph(task, style="List Number")
            doc.add_paragraph("________________________________________________________________________")
        doc.add_heading("Check your learning", 2)
        doc.add_paragraph(lesson.get("check", lesson.get("focus", "")))
        doc.add_paragraph("□ Not yet     □ With help     □ By myself")
        if lesson.get("teacher_note"):
            doc.add_paragraph(f"Teacher note: {lesson['teacher_note']}")

    doc.add_page_break()
    doc.add_heading("Teacher answer key", 0)
    for lesson in data["lessons"]:
        doc.add_heading(f"Lesson {lesson['id']}: {lesson['title']}", 2)
        choices = lesson.get("options", lesson.get("choices", []))
        doc.add_paragraph(f"Question: {lesson['question']}")
        doc.add_paragraph(f"Answer: {choices[lesson['answer']]}")
        doc.add_paragraph(lesson.get("feedback", f"{lesson.get('word', '')} means {lesson.get('meaning', '')}."))

    footer = section.footer.paragraphs[0]
    footer.alignment = WD_ALIGN_PARAGRAPH.CENTER
    footer.add_run(f"Ivrit HaOr · {track} Track · LuminaNexus Foundation")
    WORKBOOKS.mkdir(parents=True, exist_ok=True)
    out = WORKBOOKS / f"{track}_Track_Curriculum.docx"
    doc.save(out)
    return out


def build(track):
    data = read_data(track)
    ids = [lesson["id"] for lesson in data["lessons"]]
    if ids != list(range(1, len(ids) + 1)):
        raise ValueError(f"{track}: lesson ids must be sequential")
    for lesson in data["lessons"]:
        required = (("title", "word", "say", "meaning", "focus", "cue", "question", "choices") if track == "Gimel" else ("title", "focus", "goal", "teach", "examples", "practice", "check", "question", "options", "teacher_note"))
        if not all(lesson.get(key) for key in required):
            raise ValueError(f"{track} lesson {lesson['id']} is incomplete")
        choices = lesson.get("options", lesson.get("choices", []))
        if not 0 <= lesson["answer"] < len(choices):
            raise ValueError(f"{track} lesson {lesson['id']} has an invalid answer index")
    if track == "Aleph":
        make_page(data)
    else:
        if len(data["lessons"]) != 32:
            raise ValueError("Gimel must contain 32 lessons")
        make_gimel_runtime(data)
    docx = make_workbook(data)
    DOWNLOADS.mkdir(parents=True, exist_ok=True)
    subprocess.run(["soffice", "--headless", "--convert-to", "pdf", "--outdir", str(DOWNLOADS), str(docx)], check=True, capture_output=True)
    pdf = DOWNLOADS / f"{track}_Track_Curriculum.pdf"
    target = DOWNLOADS / f"{track}_Track_Printable.pdf"
    if pdf.exists():
        pdf.replace(target)
    print(f"Built {track}: {len(data['lessons'])} lessons; {target}")


if __name__ == "__main__":
    for track in sys.argv[1:] or ["Aleph", "Gimel"]:
        build(track)
