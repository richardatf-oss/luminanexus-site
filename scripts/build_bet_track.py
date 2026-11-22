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

def make_illustration(l):
 n=l['id']; path=ROOT/f"public/images/bet-track/lesson-{n}.webp"
 if path.exists():path.unlink()
 im=Image.new('RGB',(860,520),'#f7fbff');d=ImageDraw.Draw(im)
 d.rounded_rectangle((20,20,840,500),radius=32,fill='white',outline='#cad9e8',width=4)
 d.text((52,43),f"BET TRACK  ·  LESSON {n}",font=ImageFont.truetype(str(FONT),24),fill='#486174')
 cx,cy=430,190; icon=l.get('icon','word'); navy='#153753'; blue='#69a9cf'; gold='#efbd58'; green='#79ad82'; red='#d9786d'; pale='#dcecf6'
 if icon in ('fish','fishsmall'):
  sc=.65 if icon=='fishsmall' else 1
  d.ellipse((cx-145*sc,cy-72*sc,cx+90*sc,cy+72*sc),fill=blue,outline=navy,width=7)
  d.polygon([(cx+80*sc,cy),(cx+165*sc,cy-68*sc),(cx+165*sc,cy+68*sc)],fill=gold,outline=navy)
  d.ellipse((cx-95*sc,cy-28*sc,cx-75*sc,cy-8*sc),fill=navy)
  d.arc((cx-50*sc,cy-5*sc,cx+45*sc,cy+48*sc),0,170,fill=navy,width=5)
 elif icon in ('dog','dogbig'):
  sc=1.15 if icon=='dogbig' else 1
  d.ellipse((cx-100*sc,cy-95*sc,cx+100*sc,cy+100*sc),fill='#d7a86c',outline=navy,width=7)
  d.ellipse((cx-110*sc,cy-115*sc,cx-35*sc,cy-20*sc),fill='#9a6747',outline=navy,width=6);d.ellipse((cx+35*sc,cy-115*sc,cx+110*sc,cy-20*sc),fill='#9a6747',outline=navy,width=6)
  d.ellipse((cx-48*sc,cy-20*sc,cx-30*sc,cy-2*sc),fill=navy);d.ellipse((cx+30*sc,cy-20*sc,cx+48*sc,cy-2*sc),fill=navy)
  d.ellipse((cx-20*sc,cy+20*sc,cx+20*sc,cy+48*sc),fill=navy);d.arc((cx-48*sc,cy+23*sc,cx+48*sc,cy+80*sc),0,180,fill=navy,width=5)
 elif icon=='tree':
  d.rectangle((cx-26,cy-5,cx+26,cy+145),fill='#9b7048',outline=navy,width=5)
  for x,y,r in [(cx,cy-80,100),(cx-75,cy-28,68),(cx+75,cy-25,65)]:d.ellipse((x-r,y-r,x+r,y+r),fill=green,outline=navy,width=5)
 elif icon in ('house','city'):
  if icon=='house':
   d.polygon([(cx-160,cy-5),(cx,cy-135),(cx+160,cy-5)],fill=red,outline=navy);d.rectangle((cx-125,cy-5,cx+125,cy+135),fill='#f5d58b',outline=navy,width=6);d.rectangle((cx-26,cy+55,cx+26,cy+135),fill=blue,outline=navy,width=4)
  else:
   for x,w,h,c in [(cx-150,82,180,blue),(cx-47,92,250,gold),(cx+70,86,155,green)]:
    d.rectangle((x,cy+120-h,x+w,cy+120),fill=c,outline=navy,width=5)
    for yy in range(cy+120-h+24,cy+100,42):
     for xx in range(x+18,x+w-12,31):d.rectangle((xx,yy,xx+13,yy+18),fill='white')
 elif icon=='book':
  d.rounded_rectangle((cx-150,cy-120,cx+150,cy+140),radius=16,fill='#f1d588',outline=navy,width=8);d.line((cx,cy-108,cx,cy+128),fill=navy,width=6);d.line((cx-110,cy-45,cx-28,cy-45),fill=blue,width=7);d.line((cx+28,cy-45,cx+110,cy-45),fill=blue,width=7)
 elif icon=='heart':
  d.polygon([(cx,cy+100),(cx-145,cy-15),(cx-140,cy-75),(cx-90,cy-112),(cx-35,cy-100),(cx,cy-58),(cx+35,cy-100),(cx+90,cy-112),(cx+140,cy-75),(cx+145,cy-15)],fill=red,outline=navy)
 elif icon=='candle':
  d.rounded_rectangle((cx-44,cy-20,cx+44,cy+150),radius=14,fill='#f0d996',outline=navy,width=6);d.ellipse((cx-36,cy-150,cx+36,cy-30),fill=gold,outline=navy,width=5);d.polygon([(cx,cy-188),(cx-27,cy-122),(cx+27,cy-122)],fill=red)
 elif icon=='water':
  for j in range(3):d.arc((cx-180,cy-60+j*55,cx+180,cy+40+j*55),0,180,fill=blue,width=14)
  d.ellipse((cx-55,cy-150,cx+55,cy-40),fill=gold,outline=navy,width=5)
 elif icon in ('sun','sunshine','calendar'):
  d.ellipse((cx-95,cy-95,cx+95,cy+95),fill=gold,outline=navy,width=6)
  for a in range(0,360,45):
   import math
   x1=cx+120*math.cos(math.radians(a));y1=cy+120*math.sin(math.radians(a));x2=cx+160*math.cos(math.radians(a));y2=cy+160*math.sin(math.radians(a));d.line((x1,y1,x2,y2),fill=gold,width=11)
 elif icon=='mouth':
  d.ellipse((cx-135,cy-62,cx+135,cy+62),fill='#e58b83',outline=navy,width=7);d.arc((cx-95,cy-50,cx+95,cy+50),0,180,fill=navy,width=7);d.line((cx-85,cy,cx+85,cy),fill='white',width=14)
 elif icon in ('small','big','compare'):
  for x,r,c in [(cx-90,48,blue),(cx+90,100,gold)]:d.ellipse((x-r,cy-r,x+r,cy+r),fill=c,outline=navy,width=6)
 elif icon=='sound':
  d.ellipse((cx-30,cy-30,cx+30,cy+30),fill=gold,outline=navy,width=5)
  for r in (75,125,175):d.arc((cx-r,cy-r,cx+r,cy+r),-60,60,fill=blue,width=10)
 elif icon=='pointing':
  d.ellipse((cx-115,cy-110,cx+95,cy+100),fill='#f1d588',outline=navy,width=6);d.text((cx-29,cy-72),'?',font=ImageFont.truetype(str(FONT),150),fill=navy)
 elif icon in ('head','child','family'):
  for x,y,r,c in [(cx-62,cy-53,64,gold),(cx+74,cy-45,58,blue)]:d.ellipse((x-r,y-r,x+r,y+r),fill=c,outline=navy,width=6);d.ellipse((x-19,y-8,x-9,y+2),fill=navy);d.ellipse((x+9,y-8,x+19,y+2),fill=navy);d.arc((x-20,y+6,x+20,y+32),0,180,fill=navy,width=3)
  d.rounded_rectangle((cx-120,cy+24,cx-4,cy+158),radius=36,fill=blue,outline=navy,width=5);d.rounded_rectangle((cx+16,cy+30,cx+126,cy+158),radius=36,fill=red,outline=navy,width=5)
 else:
  d.rounded_rectangle((cx-150,cy-110,cx+150,cy+120),radius=38,fill=pale,outline=navy,width=6);d.text((cx-50,cy-78),'?',font=ImageFont.truetype(str(FONT),160),fill=navy)
 label=' · '.join(w[0] for w in l['words']);size=58;hf=ImageFont.truetype(str(FONT),size);bb=d.textbbox((0,0),label,font=hf,direction='rtl')
 while bb[2]-bb[0]>760 and size>28:
  size-=2;hf=ImageFont.truetype(str(FONT),size);bb=d.textbbox((0,0),label,font=hf,direction='rtl')
 d.text(((860-(bb[2]-bb[0]))/2-bb[0],352-bb[1]),label,font=hf,fill=navy,direction='rtl')
 small=ImageFont.truetype(str(FONT),27);caption=l.get('alt','');d.text((54,455),caption[:72],font=small,fill='#486174')
 im.save(path,'WEBP',quality=88,method=6)
for lesson in L[6:]:make_illustration(lesson)
header='''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bet Track Building and Reading Words | Ivrit HaOr</title><meta name="description" content="Thirty-two illustrated Hebrew reading lessons with explicit vowel teaching, blending, word meanings, practice feedback, and a matching printable workbook."><link rel="stylesheet" href="/styles/hebrew.css"><link rel="stylesheet" href="/styles/lesson-practice.css"><link rel="stylesheet" href="/styles/bet-track.css"><script src="/lesson-practice.js" defer></script>
<link rel="stylesheet" href="/styles/site-navigation.css">
<script src="/site-navigation.js" defer></script>

<link rel="stylesheet" href="/styles/learning-journey.css">
<script src="/learning-journey.js" defer></script>
</head><body><luminanexus-navigation></luminanexus-navigation><header><p>Ivrit HaOr · LuminaNexus Foundation</p><h1>Bet Track</h1><p class="lead">Building and Reading Words</p><p>Blend the sounds. Read the word. Tell its meaning.</p></header><nav class="course-nav" aria-label="Bet Track navigation"><a href="/downloads/Bet_Track_Printable.pdf">Print the 77 page workbook</a><a href="#lessons">Lesson map</a><a href="#teacher-key">Teacher answers</a></nav><main id="main-content" tabindex="-1"><section id="start"><h2>Ready for Bet</h2><p>Start here when you can find Hebrew's starting side, recognize several letters, and use the ahhh Stick Vowels and eee Pea Vowel with help. Each lesson introduces any new consonants before using them. This course develops decoding; it does not repeat Aleph's tracing sequence.</p><p>If a foundation feels unfamiliar, <a href="/aleph-track.html#stick-vowels">review it in Aleph</a> and return. Read the letters and vowel marks before looking to the picture for meaning.</p><p>The online lessons and printable workbook follow the same 32 lesson sequence. Sound labels use our class cues. Community pronunciation differences are respected.</p></section><section id="lessons"><h2>Your 32 lesson journey</h2><ol class="lesson-map">'''
html=header+''.join(f'<li><a href="#lesson-{l["id"]}">{escape(l["title"])}</a><p>{escape(l["goal"])}</p><small>Workbook pages {l["id"]*2} and {l["id"]*2+1}</small></li>' for l in L)+'</ol><p>Work at a comfortable pace. Spend one session on a lesson, or split it into teaching and practice.</p></section>'
for l in L:
 n=l['id'];html+=f'<section class="bet-lesson" id="lesson-{n}"><p class="eyebrow">Bet Lesson {n} · Workbook pages {n*2} and {n*2+1}</p><h2>{escape(l["title"])}</h2><p><strong>Goal</strong> {escape(l["goal"])}</p><h3>Meet the sounds you will use</h3><div class="sound-grid">'
 html+=''.join(f'<div>{he(g)}<p>{escape(t)}</p></div>' for g,t in l['new'])+'</div><h3>Learn before you practice</h3>'
 html+=''.join(f'<p>{escape(t)}</p>' for t in l['teach'])+'<h3>Watch the word grow</h3><div class="model-grid">'+''.join(f'<div>{he(g)}<p>{escape(t)}</p></div>' for g,t in l['model'])+'</div>'
 img_path=ROOT/f'public/images/bet-track/lesson-{n}.webp';img=Image.open(img_path);img_url=f'/images/bet-track/lesson-{n}.webp'
 html+=f'<figure><img src="{img_url}" alt="{escape(l["alt"])}" width="{img.width}" height="{img.height}" loading="lazy"><figcaption>Read first, then use the picture to check meaning.</figcaption></figure><h3>Read and show meaning</h3><div class="word-grid">'+''.join(f'<div>{he(g)}<strong>{escape(t)}</strong></div>' for g,t in l['words'])+'</div><ol>'+''.join(f'<li>{escape(t)}</li>' for t in l['steps'])+'</ol><h3>Try it yourself</h3>'
 for j,q in enumerate(l['questions']):
  html+=f'<form class="practice-check" data-answer="{q["answer"]}" data-correct="{escape(q["why"],quote=True)}" data-retry="Look at the taught examples above. Blend slowly, then try again."><fieldset><legend>{escape(q["prompt"])}</legend>'
  for k,op in enumerate(q['options']):html+=f'<label><input type="radio" name="bet-{n}-{j}" value="{k}">{he(op) if any(0x590<=ord(c)<=0x5ff for c in op) else escape(op)}</label>'
  html+='</fieldset><button type="submit">Check my answer</button><p class="practice-feedback" role="status" aria-live="polite"></p></form>'
 html+=f'<p><strong>Readiness check</strong> {escape(l["check"])}</p><div class="lesson-actions"><a href="{escape(helpurl(l),quote=True)}">Ask Chavruta about lesson {n}</a><a href="/downloads/Bet_Track_Printable.pdf#page={n*2}">Print this lesson</a><a href="#'+(f'lesson-{n+1}' if n<len(L) else 'ready-for-gimel')+'">'+('Next lesson' if n<len(L) else 'Check readiness for Gimel')+'</a></div></section>'
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
 page+=1;tx(47,35,'IVRIT HAOR  |  BET TRACK',10,True);title_size=min(23,max(13,23*518/max(1,pdfmetrics.stringWidth(title,'FrankBold',23))));tx(47,68,title,title_size,True);tx(47,91,tag,11);c.setStrokeColorRGB(.7,.7,.7);c.line(47,685,565,685)
def end():
 c.setStrokeColorRGB(.7,.7,.7);c.line(47,42,565,42);tx(47,767,'LuminaNexus Foundation  |  Name __________________________',9);tx(535,767,str(page),9);c.showPage()
def picture(n,y=112,height=160):
 im=Image.open(ROOT/f'public/images/bet-track/lesson-{n}.webp');c.drawImage(ImageReader(im),181,792-y-height,250,height,preserveAspectRatio=True,anchor='c')
def ruled(y,count=2):
 c.setStrokeColorRGB(.65,.65,.65)
 for j in range(count):c.line(47,792-y-j*27,565,792-y-j*27)
begin('Building and Reading Words','Thirty-two illustrated lessons from blending to short phrases')
picture(6,113,170);y=para('Bet is the next doorway after Aleph. Learn each new sound, blend the marks into words, then connect the word to its meaning.',314,14)
y=para('Before you begin: recognize several letters, begin on the right, and review ahhh Stick Vowels and the eee Pea Vowel as needed.',y+10)
tx(47,420,'Your lesson map',15,True)
for i,l in enumerate(L):
 col=0 if i<16 else 1;row=i if i<16 else i-16
 tx(54+col*265,414+row*16,f"{l['id']}. {l['title']} · p.{l['id']*2}-{l['id']*2+1}",8.5)
y=para('Read each word before using the picture. The readiness review and teacher key follow the lessons.',375,9)
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
y=para('Ask a teacher or study partner to cover the pictures and listen. Point from the right, notice the marks, blend the sounds, and explain each word.',132,13)
for g,t in [('בֵּן בַּת','Read son and daughter. Name the final consonant in each word.'),('טוֹב כֶּלֶב','Read good and dog. Then read the phrase כֶּלֶב גָּדוֹל.'),('מָה זֶה?','Read the question, then answer זֶה סֵפֶר or זֶה דָּג.')]:
 glyph(g,y+32,32);y=para(t,y+72,12)+25
para('Teacher check: Can the learner decode without picture guessing, use the vowel marks, close words accurately, and explain a short phrase? Continue to Gimel when ready; revisit the matching lesson when help is needed.',y+5,12)
end()
for start in range(0,len(L),3):
 group=L[start:start+3]
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
expected=1+2*len(L)+1+(len(L)+2)//3
if page!=expected:raise ValueError((page,expected))

