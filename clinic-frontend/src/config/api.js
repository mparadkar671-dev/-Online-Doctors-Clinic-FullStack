// Centralized API Base URL configuration
// In local development, defaults to http://localhost:8080
// In cloud production (Vercel, Netlify, Render), configure REACT_APP_API_BASE_URL
const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export default BASE_URL;
