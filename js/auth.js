(function(){
  const AUTH_MODE = 'passcode';
  // SHA-256('Iloveyouyash')
  const PASSCODE_HASH_HEX = '057536095c6282d7f060d8ab7497432b10d33f58c657aba3623502eb1792604d';
  const ALLOWED_EMAIL = 'someone@example.com';

  const SESSION_KEY = 'vp_auth_session';
  const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h

  function setSession(){
    const data = { t: Date.now() + SESSION_TTL_MS };
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(data)); } catch(_) {}
  }
  function hasValidSession(){
    try { const raw = localStorage.getItem(SESSION_KEY); if(!raw) return false; const {t} = JSON.parse(raw); return t && Date.now() < t; } catch(_) { return false; }
  }
  function clearSession(){
    try {
      localStorage.removeItem(SESSION_KEY);
      // broadcast logout to other tabs
      localStorage.setItem('vp_auth_event', JSON.stringify({type:'logout', ts:Date.now()}));
      localStorage.removeItem('vp_auth_event');
    } catch(_) {}
  }

  async function sha256Hex(str){
    const enc = new TextEncoder();
    const buf = await crypto.subtle.digest('SHA-256', enc.encode(String(str)));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
  }

  async function handlePasscodeLogin(input){
    const value = String(input||'').trim();
    const hash = await sha256Hex(value);
    if (hash === PASSCODE_HASH_HEX){
      setSession();
      window.location.href = 'index.html';
    } else {
      alert('Incorrect passcode.');
    }
  }

  function ensureNetlifyScript(){
    return new Promise((res)=>{
      if(document.getElementById('netlify-identity-widget')) return res();
      const s = document.createElement('script');
      s.id = 'netlify-identity-widget';
      s.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
      s.onload = ()=> res();
      document.head.appendChild(s);
    });
  }
  async function handleNetlifyLogin(){
    await ensureNetlifyScript();
    if (!window.netlifyIdentity){ alert('Netlify Identity failed to load.'); return; }
    window.netlifyIdentity.on('login', user => {
      const email = (user && user.email) || '';
      if (email.toLowerCase() === ALLOWED_EMAIL.toLowerCase()){
        setSession(); window.location.href = 'index.html';
      } else { alert('This account is not allowed.'); window.netlifyIdentity.logout(); }
    });
    window.netlifyIdentity.open();
  }

  function updateTopBarLogout(){
    const topBar = document.querySelector('.top-bar');
    if(!topBar) return;
    const btn = document.createElement('button');
    btn.className = 'mute';
    btn.textContent = '🔒 Logout';
    btn.addEventListener('click', ()=>{ clearSession(); if(window.netlifyIdentity && window.netlifyIdentity.currentUser()){ window.netlifyIdentity.logout(); } window.location.href = 'login.html'; });
    topBar.appendChild(btn);
  }

  function gateOrProceed(){
    if (hasValidSession()){
      updateTopBarLogout();
    } else {
      const here = location.pathname.split('/').pop();
      if (here !== 'login.html') window.location.href = 'login.html';
    }
  }

  function initLoginUI(){
    const passBox = document.getElementById('passcodeBox');
    const netliBox = document.getElementById('netlifyBox');
    if (AUTH_MODE === 'netlify'){
      passBox && passBox.classList.add('hidden');
      netliBox && netliBox.classList.remove('hidden');
      document.getElementById('netlifyLogin')?.addEventListener('click', handleNetlifyLogin);
    } else {
      netliBox && netliBox.classList.add('hidden');
      passBox && passBox.classList.remove('hidden');
      const btn = document.getElementById('passcodeLogin');
      const input = document.getElementById('passcode');
      btn && btn.addEventListener('click', ()=> handlePasscodeLogin(input.value));
      input && input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') handlePasscodeLogin(input.value); });
    }
  }

  // Cross-tab logout listener
  window.addEventListener('storage', (e)=>{
    if (e.key === 'vp_auth_event'){
      try { localStorage.removeItem(SESSION_KEY); } catch(_) {}
      if (location.pathname.split('/').pop() !== 'login.html') {
        location.href = 'login.html';
      }
    }
  });

  window.VPAuth = { gateOrProceed, initLoginUI, clearSession };
})();
