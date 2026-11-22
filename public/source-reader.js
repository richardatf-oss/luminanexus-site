(() => {
  const panel=document.getElementById('source-reader'); if(!panel)return;
  const select=document.getElementById('reader-reference'),form=document.getElementById('reader-form'),status=document.getElementById('reader-status'),body=document.getElementById('reader-text'),external=document.getElementById('reader-external');
  const references=[
    'Genesis 1:1-3','Genesis 2:1-3','Exodus 20:8-11','Leviticus 23:4-8','Numbers 6:24-26','Deuteronomy 6:4-9','Psalms 119:105','Psalms 145:1-3','Mishnah Berakhot 1:1','Mishnah Berakhot 6:1','Pirkei Avot 1:1','Pirkei Avot 1:6','Mishneh Torah, Repentance 2:2','Sefer Yetzirah Gra Version 2:4'
  ];
  for(const ref of references){const option=document.createElement('option');option.value=ref;option.textContent=ref;select.append(option);}
  let controller=null,sequence=0;
  function setLink(){external.href='https://www.sefaria.org/'+select.value.replaceAll(' ','_').replaceAll(':','.');external.textContent=`Open ${select.value} on Sefaria`;}
  function cleanText(value){
    const list=Array.isArray(value)?value.flat(Infinity):[value];
    const decode=document.createElement('textarea');
    return list.filter(item=>typeof item==='string').map(item=>{decode.innerHTML=item.replace(/<[^>]*>/g,'');return decode.value;}).join('\n\n').trim();
  }
  async function read(){
    const request=++sequence;controller?.abort();controller=new AbortController();const current=controller;
    const ref=select.value;setLink();form.setAttribute('aria-busy','true');status.textContent=`Opening ${ref}…`;body.hidden=true;
    const timeout=setTimeout(()=>current.abort(),12000);
    try {
      const response=await fetch('/.netlify/functions/sefaria?'+new URLSearchParams({ref}),{signal:current.signal});
      if(!response.ok)throw Error('source unavailable');
      const data=await response.json();if(request!==sequence)return;
      const he=cleanText(data.he),en=cleanText(data.en);if(!he&&!en)throw Error('empty source');
      document.getElementById('reader-title').textContent=ref;
      const hebrew=document.getElementById('reader-hebrew');hebrew.textContent=he||'No Hebrew text is available for this edition.';hebrew.lang=he?'he':'en';hebrew.dir=he?'rtl':'ltr';hebrew.classList.toggle('reader-hebrew',Boolean(he));
      document.getElementById('reader-english').textContent=en||'No English translation is available for this edition. Open Sefaria to choose another version.';
      body.hidden=false;status.textContent=`${ref} is ready. Read the passage before drawing a conclusion.`;
    } catch(error) {
      if(request===sequence)status.textContent='This passage could not load here. The Sefaria link below still opens the source; you can use the study prompts on this page.';
    } finally {clearTimeout(timeout);if(request===sequence)form.setAttribute('aria-busy','false');}
  }
  form.addEventListener('submit',event=>{event.preventDefault();read();});
  select.addEventListener('change',()=>{sequence++;controller?.abort();form.setAttribute('aria-busy','false');body.hidden=true;setLink();status.textContent='Choose Read this passage to open the selected text.';});
  const cardRefs={'creation-light':'Genesis 1:1-3','letters-in-tanakh':'Genesis 1:1-3','blessing':'Numbers 6:24-26','shema':'Deuteronomy 6:4-9','psalm-light':'Psalms 119:105','231-gates':'Sefer Yetzirah Gra Version 2:4'};
  for(const card of document.querySelectorAll('.source-card[data-study-id]')) {
    const ref=cardRefs[card.dataset.studyId];if(!ref)continue;
    const button=document.createElement('button');button.type='button';button.className='read-source';button.textContent='Read a passage here';
    button.addEventListener('click',()=>{select.value=ref;read();panel.scrollIntoView({block:'start'});document.getElementById('reader-heading').focus({preventScroll:true});});
    card.querySelector('[data-completion]').before(button);
  }
  const requested=new URLSearchParams(location.search).get('ref');
  if(requested&&references.includes(requested)){select.value=requested;read();}else{setLink();if(requested)status.textContent='That reference is not in this short reader. Choose a passage below, or use the source links in the study cards.';}
})();
