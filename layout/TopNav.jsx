'use client'
import PropTypes from "prop-types";
import Typography from "@/components/reusables/typography/Typography";
import { IoNotifications } from "react-icons/io5";
import { FiUser, FiLogOut } from "react-icons/fi";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { removeCookies } from "@/utils/removeCookie";

const NotificationIcon = ({ notifications }) => {
  return (
    <div className="relative">
      <IoNotifications className="text-xl me-10" />
      {notifications > 0 && (
        <span className="absolute top-0 right-2 inline-flex items-center justify-center w-4 h-4 text-xs font-bold leading-none bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2 text-white">
          {notifications}
        </span>
      )}
    </div>
  );
};

NotificationIcon.propTypes = {
  notifications: PropTypes.number.isRequired,
};

export default function TopNav({ title, openSideBar, ...props }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // const notifications = 4;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

 
  const handleLogout = () => {
    removeCookies("admineu_token");
    router.push("/auth/login");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }


    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  
  return (
    <menu className="flex bg-white dark:text-white dark:bg-black items-center justify-between px-4 py-6 md:px-12" {...props}>
      <div className="flex items-center gap-2">
        <Image src="/logo.svg" width={60} height={60} alt="logo" />
        <Typography variant="h1" size="md" className="text-green-500 font-bold">
          Euodia WholeFoods
        </Typography>
      </div>
      <aside className="hidden md:flex items-center gap-10 relative">
        {/* <NotificationIcon notifications={notifications} /> */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={toggleDropdown} className="flex items-center gap-2">
            <FiUser className="text-xl" />
            {/* Remove Admin text if not necessary */}
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-md rounded-md py-2 z-10">
              <button onClick={handleLogout} className="flex items-center w-full px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                <FiLogOut className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>
    </menu>
  );
}

TopNav.propTypes = {
  title: PropTypes.string.isRequired,
  openSideBar: PropTypes.func.isRequired,
};
