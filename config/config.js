import { removeCookies } from '@/utils/removeCookie';
import { isAdminRoute } from '@/utils/isAdminRoute';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function init() {
  if (typeof window !== 'undefined') {
    // This code will only run in the browser

    const getCookieValue = (name) => {
      const cookie = document.cookie
        .split("; ")
        .find((row) => row.startsWith(name));
      return cookie ? cookie.split("=")[1] : null;
    };

    const accessToken = getCookieValue("euodia_token");
    const adminToken = getCookieValue("admineu_token");

    axios.defaults.baseURL = API_URL;
    axios.defaults.withCredentials = false;

    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    }

    axios.interceptors.request.use((config) => {
      // Check if the route is an admin route
      if (isAdminRoute(config.url) && adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      } else if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    });

    axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response.status === 401) {
          removeCookies(["euodia_token", "admineu_token"]);
          window.location.href = '/'; // Redirect to the home page
        }
        return Promise.reject(error);
      }
    );
  }
}
