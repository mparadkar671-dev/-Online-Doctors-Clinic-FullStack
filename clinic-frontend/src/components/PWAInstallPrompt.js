import React, { useState, useEffect } from 'react';

const PWAInstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showBanner, setShowBanner] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect if already installed or standalone mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
        if (isStandalone) {
            setShowBanner(false);
            return;
        }

        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Capture Android/Chrome install event
        const handleBeforeInstall = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        // Show iOS banner once if not dismissed
        if (isIosDevice && !localStorage.getItem('pwa_banner_dismissed')) {
            setShowBanner(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowBanner(false);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowBanner(false);
        localStorage.setItem('pwa_banner_dismissed', 'true');
    };

    if (!showBanner) return null;

    return (
        <aside className="pwa-install-banner" aria-label="Mobile App Installation">
            <div className="d-flex align-items-center justify-content-between p-3 gap-3">
                <div className="d-flex align-items-center gap-3">
                    <div className="pwa-app-icon rounded-3 p-2 bg-primary text-white d-flex align-items-center justify-content-center shadow-sm" style={{ width: '42px', height: '42px' }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <rect x="5" y="2" width="14" height="20" rx="3" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                    </div>
                    <div>
                        <div className="fw-bold text-dark small" style={{ fontSize: '0.9rem' }}>MediPulse Clinic Pro</div>
                        <div className="text-muted small" style={{ fontSize: '0.78rem' }}>
                            {isIOS 
                                ? "Tap Share ⎙ and select 'Add to Home Screen' to install" 
                                : "Install app on your phone for fast, offline access"}
                        </div>
                    </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                    {!isIOS && deferredPrompt && (
                        <button 
                            type="button" 
                            className="btn btn-sm btn-primary fw-semibold px-3 py-1 shadow-sm"
                            onClick={handleInstallClick}
                            style={{ borderRadius: '8px' }}
                        >
                            Install
                        </button>
                    )}
                    <button 
                        type="button" 
                        className="btn btn-sm btn-link text-muted p-1 text-decoration-none"
                        onClick={handleDismiss}
                        aria-label="Dismiss banner"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default PWAInstallPrompt;
