export const getCookie = (name) => {
    if(typeof document !=="undefined"){

        const cookie = document.cookie
          .split("; ")
          .find((row) => row.startsWith(name));
        return cookie ? cookie.split("=")[1] : null;
    }
  };