import { useNavigate } from "react-router-dom";
import useCookies from "./useCookies";
import useCrud from "./useCrud";

export async function CustomLogout() {
  const { postData, response } = useCrud("accounts/logout/");
  const { removeCookie, getCookie } = useCookies();
  const navigate = useNavigate()
  const boles_refresh = getCookie("boles_token_refresh");



  try {
    await postData({ refresh_token: boles_refresh });
    removeCookie("boles_token_refresh");
    removeCookie("boles_token");
    if(response.data){
        navigate('/'); // Redirect to home page after logout
    }
    // localStorage.removeItem('boles_token');
    // window.location.href = '/login'; // Redirect to login page after logout
  } catch (error) {
    console.error("Error logging out:", error);
    // Show an error message to the user, for example:
    // showToast("Error logging out. Please try again later.", "error", "top-right");
  }

  return null; // Return null to avoid rendering any extra DOM elements
}
