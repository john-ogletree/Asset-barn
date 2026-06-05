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
    
    // Bottom navigation active state
    let bottomNavItems = document.querySelectorAll('.bottom-nav-item[data-section]');
    function setActiveNav(id){
        bottomNavItems.forEach(i=>{
            if(i.getAttribute('data-section') === id) i.classList.add('active');
            else i.classList.remove('active');
        });
    }
    
    // Scroll to section function
    function scrollTo(id){
        let el = document.getElementById(id);
        if(el){
            el.scrollIntoView({behavior:'smooth',block:'start'});
            setActiveNav(id);
        }
    }
    
    // Setup bottom nav click handlers
    bottomNavItems.forEach(i=>{
        i.addEventListener('click',()=>{
            let s = i.getAttribute('data-section');
            scrollTo(s);
        });
    });
    
    // Contact modal handling
    let contactNavBtn = document.getElementById('contactNavBtn');
    let contactModal = document.getElementById('contactModal');
    let closeContactModalBtn = document.getElementById('closeContactModalBtn');
    
    if(contactNavBtn && contactModal){
        contactNavBtn.addEventListener('click', function(e){
            e.preventDefault();
            contactModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeContactModal(){
            contactModal.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        if(closeContactModalBtn){
            closeContactModalBtn.addEventListener('click', closeContactModal);
        }
        
        contactModal.addEventListener('click', function(e){
            if(e.target === contactModal) closeContactModal();
        });
    }
    
    // Accessibility modal handling
    let a11yBtn = document.getElementById('a11yNavBtn');
    let modalEl = document.getElementById('a11yModal');
    let closeBtn = document.getElementById('closeModalBtn');
    
    function updateBtns(){
        let hc = document.getElementById('highContrastBtn');
        let lt = document.getElementById('largeTextBtn');
        let df = document.getElementById('dyslexicFontBtn');
        let rm = document.getElementById('reduceMotionBtn');
        let ha = document.body.classList.contains('high-contrast');
        let la = document.body.classList.contains('large-text');
        let da = document.body.classList.contains('dyslexic-font');
        let ra = document.body.classList.contains('reduce-motion');
        if(hc){ hc.textContent = ha ? 'On' : 'Off'; hc.classList.toggle('active', ha); }
        if(lt){ lt.textContent = la ? 'On' : 'Off'; lt.classList.toggle('active', la); }
        if(df){ df.textContent = da ? 'On' : 'Off'; df.classList.toggle('active', da); }
        if(rm){ rm.textContent = ra ? 'On' : 'Off'; rm.classList.toggle('active', ra); }
    }
    
    if(a11yBtn && modalEl){
        a11yBtn.addEventListener('click', function(){
            modalEl.classList.add('active');
            document.body.style.overflow = 'hidden';
            updateBtns();
        });
    }
    
    function closeModal(){
        if(modalEl){
            modalEl.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    if(closeBtn){
        closeBtn.addEventListener('click', closeModal);
    }
    if(modalEl){
        modalEl.addEventListener('click', function(e){
            if(e.target === modalEl) closeModal();
        });
    }
    
    // Accessibility settings
    let hc = document.getElementById('highContrastBtn');
    let lt = document.getElementById('largeTextBtn');
    let df = document.getElementById('dyslexicFontBtn');
    let rm = document.getElementById('reduceMotionBtn');
    
    function applyHigh(e){ if(e) document.body.classList.add('high-contrast'); else document.body.classList.remove('high-contrast'); localStorage.setItem('highContrast', e); updateBtns(); }
    function applyLarge(e){ if(e) document.body.classList.add('large-text'); else document.body.classList.remove('large-text'); localStorage.setItem('largeText', e); updateBtns(); }
    function applyDys(e){ if(e) document.body.classList.add('dyslexic-font'); else document.body.classList.remove('dyslexic-font'); localStorage.setItem('dyslexicFont', e); updateBtns(); }
    function applyReduce(e){ if(e) document.body.classList.add('reduce-motion'); else document.body.classList.remove('reduce-motion'); localStorage.setItem('reduceMotion', e); updateBtns(); }
    
    if(hc){ hc.addEventListener('click', () => applyHigh(!document.body.classList.contains('high-contrast'))); }
    if(lt){ lt.addEventListener('click', () => applyLarge(!document.body.classList.contains('large-text'))); }
    if(df){ df.addEventListener('click', () => applyDys(!document.body.classList.contains('dyslexic-font'))); }
    if(rm){ rm.addEventListener('click', () => applyReduce(!document.body.classList.contains('reduce-motion'))); }
    
    if(localStorage.getItem('highContrast') === 'true') document.body.classList.add('high-contrast');
    if(localStorage.getItem('largeText') === 'true') document.body.classList.add('large-text');
    if(localStorage.getItem('dyslexicFont') === 'true') document.body.classList.add('dyslexic-font');
    if(localStorage.getItem('reduceMotion') === 'true') document.body.classList.add('reduce-motion');
    updateBtns();
    
    // Intersection Observer for fade-in animations
    let observer = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
            if(entry.isIntersecting){
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.1, rootMargin: '0px 0px -30px 0px'});
    
    document.querySelectorAll('section').forEach(function(s){
        observer.observe(s);
    });
    
    // Prevent context menu and drag
    document.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    document.addEventListener('dragstart', function(e){ e.preventDefault(); });
})();