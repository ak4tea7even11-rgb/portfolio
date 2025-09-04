// year placeholders
['yr','yr2','yr3','yr4','yr5','yr6'].forEach(id=>{
  const el = document.getElementById(id);
  if(el) el.textContent = new Date().getFullYear();
});

// mobile nav toggle
const navBtn = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
if(navBtn){
  navBtn.addEventListener('click', ()=> {
    if(mainNav) mainNav.classList.toggle('show');
  });
}
// support other toggles (pages use navToggle2 etc.)
['navToggle2','navToggle3','navToggle4','navToggle5','navToggle6'].forEach(id=>{
  const b = document.getElementById(id);
  if(b){
    b.addEventListener('click', ()=> {
      const n = document.getElementById('mainNav') || document.querySelector('.main-nav');
      if(n) n.classList.toggle('show');
    });
  }
});

// IntersectionObserver for fade-in effects
const io = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); }});
},{threshold:0.12});
document.querySelectorAll('.fade-up').forEach(el=>io.observe(el));

// LIGHTBOX for portfolio thumbs
document.querySelectorAll('.thumb').forEach(thumb=>{
  thumb.addEventListener('click', function(e){
    e.preventDefault();
    const src = this.getAttribute('href') || this.querySelector('img')?.src;
    const title = this.dataset.title || this.querySelector('.meta')?.textContent || '';
    const desc = this.dataset.desc || '';
    const lb = document.getElementById('lightbox');
    if(!lb) return;
    document.getElementById('lb-img').src = src;
    document.getElementById('lb-title').textContent = title;
    document.getElementById('lb-desc').textContent = desc;
    lb.classList.add('show');
    lb.setAttribute('aria-hidden','false');
  });
});
const lbClose = document.querySelector('.lb-close');
if(lbClose) lbClose.addEventListener('click', ()=>{ const lb = document.getElementById('lightbox'); if(lb){ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true');}});

// close lightbox on outside click
const lb = document.getElementById('lightbox');
if(lb) lb.addEventListener('click', (e)=>{ if(e.target === lb){ lb.classList.remove('show'); lb.setAttribute('aria-hidden','true'); }});

// Contact form (mailto fallback — can integrate Formspree if you want)
const sendBtn = document.getElementById('sendBtn');
if(sendBtn){
  sendBtn.addEventListener('click', ()=>{
    const name = document.getElementById('cname')?.value?.trim();
    const email = document.getElementById('cemail')?.value?.trim();
    const msg = document.getElementById('cmsg')?.value?.trim();
    if(!name || !email || !msg){
      alert('Please fill all fields.');
      return;
    }
    const subject = encodeURIComponent('New project request from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
    window.location.href = 'mailto:hello@brokesellers.dev?subject=' + subject + '&body=' + body;
  });
}

// HERO canvas particle animation (lightweight)
(function(){
  const canvas = document.getElementById('heroCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w=canvas.width=window.innerWidth;
  let h=canvas.height=window.innerHeight;
  const particles = [];
  const count = Math.floor(Math.max(12, Math.min(40, w/80)));
  function rand(min,max){return Math.random()*(max-min)+min;}
  for(let i=0;i<count;i++){
    particles.push({
      x: rand(0,w),
      y: rand(0,h),
      r: rand(1.2,3.6),
      vx: rand(-0.3,0.3),
      vy: rand(-0.2,0.2),
      hue: rand(180,260)
    });
  }
  function resize(){ w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight; }
  window.addEventListener('resize', resize);
  function draw(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient backdrop
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0,'rgba(124,58,237,0.06)');
    g.addColorStop(1,'rgba(6,182,212,0.04)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.vx;
      p.y += p.vy;
      if(p.x < -20) p.x = w + 20;
      if(p.x > w + 20) p.x = -20;
      if(p.y < -20) p.y = h + 20;
      if(p.y > h + 20) p.y = -20;
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue},70%,60%,0.08)`;
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

