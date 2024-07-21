export const isAuthenticated = (): boolean => {
  return document.cookie.includes('_session_id');
};
