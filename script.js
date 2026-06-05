(function(){
    // ============================================
    // Multi-Fallback Asset Loader
    // ============================================
    // Usage: loadWithFallback(element, 'src' or 'href', fallbackUrls, callback)
    //        OR for dynamic assets: loadAssetWithFallback(fallbackUrls, callback)
    
    window.V3Fallback = {
        // For HTML elements with src/href attributes (img, link, script)
        loadElement: function(element, attribute, fallbackUrls, onSuccess) {
            if (!element || !fallbackUrls || fallbackUrls.length === 0) return;
            
            let currentIndex = 0;
            const primaryUrl = fallbackUrls[0];
            
            const tryNext = function() {
                currentIndex++;
                if (currentIndex < fallbackUrls.length) {
                    element[attribute] = fallbackUrls[currentIndex];
                } else {
                    console.warn('All fallback URLs failed for element:', element);
                    if (onSuccess) onSuccess(false);
                }
            };
            
            element.setAttribute('data-fallback-index', '0');
            element[attribute] = primaryUrl;
            
            const errorHandler = function() {
                element.removeEventListener('error', errorHandler);
                tryNext();
            };
            
            element.addEventListener('error', errorHandler);
            
            const loadHandler = function() {
                element.removeEventListener('load', loadHandler);
                element.removeEventListener('error', errorHandler);
                if (onSuccess) onSuccess(true);
            };
            
            element.addEventListener('load', loadHandler);
        },
        
        // For dynamically created assets (scripts, stylesheets)
        loadAsset: function(fallbackUrls, onSuccess, onError) {
            if (!fallbackUrls || fallbackUrls.length === 0) return;
            
            let currentIndex = 0;
            
            const tryUrl = function(url) {
                const isScript = url.endsWith('.js') || url.includes('script');
                const isStyle = url.endsWith('.css') || url.includes('styles');
                
                if (isScript) {
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = function() {
                        if (onSuccess) onSuccess(true, url);
                    };
                    script.onerror = function() {
                        currentIndex++;
                        if (currentIndex < fallbackUrls.length) {
                            tryUrl(fallbackUrls[currentIndex]);
                        } else {
                            if (onError) onError('All fallback URLs failed');
                            console.error('All fallback URLs failed for asset:', fallbackUrls);
                        }
                    };
                    document.head.appendChild(script);
                } 
                else if (isStyle) {
                    const link = document.createElement('link');
                    link.rel = 'stylesheet';
                    link.href = url;
                    link.onload = function() {
                        if (onSuccess) onSuccess(true, url);
                    };
                    link.onerror = function() {
                        currentIndex++;
                        if (currentIndex < fallbackUrls.length) {
                            tryUrl(fallbackUrls[currentIndex]);
                        } else {
                            if (onError) onError('All fallback URLs failed');
                            console.error('All fallback URLs failed for asset:', fallbackUrls);
                        }
                    };
                    document.head.appendChild(link);
                }
                else {
                    // Generic fetch for other asset types
                    fetch(url, { method: 'HEAD', mode: 'no-cors' })
                        .then(function() {
                            if (onSuccess) onSuccess(true, url);
                        })
                        .catch(function() {
                            currentIndex++;
                            if (currentIndex < fallbackUrls.length) {
                                tryUrl(fallbackUrls[currentIndex]);
                            } else {
                                if (onError) onError('All fallback URLs failed');
                            }
                        });
                }
            };
            
            tryUrl(fallbackUrls[0]);
        },
        
        // For images specifically (with DOM element)
        loadImage: function(imgElement, fallbackUrls) {
            this.loadElement(imgElement, 'src', fallbackUrls);
        },
        
        // For CSS links specifically (with DOM element)
        loadCSS: function(linkElement, fallbackUrls) {
            this.loadElement(linkElement, 'href', fallbackUrls);
        }
    };
    
    // ============================================
    // Initialize all assets with fallbacks
    // ============================================
    
    // Define fallback chains
    const CSS_FALLBACKS = [
        'https://john-ogletree.github.io/Asset-barn/styles.css',
        'https://asset-barn.pages.dev/styles.css',
        'https://cdn.john-ogletree.me/styles.css'
    ];
    
    const SCRIPT_FALLBACKS = [
        'https://john-ogletree.github.io/Asset-barn/script.js',
        'https://asset-barn.pages.dev/script.js',
        'https://cdn.john-ogletree.me/script.js'
    ];
    
    const LOGO_FALLBACKS = [
        'https://john-ogletree.github.io/Asset-barn/v3.png',
        'https://asset-barn.pages.dev/v3.png',
        'https://cdn.john-ogletree.me/v3.png'
    ];
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Handle CSS link fallback
        const cssLink = document.querySelector('link[href*="Asset-barn/styles.css"]');
        if (cssLink) {
            // Store original onerror to prevent conflicts
            const originalError = cssLink.onerror;
            cssLink.onerror = function(e) {
                if (originalError) originalError.call(this, e);
                // Use our fallback system if the link fails
                console.log('Primary CSS failed, trying fallbacks...');
            };
            // Re-apply with our system
            V3Fallback.loadCSS(cssLink, CSS_FALLBACKS);
        }
        
        // Handle logo image fallback
        const logoImg = document.querySelector('.about-img img');
        if (logoImg) {
            V3Fallback.loadImage(logoImg, LOGO_FALLBACKS);
        }
        
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
        
        // Navigation setup
        let navItems = document.querySelectorAll('.nav-item[data-section]');
        function setActive(id){ navItems.forEach(i=>{ if(i.getAttribute('data-section')===id) i.classList.add('active'); else i.classList.remove('active'); }); }
        function scrollTo(id){ let el = document.getElementById(id); if(el){ el.scrollIntoView({behavior:'smooth',block:'start'}); setActive(id); } }
        navItems.forEach(i=>{ i.addEventListener('click',()=>{ let s=i.getAttribute('data-section'); scrollTo(s); }); i.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); scrollTo(i.getAttribute('data-section')); } }); });
        let home = document.getElementById('homeLogoLink'); if(home){ home.addEventListener('click',e=>{ e.preventDefault(); scrollTo('about'); }); home.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); scrollTo('about'); } }); }
        window.addEventListener('scroll',()=>{ let pos=window.scrollY+100; let secs=['about','skills','services','pricing','products','projects','blog','contact']; let cur=''; for(let s of secs){ let sec=document.getElementById(s); if(sec&&sec.offsetTop<=pos) cur=s; } if(cur) setActive(cur); }); setActive('about');
        
        // Accessibility modal
        let a11yBtn = document.getElementById('a11yNavBtn'); 
        let modalEl = document.getElementById('a11yModal');
        let closeBtn = document.getElementById('closeModalBtn');
        
        function updateBtns(){ 
            let hc=document.getElementById('highContrastBtn'), lt=document.getElementById('largeTextBtn'), df=document.getElementById('dyslexicFontBtn'), rm=document.getElementById('reduceMotionBtn');
            let ha=document.body.classList.contains('high-contrast'), la=document.body.classList.contains('large-text'), da=document.body.classList.contains('dyslexic-font'), ra=document.body.classList.contains('reduce-motion'); 
            if(hc){ hc.textContent=ha?'On':'Off'; hc.classList.toggle('active',ha); } 
            if(lt){ lt.textContent=la?'On':'Off'; lt.classList.toggle('active',la); } 
            if(df){ df.textContent=da?'On':'Off'; df.classList.toggle('active',da); } 
            if(rm){ rm.textContent=ra?'On':'Off'; rm.classList.toggle('active',ra); } 
        }
        
        if(a11yBtn){ 
            a11yBtn.addEventListener('click',()=>{ 
                if(modalEl){ modalEl.classList.add('active'); document.body.style.overflow='hidden'; updateBtns(); } 
            }); 
            a11yBtn.addEventListener('keydown',e=>{ 
                if(e.key==='Enter'||e.key===' '){ e.preventDefault(); if(modalEl){ modalEl.classList.add('active'); document.body.style.overflow='hidden'; updateBtns(); } } 
            }); 
        }
        
        function modal(msg){ let o=document.createElement('div'); o.setAttribute('role','dialog'); o.setAttribute('aria-modal','true'); o.style.cssText='position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.95);backdrop-filter:blur(12px);z-index:10000;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;'; o.innerHTML=`<div style="background:#0f0f0f;border:1px solid rgba(0,212,255,.3);border-radius:24px;padding:2rem;max-width:420px;width:90%;text-align:center;box-shadow:0 25px 40px -12px rgba(0,212,255,.2);"><i class="fas fa-code-branch" style="font-size:3rem;color:#00d4ff;margin-bottom:1rem;"></i><h3 style="margin-bottom:.5rem;color:#fff;">${msg}</h3><p style="color:#a0a0a0;margin-bottom:1.5rem;">This feature is currently under development. Stay tuned!</p><button id="closeModalBtn" style="background:linear-gradient(135deg,#00d4ff,#7c3aed);border:none;padding:.6rem 1.8rem;border-radius:40px;color:#fff;font-weight:600;cursor:pointer;">Got it</button></div>`; document.body.appendChild(o); setTimeout(()=>o.style.opacity='1',10); let close=o.querySelector('#closeModalBtn'); let rm=()=>{ o.style.opacity='0'; setTimeout(()=>o.remove(),200); }; close.onclick=rm; close.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') rm(); }); o.onclick=e=>{ if(e.target===o) rm(); }; }
        
        document.addEventListener('click',e=>{ if(e.target.closest('.project-card-link')||e.target.closest('.blog-card-link')) modal('Project Details'); if(e.target.closest('.pricing-btn')){ let plan=e.target.closest('.pricing-btn').getAttribute('data-plan'); modal(plan+' Plan - Get in touch for details!'); } });
        
        let viewProj = document.getElementById('view-projects'); if(viewProj) viewProj.addEventListener('click',e=>{ e.preventDefault(); window.open('https://github.com/v3','_blank'); });
        let viewBlog = document.getElementById('view-blog'); if(viewBlog) viewBlog.addEventListener('click',e=>{ e.preventDefault(); modal('All Blog Posts'); });
        
        let closeModal = ()=>{ if(modalEl){ modalEl.classList.remove('active'); document.body.style.overflow=''; } };
        if(closeBtn){ closeBtn.addEventListener('click',closeModal); closeBtn.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' ') closeModal(); }); }
        if(modalEl) modalEl.addEventListener('click',e=>{ if(e.target===modalEl) closeModal(); });
        
        // Accessibility settings
        let hc=document.getElementById('highContrastBtn'), lt=document.getElementById('largeTextBtn'), df=document.getElementById('dyslexicFontBtn'), rm=document.getElementById('reduceMotionBtn');
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
        
        // Intersection Observer for fade-in animations
        let observer = new IntersectionObserver(e=>{ e.forEach(entry=>{ if(entry.isIntersecting){ entry.target.classList.add('fade-in'); observer.unobserve(entry.target); } }); },{threshold:.1,rootMargin:'0px 0px -30px 0px'});
        document.querySelectorAll('section').forEach(s=>observer.observe(s));
        
        // Touch and drag prevention
        let touchX=0; document.body.addEventListener('touchstart',e=>{ touchX=e.touches[0].clientX; },{passive:false}); document.body.addEventListener('touchmove',e=>{ let curX=e.touches[0].clientX, diff=curX-touchX; if(Math.abs(diff)>10){ if((diff>0&&window.scrollX===0)||(diff<0&&(window.scrollX+window.innerWidth)>=document.documentElement.scrollWidth)) e.preventDefault(); } },{passive:false}); document.addEventListener('contextmenu',e=>e.preventDefault()); document.addEventListener('dragstart',e=>e.preventDefault());
    });
})();