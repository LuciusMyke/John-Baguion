
/* ========== BLUE ASH / EMBER EFFECT ========== */
(function(){
  const c=document.getElementById('ash-canvas');
  const ctx=c.getContext('2d');
  let W,H;
  const embers=[];
  const COUNT=110;

  function resize(){W=c.width=innerWidth;H=c.height=innerHeight}
  resize();window.addEventListener('resize',resize);

  const isDark=()=>document.documentElement.getAttribute('data-theme')==='dark';

  /* each ember: small ash flake rising + drifting */
  function makeEmber(){
    return{
      x:Math.random()*W,
      y:H+Math.random()*80,          /* start below screen */
      vx:(Math.random()-.5)*0.5,     /* gentle horizontal drift */
      vy:-(Math.random()*0.6+0.2),   /* rise speed */
      size:Math.random()*2.2+0.4,
      alpha:Math.random()*0.55+0.1,
      flicker:Math.random()*Math.PI*2,/* phase offset for flicker */
      flickerSpeed:0.04+Math.random()*0.06,
      life:1,
      decay:0.0015+Math.random()*0.002,
      wobble:Math.random()*Math.PI*2,
      wobbleSpeed:0.015+Math.random()*0.02,
      wobbleAmp:0.3+Math.random()*0.7,
      /* color: mix of cyan/blue tones for "blue fire ash" */
      hue:180+Math.random()*40,      /* 180-220 = cyan to blue */
      sat:80+Math.random()*20,
    };
  }

  for(let i=0;i<COUNT;i++){
    const e=makeEmber();
    e.y=Math.random()*H; /* scatter initial positions */
    e.life=Math.random();
    embers.push(e);
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const dark=isDark();
    if(!dark){requestAnimationFrame(draw);return} /* hide in light mode */

    embers.forEach((e,i)=>{
      /* wobble x */
      e.wobble+=e.wobbleSpeed;
      e.x+=e.vx+Math.sin(e.wobble)*e.wobbleAmp;
      e.y+=e.vy;
      e.flicker+=e.flickerSpeed;
      e.life-=e.decay;

      if(e.life<=0||e.y<-20){
        /* reset */
        const n=makeEmber();
        embers[i]=n;
        return;
      }

      /* flicker alpha */
      const flickerAlpha=e.alpha*(0.6+0.4*Math.sin(e.flicker));
      const a=flickerAlpha*e.life;

      /* glow core */
      const gradient=ctx.createRadialGradient(e.x,e.y,0,e.x,e.y,e.size*3);
      gradient.addColorStop(0,`hsla(${e.hue},${e.sat}%,75%,${a})`);
      gradient.addColorStop(0.4,`hsla(${e.hue},${e.sat}%,55%,${a*0.6})`);
      gradient.addColorStop(1,`hsla(${e.hue},${e.sat}%,40%,0)`);

      ctx.beginPath();
      ctx.arc(e.x,e.y,e.size*3,0,Math.PI*2);
      ctx.fillStyle=gradient;
      ctx.fill();

      /* tiny bright core dot */
      ctx.beginPath();
      ctx.arc(e.x,e.y,e.size*0.5,0,Math.PI*2);
      ctx.fillStyle=`hsla(${e.hue-10},100%,90%,${a*0.9})`;
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ========== TYPING ========== */
(function(){
  const el=document.getElementById('typed');
const words=['Junior Full Stack Developer','React Native Developer','Go Backend Engineer','MongoDB Architect','building LMS platforms'];
  let wi=0,ci=0,del=false;
  function type(){
    const w=words[wi];
    if(!del){el.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(type,1600);return}}
    else{el.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length}}
    setTimeout(type,del?45:80);
  }
  type();
})();

/* ========== PILL NAV GLIDER ========== */
(function(){
  const pill=document.getElementById('navPill');
  const glider=document.getElementById('navGlider');
  const links=[...pill.querySelectorAll('a')];

  function moveGlider(el){
    glider.style.left=(el.offsetLeft)+'px';
    glider.style.width=(el.offsetWidth)+'px';
  }

  /* init on active */
  const initActive=pill.querySelector('a.active');
  if(initActive) setTimeout(()=>moveGlider(initActive),50);

  links.forEach(a=>{
    a.addEventListener('click',()=>{
      links.forEach(l=>l.classList.remove('active'));
      a.classList.add('active');
      moveGlider(a);
    });
  });

  /* scroll spy */
  const sections=document.querySelectorAll('section[id]');
  const spy=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id=e.target.getAttribute('id');
        links.forEach(l=>l.classList.remove('active'));
        const match=pill.querySelector(`a[data-section="${id}"]`);
        if(match){match.classList.add('active');moveGlider(match)}
      }
    });
  },{threshold:.45});
  sections.forEach(s=>spy.observe(s));

  window.addEventListener('resize',()=>{
    const cur=pill.querySelector('a.active');
    if(cur) moveGlider(cur);
  });
})();

/* ========== MODE TOGGLE ========== */
const modeBtn=document.getElementById('modeBtn');
modeBtn.addEventListener('click',()=>{
  const r=document.documentElement;
  const light=r.getAttribute('data-theme')==='light';
  r.setAttribute('data-theme',light?'dark':'light');
  modeBtn.textContent=light?'◐ light':'◑ dark';
});

/* ========== HAMBURGER ========== */
const hamBtn=document.getElementById('hamBtn');
const mobileNav=document.getElementById('mobileNav');
const overlay=document.getElementById('mobileOverlay');
hamBtn.addEventListener('click',()=>{
  hamBtn.classList.toggle('open');
  mobileNav.classList.toggle('show');
  overlay.classList.toggle('show');
});
function closeNav(){
  hamBtn.classList.remove('open');
  mobileNav.classList.remove('show');
  overlay.classList.remove('show');
}

/* ========== REVEAL ========== */
const reveals=document.querySelectorAll('.reveal');
new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
},{threshold:.1}).observe && reveals.forEach(r=>{
  new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')});
  },{threshold:.1}).observe(r);
});

/* ========== SKILL BARS ========== */
document.querySelectorAll('.skill-fill').forEach(b=>{
  b.style.width='0%';
  new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.width=(parseFloat(e.target.dataset.w)*100)+'%';
        e.target.classList.add('animated');
      }
    });
  },{threshold:.5}).observe(b);
});
