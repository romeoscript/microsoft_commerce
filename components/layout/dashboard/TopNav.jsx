"use client"
import SearchComponent from "@/components/reusables/input/SearchComponent";
import Typography from "@/components/reusables/typography/Typography";
import { removeCookies } from "@/utils/removeCookie";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';


export default function TopNav({ ...props }) {
    const [menuOpen, setMenuOpen] = useState(false);
const router = useRouter()

    const toggleMenu = () => {
      setMenuOpen(!menuOpen);
    };
    
  const handleLogout = () => {
    removeCookies("admineu_token");
    router.push("/auth/login");
  };
  return (
    <div className="p-4  w-full border flex justify-between items-center px-8 border-gray-300" {...props}>
      <Image
        src={"/genova.svg"}
        alt="Boles Admin"
        width={100}
        height={100}
        className=" object-cover"
      />
      <div className="w-[40%]">
      <SearchComponent placeholder="Search" />
      </div>
      <div className="relative">
      <div className="flex gap-2 items-center cursor-pointer" onClick={toggleMenu}>
        <Typography size="sm">John Doe</Typography>
        <Image src="/genova.svg" alt="Boles Admin" width={60} height={50} className="rounded-[50%]" />
        {menuOpen ? <FaChevronUp size={20} /> : <FaChevronDown size={20} />}
      </div>
      {menuOpen && (
        <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 shadow-lg rounded-md w-48">
          <ul className="flex flex-col p-2">
            {/* <li className="hover:bg-gray-100 p-2 rounded-md">Profile</li> */}
            {/* <li className="hover:bg-gray-100 p-2 rounded-md">Settings</li> */}
            <li onClick={handleLogout} className="hover:bg-gray-100 p-2 rounded-md">Logout</li>
          </ul>
        </div>
      )}
    </div>
      {/* <Button title="ello" size="large" color="green" /> */}
    </div>
  );
}
