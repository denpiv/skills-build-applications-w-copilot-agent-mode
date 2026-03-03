export const getApiBaseUrl = () => {
  if (process.env.REACT_APP_CODESPACE_NAME) {
    return `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev/api`;
  }

  if (typeof window !== 'undefined') {
    const { hostname } = window.location;

    if (hostname.includes('-3000.app.github.dev')) {
      return `https://${hostname.replace('-3000.app.github.dev', '-8000.app.github.dev')}/api`;
    }

    if (hostname.endsWith('.app.github.dev')) {
      return `https://${hostname}/api`;
    }
  }

  return 'http://localhost:8000/api';
};
