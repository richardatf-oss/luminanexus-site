"""Keep Hebrew runs and English explanations in their own writing directions."""
from html import escape
import re

HEBREW = re.compile(r'[\u0590-\u05ff]+(?:[ \t]+[\u0590-\u05ff]+)*')
LATIN = re.compile(r'[A-Za-z]')

def sample_html(text):
    if not HEBREW.search(text):
        return f'<span class="sample-english" lang="en" dir="ltr">{escape(text)}</span>'
    if not LATIN.search(text):
        return f'<bdi class="sample-hebrew" lang="he" dir="rtl">{escape(text)}</bdi>'
    parts=[]; end=0
    for match in HEBREW.finditer(text):
        parts.append(escape(text[end:match.start()]))
        parts.append(f'<bdi class="sample-hebrew" lang="he" dir="rtl">{escape(match.group())}</bdi>')
        end=match.end()
    parts.append(escape(text[end:]))
    return '<span class="sample-mixed" lang="en" dir="ltr">'+''.join(parts)+'</span>'

def direction_html():
    return '''<div class="reading-direction" role="img" aria-label="Hebrew reading: start at the right edge and move left to the finish.">
<span class="direction-finish"><strong>Finish</strong><span>Left edge</span></span>
<svg class="direction-line" viewBox="0 0 200 24" aria-hidden="true" focusable="false"><path d="M190 12 H10 M26 3 L10 12 L26 21" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>
<span class="direction-start"><strong>Start</strong><span>Right edge</span></span></div>'''
