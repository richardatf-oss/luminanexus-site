(() => {
  function initializeJourney() {
    const match = /^\/(aleph|bet|gimel)-track\.html$/.exec(location.pathname);
    if (!match || document.querySelector('.course-journey')) return;
    const track = match[1][0].toUpperCase() + match[1].slice(1);
    const lessons = [...document.querySelectorAll('main [id^="lesson-"]')]
      .filter(element => /^lesson-[1-9]\d*$/.test(element.id) && !element.closest('[hidden]'))
      .sort((a, b) => Number(a.id.slice(7)) - Number(b.id.slice(7)));
    if (!lessons.length) return;
    const key = 'luminanexus-learning-place-v1';
    const map = document.getElementById('lesson-map') || document.getElementById('lessons');
    lessons.forEach(lesson => lesson.setAttribute('tabindex', '-1'));
    const titles = lessons.map(lesson => (lesson.querySelector('h2')?.textContent.trim() || lesson.id).slice(0,160));
    const bar = document.createElement('section');
    bar.className = 'course-journey';
    bar.setAttribute('aria-label', `${track} learning path`);
    bar.innerHTML = '<div class="course-journey-heading"><div><p class="journey-eyebrow"></p><h2>Your next small step.</h2><p class="journey-place"></p></div><a class="journey-continue">Start lesson 1</a></div><label class="journey-jump">Go to a lesson<span class="journey-select"><select aria-label="Go to a lesson"></select></span></label><p class="journey-storage">Your last opened lesson stays on this device. No account needed.</p>';
    bar.querySelector('.journey-eyebrow').textContent = `${track} Track · ${lessons.length} lessons`;
    const resume = bar.querySelector('.journey-continue');
    const place = bar.querySelector('.journey-place');
    const jump = bar.querySelector('select');
    const first = document.createElement('option');
    first.value = ''; first.textContent = 'Choose a lesson'; jump.append(first);
    lessons.forEach((lesson,index) => {
      const option = document.createElement('option');
      option.value = lesson.id;
      option.textContent = `${index+1}. ${titles[index]}`;
      jump.append(option);
    });
    function showPlace(index, returning = false) {
      resume.href = `#${lessons[index].id}`;
      resume.textContent = returning ? `Continue lesson ${index + 1}` : 'Start lesson 1';
      place.textContent = returning ? `Last opened: ${titles[index]}` : 'Choose a lesson, take your time, and return whenever you like.';
    }
    showPlace(0);
    try {
      const saved = JSON.parse(localStorage.getItem(key));
      const index = lessons.findIndex(lesson => lesson.id === `lesson-${saved?.lesson}`);
      if (saved?.track === track && Number.isInteger(saved.lesson) && index >= 0) showPlace(index, true);
    } catch {}
    document.querySelector('main').prepend(bar);
    let lastSaved = null;
    function remember(index) {
      if (index === lastSaved || index < 0) return;
      lastSaved = index;
      showPlace(index, true);
      jump.value = lessons[index].id;
      try {
        localStorage.setItem(key, JSON.stringify({track, lesson: Number(lessons[index].id.slice(7)), title: titles[index]}));
      } catch {
        bar.querySelector('.journey-storage').textContent = 'This browser cannot save your place. Bookmark the lesson link to return later.';
      }
    }
    function alignLesson() {
      const index = lessons.findIndex(lesson => `#${lesson.id}` === location.hash);
      if (index < 0) return;
      remember(index);
      const heading = lessons[index].querySelector('h2');
      heading?.setAttribute('tabindex', '-1');
      heading?.focus({preventScroll:true});
    }
    jump.addEventListener('change', () => {
      if (!jump.value) return;
      location.hash = jump.value;
    });
    lessons.forEach((lesson,index) => {
      const existingActions = lesson.querySelector(':scope > .lesson-actions');
      const existingHelp = lesson.querySelector('a[href*="chavrutaQuestion"]');
      const originalQuestion = existingHelp ? new URL(existingHelp.href).searchParams.get('chavrutaQuestion') : null;
      const printable = existingActions?.querySelector('a[href*=".pdf"]')?.getAttribute('href');
      const nav = document.createElement('nav');
      nav.className = 'learning-nav';
      nav.setAttribute('aria-label', `${track} lesson ${index+1} navigation`);
      const position = document.createElement('span');
      position.className = 'learning-position';
      position.textContent = `Lesson ${index+1} of ${lessons.length}`;
      nav.append(position);
      const link = (text, href, name) => {
        const item = document.createElement('a');
        item.textContent = text; item.href = href;
        if (name) item.setAttribute('aria-label', name);
        nav.append(item); return item;
      };
      if (index > 0) link('Previous lesson', `#${lessons[index-1].id}`, `Previous: lesson ${index}, ${titles[index-1]}`);
      link('Lesson map', map ? `#${map.id}` : '#main-content');
      if (index < lessons.length-1) link('Next lesson', `#${lessons[index+1].id}`, `Next: lesson ${index+2}, ${titles[index+1]}`).className = 'learning-next';
      else {
        const finish = document.getElementById('gimel-finish') || document.getElementById('ready-for-gimel');
        link(finish ? 'Track readiness review' : 'Choose what comes next', finish ? `#${finish.id}` : '/#tracks').className = 'learning-next';
      }
      const goal = [...lesson.querySelectorAll('p')].find(p => /^Goal\b/.test(p.textContent.trim()))?.textContent.trim().slice(0,220) || '';
      const question = `I'm studying ${track} Track, lesson ${index+1}: ${titles[index]}. ${goal} Please explain the lesson in small steps, then offer one practice question. Use the letters and vowels taught in this lesson; ask me if you need a detail rather than guessing.`;
      const params = new URLSearchParams({chavrutaMode:'hebrew-classroom',chavrutaQuestion:(originalQuestion || question).slice(0,1200),chavrutaLesson:`${location.pathname}#${lesson.id}`,chavrutaSkill:titles[index]});
      link('Help with this lesson', `/?${params}#chavruta`, `Ask Chavruta about ${track} lesson ${index+1}`).className = 'learning-help';
      if (printable) link('Print lesson', printable).className = 'learning-print';
      // Replace repeated course controls while retaining their lesson-specific prompts.
      existingActions?.remove();
      lesson.append(nav);
    });
    window.addEventListener('hashchange', alignLesson);
    alignLesson();
    // Content added above an initial fragment can shift the browser's first scroll.
    if (lessons.some(lesson => `#${lesson.id}` === location.hash)) {
      requestAnimationFrame(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({behavior:'instant',block:'start'}));
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeJourney, {once:true});
  else initializeJourney();
})();
