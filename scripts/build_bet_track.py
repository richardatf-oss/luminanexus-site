"""Build Bet's distinct online course and printable from one curriculum source.
Run with the Codex primary Python runtime (Pillow, fontTools, reportlab).
"""
from pathlib import Path
from io import BytesIO
from html import escape
from urllib.parse import urlencode
import json
from PIL import Image,ImageDraw,ImageFont
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
ROOT=Path(__file__).resolve().parents[1]
DATA=json.loads((ROOT/'docs/curriculum/bet-track.json').read_text())
L=DATA['lessons'];TMP=ROOT/'tmp/bet-review';TMP.mkdir(parents=True,exist_ok=True)
FONT=TMP/'Frank-Regular.ttf';BOLD=TMP/'Frank-Bold.ttf'
for path,w in [(FONT,400),(BOLD,700)]:
 f=Font(ROOT/'public/fonts/FrankRuhlLibre.ttf');instantiateVariableFont(f,{'wght':w},inplace=True).save(path)
def he(t):return f'<span lang="he" dir="rtl">{escape(t)}</span>'
def helpurl(l):return '/?'+urlencode({'chavrutaMode':'hebrew-classroom','chavrutaQuestion':f"I am studying Bet Track lesson {l['id']}: {l['title']}. {l['goal']} Help me practice only these words: "+' '.join(w[0] for w in l['words'])})+'#chavruta'
header='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bet Track Building and Reading Words | Ivrit HaOr</title><meta name="description" content="Six illustrated Hebrew reading lessons with explicit vowel teaching, blending, word meanings, practice feedback, and a matching printable workbook."><link rel="stylesheet" href="/styles/hebrew.css"><link rel="stylesheet" href="/styles/lesson-practice.css"><link rel="stylesheet" href="/styles/bet-track.css"><script src="/lesson-practice.js" defer></script></head><body><header><p>Ivrit HaOr · LuminaNexus Foundation</p><h1>Bet Track</h1><p class="lead">Building and Reading Words</p><p>Blend the sounds. Read the word. Tell its meaning.</p></header><nav class="course-nav" aria-label="Bet Track navigation"><a href="/">Home</a><a href="/aleph-track.html">Aleph review</a><a href="/downloads/Bet_Track_Printable.pdf">Print the 16 page workbook</a><a href="#lessons">Lesson map</a><a href="#teacher-key">Teacher answers</a></nav><main><section id="start"><h2>Ready for Bet</h2><p>Start here when you can find Hebrew's starting side, recognize several letters, and use the ahhh Stick Vowels and eee Pea Vowel with help. Each lesson introduces any new consonants before using them. This course develops decoding; it does not repeat Aleph's tracing sequence.</p><p>If a foundation feels unfamiliar, <a href="/aleph-track.html#stick-vowels">review it in Aleph</a> and return. Read the letters and vowel marks before looking to the picture for meaning.</p><p>The online lessons and new 16 page printable follow the same six lesson sequence. Sound labels use our class cues. Community pronunciation differences are respected.</p></section><section id="lessons"><h2>Your six lesson journey</h2><ol class="lesson-map">'''
html=header+''.join(f'<li><a href="#lesson-{l["id"]}">{escape(l["title"])}</a><p>{escape(l["goal"])}</p><small>Workbook pages {l["id"]*2} and {l["id"]*2+1}</small></li>' for l in L)+'</ol><p>Work at a comfortable pace. Spend one session on a lesson, or split it into teaching and practice.</p></section>'
for l in L:
 n=l['id'];html+=f'<section class="bet-lesson" id="lesson-{n}"><p class="eyebrow">Bet Lesson {n} · Workbook pages {n*2} and {n*2+1}</p><h2>{escape(l["title"])}</h2><p><strong>Goal</strong> {escape(l["goal"])}</p><h3>Meet the sounds you will use</h3><div class="sound-grid">'
 html+=''.join(f'<div>{he(g)}<p>{escape(t)}</p></div>' for g,t in l['new'])+'</div><h3>Learn before you practice</h3>'
 html+=''.join(f'<p>{escape(t)}</p>' for t in l['teach'])+'<h3>Watch the word grow</h3><div class="model-grid">'+''.join(f'<div>{he(g)}<p>{escape(t)}</p></div>' for g,t in l['model'])+'</div>'
 html+=f'<figure><img src="/images/bet-track/lesson-{n}.webp" alt="{escape(l["alt"])}" width="{Image.open(ROOT / f'public/images/bet-track/lesson-{n}.webp').width}" height="{Image.open(ROOT / f'public/images/bet-track/lesson-{n}.webp').height}" loading="lazy"><figcaption>Read first, then use the picture to check meaning.</figcaption></figure><h3>Read and show meaning</h3><div class="word-grid">'+''.join(f'<div>{he(g)}<strong>{escape(t)}</strong></div>' for g,t in l['words'])+'</div><ol>'+''.join(f'<li>{escape(t)}</li>' for t in l['steps'])+'</ol><h3>Try it yourself</h3>'
 for j,q in enumerate(l['questions']):
  html+=f'<form class="practice-check" data-answer="{q["answer"]}" data-correct="{escape(q["why"],quote=True)}" data-retry="Look at the taught examples above. Blend slowly, then try again."><fieldset><legend>{escape(q["prompt"])}</legend>'
  for k,op in enumerate(q['options']):html+=f'<label><input type="radio" name="bet-{n}-{j}" value="{k}">{he(op) if any(0x590<=ord(c)<=0x5ff for c in op) else escape(op)}</label>'
  html+='</fieldset><button type="submit">Check my answer</button><p class="practice-feedback" role="status" aria-live="polite"></p></form>'
 html+=f'<p><strong>Readiness check</strong> {escape(l["check"])}</p><div class="lesson-actions"><a href="{escape(helpurl(l),quote=True)}">Ask Chavruta about lesson {n}</a><a href="/downloads/Bet_Track_Printable.pdf#page={n*2}">Print this lesson</a><a href="#'+(f'lesson-{n+1}' if n<6 else 'ready-for-gimel')+'">'+('Next lesson' if n<6 else 'Check readiness for Gimel')+'</a></div></section>'
html+='''<section id="ready-for-gimel"><h2>Ready to read with meaning</h2><p>Ask a teacher or study partner to listen as you read a selection of the learned words without picture hints. Explain each meaning, then read both greetings. Notice the marks, blend, close the word, and explain it.</p><p>Confidence is not a race. If you need a model, revisit the matching lesson. If you can read and explain these short items with growing independence, begin Gimel with your teacher.</p><div class="lesson-actions"><a href="/gimel-track.html#lesson-1">Explore Gimel Lesson 1</a><a href="/placement-quick-check.html">Teacher placement guidance</a></div></section><section id="teacher-key"><h2>Teacher answer key and teaching notes</h2><p>Model first, then cover the picture during decoding. Accept the pronunciation used consistently by the teacher or community. A successful guess from an illustration is not yet evidence of decoding.</p>'''
for l in L:
 html+=f'<details><summary>Lesson {l["id"]} answers</summary><ol>'+''.join(f'<li>{escape(q["why"])}</li>' for q in l['questions'])+'</ol><h3>Printable practice</h3><ol>'+''.join(f'<li>{he(a) if False else escape(a)}</li>' for a in l['answers'])+'</ol></details>'
html+='</section></main><footer>© 2026 LuminaNexus Foundation · Ivrit HaOr · <a href="/">Return home</a></footer></body></html>'
(ROOT/'public/bet-track.html').write_text(html)
(ROOT/'public/styles/bet-track.css').write_text('''*{box-sizing:border-box}body{margin:0;background:#fffdf7;color:#17243c;line-height:1.7}header,main,.course-nav,footer{max-width:1040px;margin:auto;padding:1.5rem}header{padding-top:2.5rem}h1{font-size:3.4rem;margin:0}h2{font-size:2rem;line-height:1.2}h3{margin-top:1.5rem}.lead{font-size:1.7rem;margin:0}.course-nav{display:flex;flex-wrap:wrap;gap:1rem;border-block:1px solid #d9d9d9}.course-nav a,a{color:#1c4266;text-underline-offset:.2em}.lesson-map{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:1.25rem;padding-left:1.5rem}.lesson-map p{margin:.2rem 0}.bet-lesson{padding-top:2rem;margin-top:2rem;border-top:2px solid #d7dce0;scroll-margin-top:1rem}section{margin-bottom:2rem}.eyebrow{font-size:.9rem;font-weight:bold}.sound-grid,.model-grid,.word-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:1rem}.sound-grid>div,.model-grid>div,.word-grid>div{padding:1rem;border:1px solid #d9d9d9;border-radius:12px;background:white}.sound-grid [lang=he],.model-grid [lang=he],.word-grid [lang=he]{display:block;text-align:center;font-size:2.8rem;line-height:1.7}.word-grid strong{display:block;text-align:center}figure{max-width:540px;margin:1.5rem auto}figure img{display:block;width:100%;height:auto;object-fit:contain}figcaption{text-align:center;font-size:.95rem}li{margin:.4rem 0}summary{cursor:pointer;padding:.8rem 0;font-weight:bold}footer{border-top:1px solid #d9d9d9}a:focus-visible,summary:focus-visible{outline:3px solid #a16a27;outline-offset:4px}@media print{.course-nav,.lesson-actions,.practice-check button{display:none}header,main{padding:0}.bet-lesson{break-before:page}figure{max-width:330px}body{background:white}}
''')
# Printable, with explicit page breaks and shaped Hebrew examples.
pdfmetrics.registerFont(TTFont('Frank',str(FONT)));pdfmetrics.registerFont(TTFont('FrankBold',str(BOLD)))
P=ROOT/'public/downloads/Bet_Track_Printable.pdf';c=canvas.Canvas(str(P),pagesize=(612,792),pageCompression=1);c.setTitle('Bet Track Building and Reading Words');c.setAuthor('LuminaNexus Foundation');page=0

def tx(x,y,t,size=12,bold=False):c.setFont('FrankBold' if bold else 'Frank',size);c.setFillColorRGB(0,0,0);c.drawString(x,792-y,t)
def para(t,y,size=12,width=518):
 words=t.split();line=''
 for w in words:
  candidate=(line+' '+w).strip()
  if pdfmetrics.stringWidth(candidate,'Frank',size)>width:
   tx(47,y,line,size);y+=size*1.5;line=w
  else:line=candidate
 if line:tx(47,y,line,size);y+=size*1.5
 return y

def glyph(t,y,size=31,x=306,maxw=510):
 font=ImageFont.truetype(str(FONT),size*4);d=ImageDraw.Draw(Image.new('RGBA',(1,1)));b=d.textbbox((0,0),t,font=font,direction='rtl');im=Image.new('RGBA',(b[2]-b[0]+16,b[3]-b[1]+16));ImageDraw.Draw(im).text((8-b[0],8-b[1]),t,font=font,fill='black',direction='rtl');w,h=im.width/4,im.height/4
 if w>maxw:h*=maxw/w;w=maxw
 c.drawImage(ImageReader(im),x-w/2,792-y-h/2,w,h,mask='auto')
def begin(title,tag):
 global page
 page+=1;tx(47,35,'IVRIT HAOR  |  BET TRACK',10,True);tx(47,68,title,23,True);tx(47,91,tag,11);c.setStrokeColorRGB(.7,.7,.7);c.line(47,685,565,685)
def end():
 c.setStrokeColorRGB(.7,.7,.7);c.line(47,42,565,42);tx(47,767,'LuminaNexus Foundation  |  Name __________________________',9);tx(535,767,str(page),9);c.showPage()
def picture(n,y=112,height=160):
 im=Image.open(ROOT/f'public/images/bet-track/lesson-{n}.webp');c.drawImage(ImageReader(im),181,792-y-height,250,height,preserveAspectRatio=True,anchor='c')
def ruled(y,count=2):
 c.setStrokeColorRGB(.65,.65,.65)
 for j in range(count):c.line(47,792-y-j*27,565,792-y-j*27)
begin('Building and Reading Words','Six illustrated lessons from blending to short greetings')
picture(6,113,170);y=para('Bet is the next doorway after Aleph. Learn each new sound, blend the marks into words, then connect the word to its meaning.',314,14)
y=para('Before you begin: recognize several letters, begin on the right, and review ahhh Stick Vowels and the eee Pea Vowel as needed.',y+10)
tx(47,420,'Your lesson map',15,True)
for i,l in enumerate(L):tx(57,450+i*29,f"{l['id']}. {l['title']}  |  pages {l['id']*2}-{l['id']*2+1}",12)
y=para('Read the word before using the picture. Teachers may split a lesson across sessions. Page 14 is the readiness review; pages 15-16 provide the practice key.',650,11)
end()
for l in L:
 n=l['id'];begin(l['title'],f'Lesson {n}  |  Teach and model')
 picture(n,110,145);y=para(l['goal'],280,13)
 tx(47,y+12,'Meet the sounds before reading',13,True);y+=38
 for g,t in l['new']:
  glyph(g,y+4,25,x=110,maxw=110);tx(184,y+9,t,11);y+=39
 y+=5
 for t in l['teach']:y=para(t,y,11)+5
 for g,t in l['model']:
  glyph(g,y+10,28,x=165,maxw=220);y=para(t,y+15,11,width=518) if False else y
  tx(300,y+15,t,10.5);y+=43
 if y>733:raise ValueError(('Lesson overflow',n,y))
 end()
 begin(l['title'],f'Lesson {n}  |  Independent practice with teacher support')
 y=126
 for i,(instruction,examples) in enumerate(l['tasks'],1):
  tx(47,y,f'{i}. {instruction}',13,True);glyph(examples,y+42,32);ruled(y+89,2);y+=167
 y=para('My readiness check: '+l['check'],y+5,12)
 y=para('Circle one:  Not yet     With help     By myself',y+6,12)
 y=para('Say one word again and explain its meaning. If a sound feels new, return to the teaching page before continuing.',y+10,11)
 if y>739:raise ValueError(('Practice overflow',n,y))
 end()
begin('Ready for Gimel','Read accurately, then explain meaning')
y=para('Ask a teacher or study partner to cover the pictures and listen. Point from the right, notice the marks, blend the sounds, and close the word without an extra vowel.',132,13)
for g,t in [('אִמָּא אַבָּא','Read the family words and tell who each word names.'),('יָם יָד אוֹר','Read sea, hand, and light. Then point to the matching picture.'),('סוּס תּוּת לֶחֶם','Read horse, strawberry, and bread.'),('שָׁלוֹם אַבָּא / שָׁלוֹם אִמָּא','Read and act out both greetings.')]:
 glyph(g,y+32,32);y=para(t,y+72,12)+25
para('Teacher check: Does the learner decode without picture guessing, use the vowel marks, close words accurately, and explain the words? Continue to Gimel when ready; revisit the relevant lesson when help is needed.',y+5,12)
end()
for group in [L[:3],L[3:]]:
 begin('Teacher Practice Key','Accept a consistent classroom or community pronunciation')
 y=126
 for l in group:
  tx(47,y,f"Lesson {l['id']}  {l['title']}",14,True);y+=26
  for i,(answer,target) in enumerate(zip(l['answers'],l['answerTargets']),1):
   y=para(f'{i}. {answer}',y,11)
   glyph(target,y+8,23);y+=36
  y+=6
 if y>738:raise ValueError(('Key overflow',y))
 end()
c.save();print('Built',P,'pages',page)
if page!=16:raise ValueError(page)
