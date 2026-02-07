(function(){
  const el = document.getElementById('countdown'); if(!el) return;
  function nextVal(){ const now = new Date(); const feb=1; const year = (now.getMonth()>feb)|| (now.getMonth()===feb && now.getDate()>14) ? now.getFullYear()+1 : now.getFullYear(); return new Date(year, 1, 14, 0,0,0,0); }
  function upd(){ const now=new Date(); const t=nextVal(); const diff=t-now; const sec = Math.max(0, Math.floor(diff/1000)); const d=Math.floor(sec/86400); const h=Math.floor((sec%86400)/3600); const m=Math.floor((sec%3600)/60); const s=sec%60; el.textContent = `Valentine’s Day in ${d}d ${String(h).padStart(2,'0')}h ${String(m).padStart(2,'0')}m ${String(s).padStart(2,'0')}s`; }
  upd(); setInterval(upd, 1000);
})();
