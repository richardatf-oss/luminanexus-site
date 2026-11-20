(() => {
  const lessons = __LESSONS_JSON__;
  const firstLessonData = __FIRST_LESSON_JSON__;
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[ch]));
  const firstCard = document.querySelector("main > section.card");
  const intro = document.createElement("section");
  intro.className = "gimel-progress card";
  intro.innerHTML = '<p class="eyebrow">A 32 lesson journey</p><h2>Read, Understand, Share</h2><p>Work through the lessons at a comfortable pace. Each one teaches a word or phrase, then gives you a short check. Your progress stays in this browser.</p><div class="gimel-progress-line"><strong id="gimel-progress-label">0 of 32 checks complete</strong><button type="button" id="gimel-reset">Reset progress</button></div><progress id="gimel-progress-bar" max="32" value="0" aria-label="Gimel Track progress"></progress>';
  if (firstCard) firstCard.insertAdjacentElement("afterend", intro);
  const section = document.querySelector("#lessons");
  if (section) {
    section.querySelector("h2").textContent = "The 32 Lesson Reading Path";
    const map = document.createElement("nav");
    map.id = "lesson-map";
    map.className = "gimel-lesson-map";
    map.setAttribute("aria-label","Gimel lesson map");
    const mapIntro = document.createElement("p");
    mapIntro.textContent = "Each stop builds reading confidence: decode first, connect the word to its meaning, then use it in speech.";
    section.append(mapIntro,map);
    for (let n=1;n<=32;n++) {
      const a=document.createElement("a");
      a.href="#lesson-"+n;
      a.textContent=String(n).padStart(2,"0")+" · "+(n===1?"Reading with Meaning":lessons[n-2].title);
      map.append(a);
    }
  }
  const firstLesson = document.querySelector("#lesson-1");
  const practice = document.createElement("form");
  practice.className="practice-check";
  practice.dataset.answer=String(firstLessonData.answer);
  practice.dataset.correct="Yes. "+firstLessonData.word+" means "+firstLessonData.meaning+". Read it first, then connect it to its meaning.";
  practice.dataset.retry="Look at the word again and read it from right to left. Then choose its meaning.";
  const firstFieldset=document.createElement("fieldset");
  const firstLegend=document.createElement("legend");firstLegend.textContent=firstLessonData.question;firstFieldset.append(firstLegend);
  firstLessonData.choices.forEach((choice,choiceIndex)=>{const label=document.createElement("label");const input=document.createElement("input");input.type="radio";input.name="gimel-lesson-1";input.value=String(choiceIndex);const span=document.createElement("span");span.textContent=choice;label.append(input,span);firstFieldset.append(label);});
  practice.append(firstFieldset);
  const firstButton=document.createElement("button");firstButton.type="submit";firstButton.textContent="Check my answer";practice.append(firstButton);
  practice.insertAdjacentHTML("beforeend",'<p class="practice-feedback" role="status" aria-live="polite"></p><details><summary>Teacher answer</summary><p></p></details>');
  practice.querySelector("details p").textContent="Answer: "+firstLessonData.choices[firstLessonData.answer]+". "+firstLessonData.word+" means "+firstLessonData.meaning+".";
  if (firstLesson) firstLesson.append(practice);

  const anchor = document.querySelector("#practice-1");
  const host = document.createElement("div");
  host.id="gimel-expanded-lessons";
  if(anchor) anchor.insertAdjacentElement("afterend",host);
  lessons.forEach((item,index) => {
    const number=index+2;
    const card=document.createElement("section");
    card.id="lesson-"+number;
    card.className="lesson-card";
    card.innerHTML='<p class="lesson-meta">Gimel Track · Lesson '+number+' of 32</p><h2>'+escapeHTML(item.title)+'</h2><p><strong>Goal:</strong> '+escapeHTML(item.focus)+'</p><h3>Look, read, find meaning</h3><p class="gimel-word" lang="he" dir="rtl">'+escapeHTML(item.word)+'</p><p><strong>Read it:</strong> '+escapeHTML(item.say)+' · <strong>Meaning:</strong> '+escapeHTML(item.meaning)+'.</p><p class="note">'+escapeHTML(item.cue)+'</p>';
    const form=document.createElement("form");
    form.className="practice-check";
    form.dataset.answer=String(item.answer);
    form.dataset.correct="Yes. "+item.word+" means "+item.meaning+".";
    form.dataset.retry="Read the Hebrew word once more, then look at the choices. Use the meaning clue from this lesson.";
    const fieldset=document.createElement("fieldset");
    const legend=document.createElement("legend");
    legend.textContent=item.question;
    fieldset.append(legend);
    item.choices.forEach((choice,choiceIndex) => {
      const label=document.createElement("label");
      const input=document.createElement("input");
      input.type="radio";
      input.name="gimel-lesson-"+number;
      input.value=String(choiceIndex);
      const span=document.createElement("span");
      span.textContent=choice;
      label.append(input,span);
      fieldset.append(label);
    });
    const button=document.createElement("button");
    button.type="submit";
    button.textContent="Check my answer";
    const feedback=document.createElement("p");
    feedback.className="practice-feedback";
    feedback.setAttribute("role","status");
    feedback.setAttribute("aria-live","polite");
    const details=document.createElement("details");
    const summary=document.createElement("summary");
    summary.textContent="Teacher answer";
    const answer=document.createElement("p");
    answer.textContent="Answer: "+item.choices[item.answer]+". "+item.word+" means "+item.meaning+".";
    details.append(summary,answer);
    form.append(fieldset,button,feedback,details);
    card.append(form);
    const actions=document.createElement("div");
    actions.className="lesson-actions";
    if(number<32) actions.innerHTML='<a href="#lesson-'+(number+1)+'">Next: Lesson '+(number+1)+'</a>';
    else actions.innerHTML='<a href="#gimel-finish">Finish the Gimel Track</a>';
    card.append(actions);
    host.append(card);
  });

  const closing=document.querySelector("#coming-next");
  if(closing) {
    closing.id="gimel-finish";
    const tocLink=document.querySelector('.toc a[href="#coming-next"]');
    if(tocLink){tocLink.href="#gimel-finish";tocLink.textContent="Track Finish & Readiness";}
    closing.innerHTML='<h2>Ready to Read with Meaning?</h2><p>Choose a short word you know, read it from right to left, and explain its meaning without using a picture clue. Then read the final phrase aloud: <span class="hebrew" lang="he" dir="rtl">יֵשׁ לִי סֵפֶר</span>.</p><p>Gimel Track is a beginning in fluent, meaningful reading. A student can repeat lessons, read with a teacher or study partner, and return to the matching printable workbook for pencil practice.</p><p class="principle">See the letters. Read the word. Find the meaning. Share it.</p><p><a class="button" href="/downloads/Gimel_Track_Printable.pdf">Download the 32-lesson printable edition</a><a class="button secondary" href="/">Return to LuminaNexus.org</a></p>';
  }
  const key="ivrit-haor-gimel-progress-v1";
  let completed=Array(32).fill(false);
  try {
    const old=JSON.parse(localStorage.getItem(key)||"[]");
    if(Array.isArray(old)) completed=completed.map((_,i)=>old[i]===true);
  } catch (_) {}
  const forms=Array.from(document.querySelectorAll("#lesson-1 .practice-check,#gimel-expanded-lessons .practice-check"));
  function save(){try{localStorage.setItem(key,JSON.stringify(completed));}catch(_){}}
  function render(){
    const count=completed.filter(Boolean).length;
    const label=document.querySelector("#gimel-progress-label");
    const bar=document.querySelector("#gimel-progress-bar");
    if(label) label.textContent=count+" of 32 checks complete";
    if(bar) bar.value=count;
  }
  forms.forEach((form,index)=>{
    const feedback=form.querySelector(".practice-feedback");
    form.addEventListener("submit",event=>{
      event.preventDefault();
      const selected=form.querySelector("input:checked");
      if(!selected){feedback.textContent="Choose an answer first. Take your time.";return;}
      const correct=selected.value===form.dataset.answer;
      feedback.textContent=correct?form.dataset.correct:form.dataset.retry;
      form.classList.toggle("is-correct",correct);
      if(correct){completed[index]=true;save();render();}
    });
    form.addEventListener("change",()=>form.classList.remove("is-correct"));
  });
  const reset=document.querySelector("#gimel-reset");
  if(reset) reset.addEventListener("click",()=>{
    completed=Array(32).fill(false);
    forms.forEach(form=>{
      form.querySelectorAll("input").forEach(input=>input.checked=false);
      const feedback=form.querySelector(".practice-feedback");
      if(feedback)feedback.textContent="";
      form.classList.remove("is-correct");
    });
    save();render();
  });
  render();
})();
