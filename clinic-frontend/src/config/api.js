// Centralized API Base URL configuration
// Live Render backend URL for this clinic system:
const LIVE_RENDER_BACKEND = 'https://online-doctors-clinic-fullstack.onrender.com';

const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

// Filter out stale or typo environment variables that might be stored in Vercel settings
const rawEnvUrl = process.env.REACT_APP_API_BASE_URL ? process.env.REACT_APP_API_BASE_URL.trim() : '';
const isValidEnv = rawEnvUrl && 
    !rawEnvUrl.includes('medipulse-api') && 
    !rawEnvUrl.includes('localhost:8080') &&
    rawEnvUrl.startsWith('http');

const BASE_URL = isLocal 
    ? 'http://localhost:8080' 
    : (isValidEnv ? rawEnvUrl : LIVE_RENDER_BACKEND);

export default BASE_URL;
