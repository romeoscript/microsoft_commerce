"use client";

import { useState, useEffect, useCallback } from "react";

const useCookies = () => {
  const [cookies, setCookiesState] = useState({});

  const getAllCookies = useCallback(() => {
    const cookies = {};
    document.cookie?.split(";").forEach((cookie) => {
      const [name, value] = cookie.split("=").map((c) => c.trim());
      cookies[name] = value;
    });
    return cookies;
  }, []);
  const setCookie = useCallback((name, value, options = {}) => {
    const { days = 7, path = "/" } = options;
    let expires = "";

    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = `; expires=${date.toUTCString()}`;
    }
    if (typeof window !== "undefined") {
      document.cookie = `${name}=${value || ""}${expires}; path=${path}`;
    }
    setCookiesState(getAllCookies());
  }, [getAllCookies]);

  const getCookie = useCallback((name) => {
    const nameEQ = `${name}=`;
    if (typeof window !== "undefined") {
      const ca = document.cookie.split(";");
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
          return c.substring(nameEQ.length, c.length);
      }
    }
    return null;
  }, []);

  const removeCookie = useCallback((name, path = "/") => {
    document.cookie = `${name}=; Max-Age=-99999999; path=${path}`;
    setCookiesState(getAllCookies());
  }, [getAllCookies]);



  useEffect(() => {
    setCookiesState(getAllCookies());
  }, [getAllCookies]);

  return {
    cookies,
    setCookie,
    getCookie,
    removeCookie,
  };
};

export default useCookies;
