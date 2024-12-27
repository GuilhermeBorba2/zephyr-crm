import { useToastStore } from '../../stores/toastStore';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const googleApi = {
  async loadGoogleApi() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client:auth2', () => {
          window.gapi.client.init({
            apiKey: GOOGLE_API_KEY,
            clientId: GOOGLE_CLIENT_ID,
            scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/contacts.readonly'
          }).then(resolve).catch(reject);
        });
      };
      script.onerror = reject;
      document.body.appendChild(script);
    });
  },

  async ensureApiLoaded() {
    if (!window.gapi?.auth2) {
      await this.loadGoogleApi();
    }
    return window.gapi;
  }
};