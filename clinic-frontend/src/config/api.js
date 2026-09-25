// Centralized API Base URL configuration
// In local development (localhost/127.0.0.1), defaults to http://localhost:8080
// In cloud production (Vercel, Render, Netlify, mobile PWA), defaults to the live Render backend
const isLocal = typeof window !== 'undefined' && 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 
    (isLocal ? 'http://localhost:8080' : 'https://online-doctors-clinic-fullstack.onrender.com');

export default BASE_URL;
