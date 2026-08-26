(()=>{
  const KAKAO_URL='https://pf.kakao.com/_xgudwX/chat';

  const esc=(s='')=>String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));

  function getTopTask(){
    try{
      if(typeof calcClass==='function'){
        const ranked=calcClass();
        if(ranked&&ranked[0]&&ranked[0].name) return ranked[0].name;
      }
    }catch(e){}
    try{
      const first=document.querySelector('.priorityRowV21 .priorityNameV21 b, .resultCard .rankmain h3');
      if(first&&first.textContent.trim()) return first.textContent.trim();
    }catch(e){}
    return '진단 결과의 1순위 업무';
  }

  function getDiagnosisSummary(){
    try{ if(typeof consultationSummary==='function') return consultationSummary(); }catch(e){}
    try{ if(typeof classSummary==='function') return classSummary(); }catch(e){}
    return '';
  }

  function closeModal(){
    const modal=document.getElementById('solutionConsultModalV29');
    if(modal){modal.remove();document.body.style.overflow='';}
  }

  function openModal(){
    closeModal();
    const topTask=getTopTask();
    const wrap=document.createElement('div');
    wrap.id='solutionConsultModalV29';
    wrap.className='solutionModalV29';
    wrap.innerHTML=`
      <div class="solutionDialogV29" role="dialog" aria-modal="true" aria-labelledby="solutionConsultTitleV29">
        <button type="button" class="solutionCloseV29" data-solution-close aria-label="닫기">×</button>
        <div class="solutionEyebrowV29">차팀장 솔루션 문진</div>
        <h2 id="solutionConsultTitleV29">진단 다음 단계,<br>내 상황에 맞게 같이 봐요.</h2>
        <p class="solutionLeadV29">같은 업무라도 이미 쓰는 도구와 막힌 지점이 다르면 방법도 달라집니다. 아래 내용만 알려주시면 차팀장이 솔루션을 볼 때 필요한 맥락이 함께 전달됩니다.</p>
        <div class="solutionTopTaskV29"><span>현재 1순위 업무</span><b>${esc(topTask)}</b></div>
        <form id="solutionConsultFormV29">
          <label class="solutionFieldV29">
            <span>1. 지금 이 업무를 어떻게 처리하고 있나요? <b>*</b></span>
            <textarea name="current" required placeholder="예: 댓글이 달리면 매니챗으로 자료를 보내고, 이후에는 따로 관리하지 않고 있어요."></textarea>
          </label>
          <label class="solutionFieldV29">
            <span>2. 현재 쓰는 도구나 서비스가 있나요?</span>
            <input name="tools" placeholder="예: 매니챗, 네이버예약, 엑셀, 구글시트, 카카오채널">
          </label>
          <label class="solutionFieldV29">
            <span>3. 지금 자동화는 어디까지 되어 있나요? <b>*</b></span>
            <select name="level" required>
              <option value="">선택해주세요</option>
              <option>아직 대부분 직접 하고 있어요</option>
              <option>템플릿이나 복붙 정도만 하고 있어요</option>
              <option>AI가 초안을 만들어주는 정도예요</option>
              <option>자동화 도구를 일부 연결해 사용 중이에요</option>
              <option>상당 부분 자동화돼 있지만 다음 단계가 막혀요</option>
            </select>
          </label>
          <label class="solutionFieldV29">
            <span>4. 지금 가장 답답하거나 막히는 지점은 어디인가요? <b>*</b></span>
            <textarea name="bottleneck" required placeholder="예: 자료를 받은 사람 중 누가 실제 관심고객인지 구분이 안 되고, 후속 연락도 놓쳐요."></textarea>
          </label>
          <label class="solutionFieldV29">
            <span>5. 어디까지 되면 ‘이제 됐다’고 느낄까요? <b>*</b></span>
            <textarea name="goal" required placeholder="예: 관심고객만 자동으로 분류되고, 재접촉할 사람과 메시지 초안까지 나오면 좋겠어요."></textarea>
          </label>
          <label class="solutionFieldV29">
            <span>6. 이 업무에 필요한 자료나 정보는 지금 어디에 있나요?</span>
            <input name="data" placeholder="예: 매니챗 태그, 구글시트, 카카오톡, 네이버예약, 머릿속">
          </label>
          <div class="solutionPrivacyV29">연락처를 따로 받지 않습니다. 작성한 내용은 구조화해 복사한 뒤 차팀장 카카오톡 채널로 이동합니다.</div>
          <button type="submit" class="solutionSubmitV29">작성 내용 들고 차팀장에게 상의하기 →</button>
        </form>
      </div>`;
    document.body.appendChild(wrap);
    document.body.style.overflow='hidden';
    wrap.querySelector('[data-solution-close]').onclick=closeModal;
    wrap.addEventListener('click',e=>{if(e.target===wrap)closeModal();});
    const form=wrap.querySelector('#solutionConsultFormV29');
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      const fd=new FormData(form);
      const diagnosis=getDiagnosisSummary();
      const text=`[차팀장 솔루션 상담 요청]\n\n1순위 업무: ${topTask}\n\n1. 현재 처리 방식\n${fd.get('current')||'-'}\n\n2. 현재 사용 도구\n${fd.get('tools')||'-'}\n\n3. 현재 자동화 수준\n${fd.get('level')||'-'}\n\n4. 가장 막히는 지점\n${fd.get('bottleneck')||'-'}\n\n5. 원하는 최종 상태\n${fd.get('goal')||'-'}\n\n6. 자료/정보 위치\n${fd.get('data')||'-'}${diagnosis?`\n\n[진단 요약]\n${diagnosis}`:''}`;
      let copied=false;
      try{
        if(typeof copyTextSafe==='function') copied=await copyTextSafe(text,'상담 내용을 복사했어요. 카카오톡에 붙여넣어 보내주세요.');
        else if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);copied=true;}
      }catch(err){}
      if(!copied){
        const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.left='-9999px';document.body.appendChild(ta);ta.select();
        try{copied=document.execCommand('copy');}catch(err){}ta.remove();
      }
      try{sessionStorage.setItem('cha_solution_consult_v29',text);}catch(err){}
      closeModal();
      setTimeout(()=>{location.href=KAKAO_URL;},180);
    });
    setTimeout(()=>wrap.querySelector('textarea[name="current"]')?.focus(),50);
  }

  function addConsultCard(){
    const result=document.querySelector('.resultV21');
    if(!result||document.getElementById('solutionConsultCardV29')) return;
    const card=document.createElement('section');
    card.id='solutionConsultCardV29';
    card.className='solutionConsultCardV29';
    card.innerHTML=`
      <div class="solutionEyebrowV29">진단 다음 단계</div>
      <h3>조금 더 자세한 솔루션,<br>차팀장이랑 상의해보세요.</h3>
      <p>1순위 업무는 찾았습니다. 이제 <b>지금 어디까지 하고 있는지</b>와 <b>어디에서 막히는지</b>를 알아야 내 상황에 맞는 방법을 볼 수 있어요.</p>
      <div class="solutionMiniFlowV29"><span>현재 방식</span><i>→</i><span>쓰는 도구</span><i>→</i><span>막힌 지점</span><i>→</i><span>원하는 상태</span></div>
      <button type="button" class="solutionConsultBtnV29" data-solution-open>조금 더 자세한 솔루션, 차팀장이랑 상의하기 →</button>`;
    const finalCta=result.querySelector('.finalCtaV21');
    if(finalCta) result.insertBefore(card,finalCta);
    else result.appendChild(card);
    card.querySelector('[data-solution-open]').onclick=openModal;
  }

  function boot(){
    addConsultCard();
    const screen=document.getElementById('screen');
    if(screen){
      new MutationObserver(()=>addConsultCard()).observe(screen,{childList:true,subtree:true});
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
  else boot();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
})();
