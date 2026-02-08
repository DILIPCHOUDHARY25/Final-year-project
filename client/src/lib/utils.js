export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const AI_BASE_URL = import.meta.env.VITE_AI_BASE_URL || 'http://localhost:8000';

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};
