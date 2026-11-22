(() => {
  const form=document.getElementById('planner-form'); if(!form)return;
  const track=document.getElementById('planner-track'),lesson=document.getElementById('planner-lesson'),duration=document.getElementById('planner-duration'),status=document.getElementById('planner-status'),plan=document.getElementById('teaching-plan');
  let catalog=null;
  function scriptText(target,text) {
    target.replaceChildren();
    for(const part of String(text).split(/([\u0590-\u05ff]+(?:[ \t]+[\u0590-\u05ff]+)*)/u)) {
      if(/[\u0590-\u05ff]/u.test(part)){const bdi=document.createElement('bdi');bdi.lang='he';bdi.dir='rtl';bdi.textContent=part;target.append(bdi);} else target.append(document.createTextNode(part));
    }
  }
  function populate(){lesson.replaceChildren();for(const item of catalog[track.value]){const option=document.createElement('option');option.value=item.id;option.textContent=`${item.id}. ${item.title}`;lesson.append(option);}}
  function render(){
    if(!catalog)return;
    const item=catalog[track.value].find(item=>item.id===Number(lesson.value));if(!item)return;
    const minutes=Number(duration.value),units=[.1,.2,.2,.4,.1].map(fraction=>Math.round(minutes*fraction));
    document.getElementById('plan-track').textContent=`${track.value} Track · ${minutes}-minute session`;
    scriptText(document.getElementById('plan-title'),`Lesson ${item.id}: ${item.title}`);
    scriptText(document.getElementById('plan-goal'),item.goal);
    const rhythm=document.getElementById('plan-rhythm');rhythm.replaceChildren();
    ['Welcome and name one comfortable starting point.','Review one previously taught letter, sound, or word.','Model the new skill using the selected lesson.','Practice together, then invite an independent attempt.','Invite one observation and choose a next step.'].forEach((text,index)=>{const row=document.createElement('tr');for(const content of [`${units[index]} min`,text]){const cell=document.createElement('td');cell.textContent=content;row.append(cell);}rhythm.append(row);});
    const practice=document.getElementById('plan-practice');practice.replaceChildren();for(const task of item.practice.filter(Boolean)){const li=document.createElement('li');scriptText(li,task);practice.append(li);}
    document.getElementById('plan-lesson-link').href=item.href;
    document.getElementById('plan-workbook-link').href=`/downloads/${track.value}_Track_Printable.pdf`;
    plan.hidden=false;status.textContent=`Plan ready for ${track.value} lesson ${item.id}. Adjust the pacing as needed.`;
  }
  form.addEventListener('submit',event=>{event.preventDefault();render();document.getElementById('plan-title').setAttribute('tabindex','-1');document.getElementById('plan-title').focus({preventScroll:true});plan.scrollIntoView({block:'start'});});
  track.addEventListener('change',()=>{if(catalog)populate();plan.hidden=true;status.textContent='Choose a lesson and build your teaching plan.';});
  for(const control of [lesson,duration])control.addEventListener('change',()=>{plan.hidden=true;status.textContent='Settings changed. Build the teaching plan to update it.';});
  document.getElementById('print-plan').addEventListener('click',()=>{document.getElementById('printed-notes').textContent=document.getElementById('planner-notes').value;document.body.classList.add('print-plan');window.print();});
  window.addEventListener('afterprint',()=>document.body.classList.remove('print-plan'));
  fetch('/lesson-catalog.json').then(response=>{if(!response.ok)throw Error('catalog');return response.json();}).then(data=>{catalog=data;populate();render();}).catch(()=>{status.textContent='The lesson list could not load. Use the online lesson maps and Week 1 Packet below.';form.querySelector('button').disabled=true;});
})();
