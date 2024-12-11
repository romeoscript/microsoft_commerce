import useCookies from "./useCookies";
import { useRouter } from "next/navigation";

const performLogout = async (router, removeCookie) => {

  try {
    // await postData({ refresh_token: boles_refresh });
    removeCookie("gen_token");
    router.push('/');
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const useCustomLogout = () => {
  const { removeCookie, getCookie } = useCookies();
  const router = useRouter();

  const customLogout = async () => {
    await performLogout(router, removeCookie, getCookie);
  };

  return customLogout;
};

export { performLogout };
export default useCustomLogout;
