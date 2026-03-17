(function() {
    let zapMode = false;

    // --- AUTOMATIC CLEANING ---
    const cleanPage = () => {
        chrome.storage.local.get(['autoBypass'], (result) => {
            if (result.autoBypass === false) return;

            // 1. Re-enable scrolling
            document.documentElement.style.setProperty('overflow', 'auto', 'important');
            document.body.style.setProperty('overflow', 'auto', 'important');
            document.body.style.position = 'static';

            // 2. Identify common login wall patterns
            const overlays = document.querySelectorAll('*');
            overlays.forEach(el => {
                try {
                    const style = window.getComputedStyle(el);
                    
                    if ((style.position === 'fixed' || style.position === 'absolute') && 
                        parseInt(style.zIndex) > 100) {
                        
                        const rect = el.getBoundingClientRect();
                        if (rect.width > window.innerWidth * 0.5 && rect.height > window.innerHeight * 0.5) {
                            el.style.display = 'none';
                        }
                    }

                    if (el.className && typeof el.className === 'string') {
                        const cls = el.className.toLowerCase();
                        if (cls.includes('signup-wall') || cls.includes('paywall') || cls.includes('LoginModal')) {
                            el.style.display = 'none';
                        }
                    }
                } catch (e) {}
            });
        });
    };

    cleanPage();
    const observer = new MutationObserver(cleanPage);
    observer.observe(document.body, { childList: true, subtree: true });

    // --- MESSAGE LISTENER ---
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === "enableZapMode") {
            enableZapMode();
        } else if (request.action === "autoFill") {
            autoFillFields();
        } else if (request.action === "bypassVerify") {
            bypassVerification();
        }
        sendResponse({status: "received"});
    });

    // --- ZAP MODE ---
    const enableZapMode = () => {
        zapMode = true;
        document.body.style.cursor = 'crosshair';
        
        let style = document.getElementById('zap-style');
        if (!style) {
            style = document.createElement('style');
            style.id = 'zap-style';
            style.innerHTML = `
                .zap-highlight {
                    outline: 3px solid #8b5cf6 !important;
                    outline-offset: -3px !important;
                    background-color: rgba(139, 92, 246, 0.2) !important;
                    transition: all 0.1s ease !important;
                    cursor: crosshair !important;
                }
            `;
            document.head.appendChild(style);
        }

        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);
        document.addEventListener('click', handleClick, true);
    };

    const handleMouseOver = (e) => {
        if (!zapMode) return;
        e.target.classList.add('zap-highlight');
    };

    const handleMouseOut = (e) => {
        if (!zapMode) return;
        e.target.classList.remove('zap-highlight');
    };

    const handleClick = (e) => {
        if (!zapMode) return;
        e.preventDefault();
        e.stopPropagation();
        
        e.target.classList.remove('zap-highlight');
        e.target.remove(); // ZAP IT!
        
        disableZapMode();
    };

    const disableZapMode = () => {
        zapMode = false;
        document.body.style.cursor = '';
        document.getElementById('zap-style')?.remove();
        document.removeEventListener('mouseover', handleMouseOver);
        document.removeEventListener('mouseout', handleMouseOut);
        document.removeEventListener('click', handleClick, true);
    };

    // --- REACT/VUE NATIVE BYPASS ---
    const setNativeValue = (element, value) => {
        try {
            const lastValue = element.value;
            element.value = value;
            const event = new Event('input', { bubbles: true });
            event.simulated = true;
            const tracker = element._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue);
            }
            element.dispatchEvent(event);
            element.dispatchEvent(new Event('change', { bubbles: true }));
        } catch(e) {
            console.error('Bypass Pro: Native setting failed', e);
        }
    };

    // --- AUTO-FILL IDENTITY ---
    const autoFillFields = () => {
        const randomString = Math.random().toString(36).substring(2, 8);
        const randEmail = `dev_${randomString}@yopmail.com`; 
        const randPass = `Pass!${randomString}123`;
        const randName = `Dev Name ${randomString}`;
        
        const inputs = document.querySelectorAll('input:not([type="hidden"]):not([disabled])');
        let filledCount = 0;

        inputs.forEach(input => {
            const type = (input.type || '').toLowerCase();
            const name = (input.name || '').toLowerCase();
            const id = (input.id || '').toLowerCase();
            const placeholder = (input.placeholder || '').toLowerCase();
            
            const isEmail = type === 'email' || name.includes('email') || id.includes('email') || placeholder.includes('email');
            const isPass = type === 'password' || name.includes('pass') || id.includes('pass') || placeholder.includes('pass');
            const isName = type === 'text' && (name.includes('name') || id.includes('name') || name.includes('first') || id.includes('first') || placeholder.includes('name'));
            
            if (isEmail) {
                setNativeValue(input, randEmail);
                filledCount++;
            } else if (isPass) {
                setNativeValue(input, randPass);
                filledCount++;
            } else if (isName) {
                setNativeValue(input, randName);
                filledCount++;
            }
        });
        
        if (filledCount === 0) {
            alert("Bypass Pro: Couldn't find any email/password fields visually. Check if they are in an iframe.");
        }
    };

    // --- BYPASS VERIFICATION HELPERS ---
    const bypassVerification = () => {
        let removed = 0;

        // 1. HARDCORE LOCAL STORAGE FAKING
        // Many apps just use a local boolean to check if verified
        const commonFlags = ['isVerified', 'verified', 'emailVerified', 'status'];
        try {
            commonFlags.forEach(flag => {
                localStorage.setItem(flag, 'true');
                sessionStorage.setItem(flag, 'true');
            });
            localStorage.setItem('userStatus', 'active');
            localStorage.setItem('role', 'admin');
        } catch(e) {}

        // 2. DEDICATED PAGE REDIRECT & API HIJACKING
        const path = window.location.pathname.toLowerCase();
        const searchParams = new URLSearchParams(window.location.search);
        
        // Specific intercept for the BlizFlow style (or similar) verify-email page
        if (path.includes('verify') || path.includes('otp')) {
            alert("Bypass Pro: Detected a dedicated verification page. Attempting advanced force-routing...");
            
            const email = searchParams.get('email');
            const userId = searchParams.get('userId');

            // If we have these parameters, let's try to pass them directly to a presumed dashboard
            if (email || userId) {
                let dashboardUrl = new URL('/dashboard', window.location.origin);
                if (email) dashboardUrl.searchParams.set('email', email);
                if (userId) dashboardUrl.searchParams.set('userId', userId);
                dashboardUrl.searchParams.set('verified', 'true');
                
                window.location.href = dashboardUrl.toString();
                return;
            }

            // Fallback: just try common dashboard paths
            window.location.href = window.location.origin + '/dashboard';
            return;
        }

        // 3. OVERLAY REMOVAL (For Popups)
        const suspiciousTerms = ['verify', 'otp', 'code', 'auth', 'step2', 'verification'];
        const elements = document.querySelectorAll('div, form, dialog, section, aside');
        
        elements.forEach(el => {
            const cls = (el.className || '').toString().toLowerCase();
            const id = (el.id || '').toLowerCase();
            
            const isSuspicious = suspiciousTerms.some(term => cls.includes(term) || id.includes(term));
            
            if (isSuspicious) {
                try {
                    const style = window.getComputedStyle(el);
                    // Let's aggressively destroy popups
                    if (style.position === 'absolute' || style.position === 'fixed' || parseInt(style.zIndex) > 10) {
                        el.remove(); 
                        removed++;
                    }
                } catch(e) {}
            }
            
            // Delete typical backdrop overlays blindly!
            if (cls.includes('backdrop') || cls.includes('overlay') || id.includes('backdrop') || id.includes('overlay')) {
                el.remove();
                removed++;
            }
        });
        
        document.documentElement.style.setProperty('overflow', 'auto', 'important');
        document.body.style.setProperty('overflow', 'auto', 'important');
        
        if (removed === 0) {
           alert("Bypass Pro: Tried faking verification flags. If you are stuck on a popup, use 'Enter Zap Mode' on it manually.");
        }
    };

})();
