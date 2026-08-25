// ---------- resume download (base64 embed) ----------

// ---------- terminal typing sequence ----------
const termBody = document.getElementById('termBody');
const lines = [
  {text:"$ whoami", cls:"prompt"},
  {text:"> Sachin Kumar Sharma", cls:""},
  {text:"$ npm test -- profile.spec.js", cls:"prompt"},
  {text:"", cls:""},
  {text:"✓ has 3+ years automation experience (14ms)", cls:"pass"},
  {text:"✓ owns Jenkins CI/CD pipelines end-to-end (9ms)", cls:"pass"},
  {text:"✓ builds Java · Selenium · Playwright frameworks (11ms)", cls:"pass"},
  {text:"✓ automated 300+ regression scenarios (8ms)", cls:"pass"},
  {text:"", cls:""},
  {text:"4 passed, 0 failed · Chandigarh, India", cls:"sum"},
];

let lineIdx = 0, charIdx = 0;
let currentLineEl = null;

function typeNext(){
  if(lineIdx >= lines.length){
    document.getElementById('heroName').classList.add('show');
    setTimeout(()=>document.getElementById('heroRole').classList.add('show'), 150);
    setTimeout(()=>document.getElementById('heroTags').classList.add('show'), 300);
    setTimeout(()=>document.getElementById('heroActions').classList.add('show'), 450);
    setTimeout(()=>document.getElementById('heroSocial').classList.add('show'), 600);
    setTimeout(activateRepl, 700);
    return;
  }
  const line = lines[lineIdx];
  if(charIdx === 0){
    currentLineEl = document.createElement('div');
    currentLineEl.className = 'term-line ' + line.cls;
    termBody.appendChild(currentLineEl);
  }
  if(charIdx <= line.text.length){
    currentLineEl.textContent = line.text.slice(0, charIdx);
    if(charIdx === line.text.length){
      currentLineEl.innerHTML = currentLineEl.textContent; // finalize
    }
    charIdx++;
    setTimeout(typeNext, line.text.length===0 ? 40 : (line.cls==='pass' ? 10 : 22));
  } else {
    lineIdx++; charIdx = 0;
    setTimeout(typeNext, line.text.length===0 ? 60 : 130);
  }
}

// respect reduced motion: skip straight to final state
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(prefersReduced){
  termBody.innerHTML = lines.map(l=>`<div class="term-line ${l.cls}">${l.text}</div>`).join('');
  ['heroName','heroRole','heroTags','heroActions','heroSocial'].forEach(id=>document.getElementById(id).classList.add('show'));
  activateRepl();
} else {
  setTimeout(typeNext, 350);
}

// blinking cursor appended after typing completes
setTimeout(()=>{
  const c = document.createElement('span');
  c.className='cursor';
  termBody.appendChild(c);
}, prefersReduced ? 0 : 350 + lines.reduce((a,l)=>a + (l.text.length===0?60:130) + l.text.length*(l.cls==='pass'?10:22), 0));

// ---------- scroll progress bar ----------
const progressEl = document.getElementById('progress');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = h.scrollTop;
  const height = h.scrollHeight - h.clientHeight;
  progressEl.style.width = (height>0 ? (scrolled/height*100) : 0) + '%';
}
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// ---------- nav scrollspy ----------
const stages = document.querySelectorAll('.nav-stage');
const sectionIds = ['home','about','skills','experience','projects','contact'];
const sectionEls = sectionIds.map(id=>document.getElementById(id)).filter(Boolean);

stages.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.getElementById(btn.dataset.target);
    if(target) target.scrollIntoView({behavior: prefersReduced ? 'auto':'smooth'});
  });
});

const observer = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      stages.forEach(s=>s.classList.remove('active'));
      const match = document.querySelector(`.nav-stage[data-target="${entry.target.id}"]`);
      if(match) match.classList.add('active');
    }
  });
}, {rootMargin:'-40% 0px -50% 0px'});

sectionEls.forEach(el=>observer.observe(el));

// ---------- project accordion ----------
document.querySelectorAll('.proj-head').forEach(head=>{
  head.addEventListener('click', ()=>{
    const card = head.closest('.proj-card');
    const isOpen = card.classList.contains('open');
    document.querySelectorAll('.proj-card').forEach(c=>c.classList.remove('open'));
    if(!isOpen) card.classList.add('open');
  });
});
// open first project by default
document.querySelector('.proj-card').classList.add('open');

// ---------- copy curl ----------
document.getElementById('copyCurl').addEventListener('click', (e)=>{
  const text = `curl -X POST api.sachin.dev/contact -H "Content-Type: application/json" -d '{"from":"you@company.com","msg":"lets talk"}'`;
  navigator.clipboard.writeText(text).then(()=>{
    e.target.textContent = 'copied ✓';
    setTimeout(()=>e.target.textContent='copy', 1500);
  });
});

// ---------- mobile nav ----------
const navToggle = document.getElementById('navToggle');
const navMobile = document.getElementById('navMobile');
if(navToggle && navMobile){
  navToggle.addEventListener('click', ()=>{
    const isOpen = navMobile.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen ? 'true':'false');
  });
  document.querySelectorAll('.nav-stage-m').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = document.getElementById(btn.dataset.target);
      if(target) target.scrollIntoView({behavior: prefersReduced ? 'auto':'smooth'});
      navMobile.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded','false');
    });
  });
}

// keep mobile nav dots in sync with the same scrollspy observer
const mobileStages = document.querySelectorAll('.nav-stage-m');
const syncObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      mobileStages.forEach(s=>s.classList.remove('active'));
      const match = document.querySelector(`.nav-stage-m[data-target="${entry.target.id}"]`);
      if(match) match.classList.add('active');
    }
  });
}, {rootMargin:'-40% 0px -50% 0px'});
sectionEls.forEach(el=>syncObserver.observe(el));

// ---------- contact click-to-copy ----------
document.querySelectorAll('.contact-link[href^="mailto:"], .contact-link[href^="tel:"]').forEach(link=>{
  link.addEventListener('click', ()=>{
    const raw = link.textContent.trim().split('\n').pop().trim();
    navigator.clipboard?.writeText(raw).then(()=>{
      showToast(`Copied: ${raw}`);
    }).catch(()=>{});
  });
});

// ---------- scroll to top + toast on reaching footer ----------
const toTopBtn = document.getElementById('toTop');
const footerEl = document.querySelector('footer');
let coverageShown = false;

window.addEventListener('scroll', ()=>{
  toTopBtn.classList.toggle('show', window.scrollY > 600);
}, {passive:true});

toTopBtn.addEventListener('click', ()=>{
  window.scrollTo({top:0, behavior: prefersReduced ? 'auto' : 'smooth'});
});

if(footerEl){
  const footerObserver = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting && !coverageShown){
        coverageShown = true;
        showToast('✓ 100% page coverage — all sections visited');
      }
    });
  }, {threshold:0.6});
  footerObserver.observe(footerEl);
}

function showToast(msg){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>toast.classList.remove('show'), 2600);
}

// ---------- project card tilt (pointer devices only) ----------
const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
if(supportsHover && !prefersReduced){
  document.querySelectorAll('.proj-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${(-y*2.2).toFixed(2)}deg) rotateY(${(x*2.2).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
    });
  });
}

// ---------- terminal REPL ----------
const termInputRow = document.getElementById('termInputRow');
const termInput = document.getElementById('termInput');

function activateRepl(){
  if(!termInputRow) return;
  const cursorEl = termBody.querySelector('.cursor');
  if(cursorEl) cursorEl.remove();
  termInputRow.style.display = 'flex';
  printLine("type 'help' to explore this page from the terminal", '');
  termBody.parentElement.addEventListener('click', ()=>termInput.focus());
}

function printLine(text, cls){
  const el = document.createElement('div');
  el.className = 'term-line ' + (cls||'');
  el.textContent = text;
  termBody.appendChild(el);
  termBody.scrollTop = termBody.scrollHeight;
}

function printHTML(html, cls){
  const el = document.createElement('div');
  el.className = 'term-line ' + (cls||'');
  el.innerHTML = html;
  termBody.appendChild(el);
  termBody.scrollTop = termBody.scrollHeight;
}

const REPL_COMMANDS = {
  help: ()=>{
    printLine('available commands:', 'sum');
    [
      ['whoami','who you\'re looking at'],
      ['about','professional summary'],
      ['skills','technical skill list'],
      ['experience','work history'],
      ['projects','key projects + metrics'],
      ['contact','email / phone / links'],
      ['resume','download the resume PDF'],
      ['goto <section>','jump to a section, e.g. goto projects'],
      ['clear','clear the terminal'],
    ].forEach(([cmd,desc])=>printLine(`  ${cmd.padEnd(16,' ')} ${desc}`, ''));
  },
  whoami: ()=>printLine('Sachin Kumar Sharma — Software Engineer II, QA Automation / SDET · Chandigarh, India', 'pass'),
  about: ()=>{
    printLine('3+ years building automation frameworks & CI/CD-integrated test pipelines', 'pass');
    printLine('for enterprise SaaS. IAM/SCIM platform testing, PostgreSQL validation, Agile delivery.', '');
    document.getElementById('about').scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
  },
  skills: ()=>{
    printLine('Java · Selenium · Playwright · TestNG · Rest Assured · Jenkins · PostgreSQL · SCIM/IAM', 'pass');
    document.getElementById('skills').scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
  },
  experience: ()=>{
    printLine('Alert Enterprise (2023–present) · Chegg India (2022–23) · TexAu intern (2022)', 'pass');
    document.getElementById('experience').scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
  },
  projects: ()=>{
    printLine('Identity & Access Automation Suite · Healthcare Lifecycle Automation · Access Governance Automation', 'pass');
    document.getElementById('projects').scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
  },
  contact: ()=>{
    printHTML('i.sachin950930@gmail.com · +91 95093 05040 · <span class="out-link">github.com/sachin-sharma</span>', 'pass');
    document.getElementById('contact').scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
  },
  resume: ()=>{
    printLine('opening Sachin_Kumar_Sharma_Resume.pdf ...', 'pass');
    document.getElementById('resumeBtn').click();
  },
  clear: ()=>{ termBody.innerHTML=''; },
  sudo: ()=>printLine('permission denied: nice try though', 'err'),
};

if(termInput){
  termInput.addEventListener('keydown', (e)=>{
    if(e.key !== 'Enter') return;
    const raw = termInput.value.trim();
    if(!raw) return;
    printLine(raw, 'echo');
    termInput.value = '';
    const [cmd, ...rest] = raw.toLowerCase().split(/\s+/);
    if(cmd === 'goto' && rest[0]){
      const target = document.getElementById(rest[0]);
      if(target){
        printLine(`→ jumping to #${rest[0]}`, 'pass');
        target.scrollIntoView({behavior: prefersReduced?'auto':'smooth'});
      } else {
        printLine(`no such section: "${rest[0]}"`, 'err');
      }
    } else if(REPL_COMMANDS[cmd]){
      REPL_COMMANDS[cmd]();
    } else {
      printLine(`command not found: "${raw}" — type 'help'`, 'err');
    }
  });
}
