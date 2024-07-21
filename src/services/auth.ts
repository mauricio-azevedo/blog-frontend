export const isAuthenticated = (): boolean => {
  console.log(document.cookie);
  return document.cookie.includes('_session_id');
};
