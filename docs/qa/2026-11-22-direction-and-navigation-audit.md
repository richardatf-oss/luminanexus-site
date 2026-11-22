# Curriculum direction and navigation audit — 22 November 2026

The audit follows the reported Aleph Lesson 1 reversal and the request to expand sections that felt like dead ends.

## Scope and evidence

- Searched tracked curriculum JSON, HTML, CSS, React components, JavaScript, Python generators, and editable Word sources for directional arrows, reading-order instructions, and mixed-script markup.
- Checked all 100 canonical lessons for sequential IDs, valid answer indexes, and ambiguous inline arrows.
- Scanned all 163 pages of the three downloadable PDF workbooks (Aleph 46, Bet 77, Gimel 40). Visually reviewed the changed direction pages and representative pointed-Hebrew, mixed-language, and readiness-review pages.
- Checked the generated Word sources and replaced the stale public Aleph Word download with the active 36-lesson workbook.
- Traced the existing live pages and checked local links. The stronger build check validates cross-page fragments as well as file existence.

## Corrections

| Finding | Correction |
| --- | --- |
| Aleph Lesson 1 put English “Start” and “Right edge” at the physical left and used a right-pointing arrow. | A diagram explicitly places Finish / Left edge at the left and Start / Right edge at the right. Its vector arrow points left. |
| Aleph Lesson 3 mixed a right-pointing arrow into a Hebrew sequence. | Removed inline arrows and used the same physical diagram with an isolated Hebrew sequence starting with Aleph at the right. |
| The foundation renderer labeled every example as Hebrew, including English and mixed explanations. | A shared sample renderer keeps English LTR and isolates actual Hebrew runs RTL. Bet’s renderer uses the same helper. |
| Bet choices combined Hebrew with English words inside a Hebrew-only span. | Regenerated the page with isolated Hebrew runs inside an English explanation. |
| Word-to-PDF conversion substituted fonts and rendered complex-script examples too small. | Set Hebrew complex-script fonts and sizes explicitly, check font availability, and regenerate Aleph and Gimel Word/PDF workbooks. |
| Bet PDF prose containing Hebrew used an unshaped LTR text call. | Shape mixed prose before placing it in the PDF; preserve the existing illustrations and 77-page layout. |
| Bet linked to an absent Aleph `#stick-vowels` section. | Link to the actual vowel introduction in Aleph Lesson 4 and correct the generator. |
| The Source Library described the last letter of shalom as a regular Mem. | Identify final Mem, ם, and its retained m sound. |
| Gimel’s sea/hand comparison said the first two letters were alike. | Specify that the first letter and vowel are alike; the final consonant changes. |
| Old component links and gate explanations used unnecessary directional arrow glyphs. | Remove decorative link arrows and describe English-name sequences with “followed by.” |

## Deeper destinations

- Eight guided Jewish study introductions include context, source links, a concrete study task, and a next destination.
- A teaching resource hub provides all workbooks, a lesson planner populated from the canonical course data, a four-week school-start framework, and family-practice guidance.
- The Source Library includes a short bilingual reader backed by the existing Sefaria service. A direct source link remains available when a passage cannot load.
- The navigation and homepage connect directly to these destinations while preserving existing sections and lesson links.

## Ongoing checks

`pnpm run check` now validates local files and section destinations, tests script-direction rendering, and checks all canonical lessons. Workbook regeneration uses `python scripts/build_hebrew_tracks.py`; the builders preserve the shared navigation and reading-direction helpers.

Visual review targeted the affected layouts and representative examples; the automated scans covered the full source and published-workbook set described above. These checks should accompany future curriculum changes.
