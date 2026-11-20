# Ivrit HaOr curriculum sources

Each reading track has one canonical lesson source. The build scripts generate the online material and printable workbook from those records.

- `aleph-track.json` contains the active 36-lesson Aleph sequence, including its class vowel cues and interactive checks.
- `bet-track.json` contains the 32-lesson Bet decoding course.
- `gimel-track.json` contains all 32 Gimel reading lessons, vocabulary examples, pronunciations, meanings, and quiz answers. The course keeps its existing progress tracking and interactive map.

Run `python scripts/build_hebrew_tracks.py` to regenerate all three tracks. Pass track names to build selected courses, for example `python scripts/build_hebrew_tracks.py Aleph Gimel`. Aleph and Gimel are built by `scripts/build_foundation_tracks.py`; Bet is built by `scripts/build_bet_track.py`.

Regeneration requires Python 3, `python-docx`, LibreOffice (`soffice`), Pillow, fontTools, and ReportLab. Bet’s illustration/PDF builder uses the last three packages; all tracks use the DOCX and PDF tools.

The build creates the Aleph and Gimel lesson pages, Gimel runtime data, editable DOCX workbooks under `docs/workbooks-source/`, and matching PDFs under `public/downloads/`. Bet has its own generator and the same canonical-source rule. Hebrew display uses Frank Ruhl Libre. Classroom cues are memory aids; teacher notes preserve pronunciation differences and vowel scope.
