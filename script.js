(function(){
    // Set current date in footer
    const footerText = document.getElementById('footerText');
    if (footerText) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        footerText.innerHTML = `© ${year} V3 — Built with <i class="fas fa-heart" style="color:#00d4ff;"></i><span class="visually-hidden"> love</span> | ${dateString}`;
    }
    
    let navItems = document.querySelectorAll('.nav-item[data-section]');
    function setActive(id){ navItems.forEach(i=>{ if(i.getAttribute('data-section')===id) i.classList.add('active'); else i.classList.remove('active'); }); }
    function scrollTo(id){ let el = document.getElementById(id); if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); setActive(id); } }
    navItems.forEach(i=>{ i.addEventListener('click',()=>{ let s=i.getAttribute('data-section'); scrollTo(s); }); i.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); scrollTo(i.getAttribute('data-section')); } }); });
    let home = document.getElementById('homeLogoLink'); if(home){ home.addEventListener('click',e=>{ e.preventDefault(); scrollTo('about'); }); home.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); scrollTo('about'); } }); }
    window.addEventListener('scroll',()=>{ let pos=window.scrollY+100; let secs=['about','skills','services','pricing','products','projects','blog','contact']; let cur=''; for(let s of secs){ let sec=document.getElementById(s); if(sec&&sec.offsetTop<=pos) cur=s; } if(cur) setActive(cur); }); setActive('about');
    
    let a11yBtn = document.getElementById('a11yNavBtn'); if(a11yBtn){ a11yBtn.addEventListener('click',()=>{ document.getElementById('a11yModal').classList.add('active'); document.body.style.overflow='hidden'; updateBtns(); }); a11yBtn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); document.getElementById('a11yModal').classList.add('active'); document.body.style.overflow='hidden'; updateBtns(); } }); }
    
    function modal(msg){ let o=document.createElement('div'); o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true'); o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95);backdrop-filter:blur(12px);z-index:10000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;'; o.innerHTML=`<div style="background:#0f0f0f;border:1px solid rgba(0,212,255,.3);border-radius:24px;padding:2rem;max-width:420px;width:90%;text-align:center;box-shadow:0 25px 40px -12px rgba(0,212,255,.2);"><i class="fas fa-code-branch" style="font-size:3rem;color:#00d4ff;margin-bottom:1rem;"></i><h3 style="margin-bottom:.5rem;color:#fff;">${msg}</h3><p style="color:#a0a0a0;margin-bottom:1.5rem;">This feature is currently under development. Stay tuned!</p><button id="closeModalBtn" style="background:linear-gradient(135deg,#00d4ff,#7c3aed);border:none;padding:.6rem 1.8rem;border-radius:40px;color:#fff;font-weight:600;cursor:pointer;">Got it</button></div>`; document.body.appendChild(o); setTimeout(()=>o.style.opacity='1',10); let close=o.querySelector('#closeModalBtn'); let rm=()=>{ o.style.opacity='0'; setTimeout(()=>o.remove(),200); }; close.onclick=rm; close.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') rm(); }); o.onclick=e=>{ if(e.target===o) rm(); }; }
    
    document.addEventListener('click',e=>{ if(e.target.closest('.project-card-link')||e.target.closest('.blog-card-link')) modal('Project Details'); if(e.target.closest('.pricing-btn')){ let plan=e.target.closest('.pricing-btn').getAttribute('data-plan'); modal(plan+' Plan - Get in touch for details!'); } });
    
    let viewProj = document.getElementById('view-projects'); if(viewProj) viewProj.addEventListener('click',e=>{ e.preventDefault(); window.open('https://github.com/v3','_blank'); });
    let viewBlog = document.getElementById('view-blog'); if(viewBlog) viewBlog.addEventListener('click',e=>{ e.preventDefault(); modal('All Blog Posts'); });
    
    let modalEl = document.getElementById('a11yModal'), closeBtn = document.getElementById('closeModalBtn');
    let closeModal = ()=>{ modalEl.classList.remove('active'); document.body.style.overflow=''; };
    if(closeBtn){ closeBtn.addEventListener('click',closeModal); closeBtn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') closeModal(); }); }
    if(modalEl) modalEl.addEventListener('click',e=>{ if(e.target===modalEl) closeModal(); });
    
    let hc=document.getElementById('highContrastBtn'), lt=document.getElementById('largeTextBtn'), df=document.getElementById('dyslexicFontBtn'), rm=document.getElementById('reduceMotionBtn');
    function updateBtns(){ let ha=document.body.classList.contains('high-contrast'), la=document.body.classList.contains('large-text'), da=document.body.classList.contains('dyslexic-font'), ra=document.body.classList.contains('reduce-motion'); if(hc){ hc.textContent=ha?'On':'Off'; hc.classList.toggle('active',ha); } if(lt){ lt.textContent=la?'On':'Off'; lt.classList.toggle('active',la); } if(df){ df.textContent=da?'On':'Off'; df.classList.toggle('active',da); } if(rm){ rm.textContent=ra?'On':'Off'; rm.classList.toggle('active',ra); } }
    function applyHigh(e){ if(e) document.body.classList.add('high-contrast'); else document.body.classList.remove('high-contrast'); localStorage.setItem('highContrast',e); updateBtns(); }
    function applyLarge(e){ if(e) document.body.classList.add('large-text'); else document.body.classList.remove('large-text'); localStorage.setItem('largeText',e); updateBtns(); }
    function applyDys(e){ if(e) document.body.classList.add('dyslexic-font'); else document.body.classList.remove('dyslexic-font'); localStorage.setItem('dyslexicFont',e); updateBtns(); }
    function applyReduce(e){ if(e) document.body.classList.add('reduce-motion'); else document.body.classList.remove('reduce-motion'); localStorage.setItem('reduceMotion',e); updateBtns(); }
    if(hc){ hc.addEventListener('click',()=>applyHigh(!document.body.classList.contains('high-contrast'))); hc.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') applyHigh(!document.body.classList.contains('high-contrast')); }); }
    if(lt){ lt.addEventListener('click',()=>applyLarge(!document.body.classList.contains('large-text'))); lt.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') applyLarge(!document.body.classList.contains('large-text')); }); }
    if(df){ df.addEventListener('click',()=>applyDys(!document.body.classList.contains('dyslexic-font'))); df.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') applyDys(!document.body.classList.contains('dyslexic-font')); }); }
    if(rm){ rm.addEventListener('click',()=>applyReduce(!document.body.classList.contains('reduce-motion'))); rm.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') applyReduce(!document.body.classList.contains('reduce-motion')); }); }
    if(localStorage.getItem('highContrast')==='true') document.body.classList.add('high-contrast');
    if(localStorage.getItem('largeText')==='true') document.body.classList.add('large-text');
    if(localStorage.getItem('dyslexicFont')==='true') document.body.classList.add('dyslexic-font');
    if(localStorage.getItem('reduceMotion')==='true') document.body.classList.add('reduce-motion');
    updateBtns();
    
    let observer = new IntersectionObserver(e=>{ e.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('fade-in'); observer.unobserve(entry.target); } }); },{threshold:.1,rootMargin:'0px 0px -30px 0px'});
    document.querySelectorAll('section').forEach(s=>observer.observe(s));
    
    let touchX=0; document.body.addEventListener('touchstart',e=>{ touchX=e.touches[0].clientX; },{passive:false}); document.body.addEventListener('touchmove',e=>{ let curX=e.touches[0].clientX, diff=curX-touchX; if(Math.abs(diff)>10){ if((diff>0&&window.scrollX===0)||(diff<0&&(window.scrollX+window.innerWidth)>=document.documentElement.scrollWidth)) e.preventDefault(); } },{passive:false}); document.addEventListener('contextmenu',e=>e.preventDefault()); document.addEventListener('dragstart',e=>e.preventDefault());
})();