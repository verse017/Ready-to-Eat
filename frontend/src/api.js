// Automatically uses relative URL in production (for Nginx reverse proxy) and localhost in development
const API_BASE = process.env.NODE_ENV === 'production'
  ? '/api/restaurants'
  : 'http://localhost:5000/api/restaurants';

export default API_BASE;
