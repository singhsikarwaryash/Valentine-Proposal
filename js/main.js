(function(){
  const clamp = (min, val, max) => Math.min(Math.max(val, min), max);

  const gradients = [
    'linear-gradient(135deg, #ffb3c1 0%, #ff6b8f 50%, #ffcdd6 100%)',
    'linear-gradient(135deg, #ffd1d7 0%, #ff7a9e 50%, #ffe3e8 100%)',
    'linear-gradient(135deg, #ffc2d1 0%, #f8578b 50%, #ffe5ec 100%)',
    'linear-gradient(135deg, #ffccd5 0%, #f67280 50%, #ffe6ee 100%)',
    'linear-gradient(135deg, #ffd6e0 0%, #ff5d8f 50%, #ffeaf0 100%)',
  ];
  let gradientIndex = 0;
  function rotateGradient(){ gradientIndex = (gradientIndex + 1) % gradients.length; document.body.style.background = gradients[gradientIndex]; }

  const initialScreen = document.getElementById('initialScreen');
  const agreementScreen = document.getElementById('agreementScreen');
  const finalScreen = document.getElementById('finalScreen');

  const yesBtn = document.getElementById('yesBtn');
  const agreeYesBtn = document.getElementById('agreeYesBtn');
  const noBtn = document.getElementById('noBtn');
  const noWrap = document.getElementById('noWrap');
  const noEmoji = document.getElementById('noEmoji');

  let noClicks = 0;

  function moveNoButton(){
    const btnRect = noBtn.getBoundingClientRect();
    const margin = 10; const vw = window.innerWidth; const vh = window.innerHeight;
    const maxLeft = vw - btnRect.width - margin; const maxTop = vh - btnRect.height - margin;
    const newLeft = Math.min(Math.max(margin, Math.random()*maxLeft), maxLeft);
    const newTop  = Math.min(Math.max(margin+60, Math.random()*maxTop), maxTop);
    noWrap.style.left = newLeft + 'px'; noWrap.style.top = newTop + 'px'; noWrap.style.transform = 'translateX(0)';
  }
  function placeNoInitially(){
    const btnRect = noBtn.getBoundingClientRect(); const vw = window.innerWidth; const vh = window.innerHeight;
    noWrap.style.left = Math.max(10, vw/2 - btnRect.width/2) + 'px';
    noWrap.style.top  = Math.max(100, vh/2 - btnRect.height/2) + 'px';
  }

  noBtn.addEventListener('mouseenter', moveNoButton);
  noBtn.addEventListener('touchstart', (e)=>{ moveNoButton(); e.preventDefault(); }, {passive:false});
  noBtn.addEventListener('click', ()=>{ noClicks++; if(noClicks>=2){ noEmoji.textContent = '😭'; } rotateGradient(); });

  yesBtn.addEventListener('click', ()=>{ initialScreen.classList.add('hidden'); agreementScreen.classList.remove('hidden'); agreeYesBtn.focus({preventScroll:true}); });

  document.getElementById('finalHeading')?.setAttribute('tabindex', '-1');
  agreeYesBtn.addEventListener('click', async ()=>{
    agreementScreen.classList.add('hidden');
    window.ValentineConfetti?.start(5000);
    await new Promise(res=>setTimeout(res, 5200));
    finalScreen.classList.remove('hidden');
    document.getElementById('finalHeading')?.focus({preventScroll:true});
  });

  const bgm = document.getElementById('bgm'); const muteToggle = document.getElementById('muteToggle'); if(bgm) bgm.volume = 0.18;
  async function tryAutoplay(){
    try { await bgm.play(); muteToggle.textContent = '🔊 Sound On'; muteToggle.setAttribute('aria-pressed','false'); }
    catch { bgm.muted = true; muteToggle.textContent = '🔇 Tap to Enable'; muteToggle.setAttribute('aria-pressed','true'); }
  }
  document.addEventListener('click', ()=>{ if(bgm.paused) tryAutoplay(); }, {once:true});
  tryAutoplay();
  muteToggle.addEventListener('click', ()=>{ bgm.muted = !bgm.muted; if(!bgm.paused && !bgm.muted) bgm.volume = 0.18; muteToggle.textContent = bgm.muted ? '🔇 Sound Off' : '🔊 Sound On'; muteToggle.setAttribute('aria-pressed', bgm.muted ? 'true' : 'false'); if(bgm.paused && !bgm.muted){ bgm.play().catch(()=>{}); } });

  window.addEventListener('load', placeNoInitially);
  window.addEventListener('resize', placeNoInitially);
})();
