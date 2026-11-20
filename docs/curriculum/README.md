# Bet Track source

`bet-track.json` is the canonical 32-lesson Bet curriculum. Run `scripts/build_bet_track.py` with Python containing Pillow, fontTools and reportlab to generate the online page, 26 new lesson illustrations, and matching 77-page printable workbook. The first six lesson illustrations remain in `public/images/bet-track/`; the remaining illustrations are generated from each lesson's icon and word data.

Each lesson teaches its new consonants or reading pattern before practice, includes meanings and feedback, and maps to two workbook pages. Page 1 introduces the track; pages 2–65 contain lessons 1–32; page 66 contains the readiness review; pages 67–77 contain the teacher practice key.
