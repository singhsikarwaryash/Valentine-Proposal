(function(){
  const layer = document.getElementById('heartsLayer'); if(!layer) return;
  const pool = []; const colors = ['#ff6b8f','#ff8fb1','#fda4af','#ff9cb8','#ffb3c1'];
  function spawn(){
    const h = document.createElement('div'); h.className='heart'; h.textContent='❤';
    const size = Math.random()*18 + 10; const left = Math.random()*100; const dur = Math.random()*10 + 16; const delay = Math.random()*6;
    h.style.left = left+'vw'; h.style.fontSize = size+'px'; h.style.animationDuration = dur+'s'; h.style.animationDelay = delay+'s';
    h.style.color = colors[Math.floor(Math.random()*colors.length)];
    h.style.setProperty('--scale', (Math.random()*0.6 + 0.7).toFixed(2));
    h.style.setProperty('--drift', (Math.random()>0.5?1:-1) * (Math.random()*50 + 10) + 'px');
    layer.appendChild(h); pool.push(h); if(pool.length>50){ const old = pool.shift(); old.remove(); }
  }
  for(let i=0;i<24;i++) spawn(); setInterval(spawn, 1200);
})();
