"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MdDashboard, MdOutlineLocationOn, MdOutlineShoppingBag, MdPeople } from "react-icons/md";
import { BsFileEarmarkTextFill } from "react-icons/bs";
import { GrTransaction } from "react-icons/gr";
import { TbLogout } from "react-icons/tb";
import { FaRegCaretSquareLeft, FaRegCaretSquareRight } from "react-icons/fa";

import Link from "next/link";
import { removeCookies } from "@/utils/removeCookie";

const sideData = [
  {
    icon: <MdDashboard />,
    title: "Dashboard",
    link: "/admin",
  },
  {
    icon: <MdPeople />,
    title: "Customers",
    link: "/admin/customers",
  },
  {
    icon: <BsFileEarmarkTextFill />,
    title: "Order list",
    link: "/admin/orders",
  },
  {
    icon: <MdOutlineShoppingBag />,
    title: "All Products",
    link: "/admin/products",
  },
  {
    icon: <MdOutlineLocationOn />,
    title: "Miscellaneous",
    link: "/admin/misc",
  },
  {
    icon: <GrTransaction />,
    title: "Transactions",
    link: "/admin/transactions",
  },
];

export default function SideNav({ ...props }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return null;
    }
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // Adjust this breakpoint as per your design
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsExpanded(false);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleLogout = () => {
    removeCookies("admineu_token");
    router.push("/auth/login");
    // window.location.reload()
  };

  return (
    <menu
      {...props}
      className={`flex flex-col h-full   dark:bg-black dark:text-white p-2 mt-6 flex-none transition-all duration-300 ${
        isExpanded ? "w-80 relative" : "w-20 relative"
      }`}
    >
      <nav className="flex-grow flex flex-col relative mt-[5rem] gap-y-8">
        {sideData.map((item, idx) => {
          const isActive = pathname === item.link;
          return (
            <Link key={idx} href={item.link}>
              <div
                className={`relative mt-5 border-b-2 cursor-pointer w-full text-md dark:text-white space-x-1 py-2 flex items-center gap-x-4 transition-all duration-200 ${
                  isActive
                    ? "text-white bg-green-500 rounded-xl p-2 dark:text-white"
                    : "hover:text-green-500 hover:scale-95"
                }`}
              >
                {item.icon}
                {isExpanded && <span>{item.title}</span>}
              </div>
            </Link>
          );
        })}
      <span onClick={toggleSidebar} className=" text-xl    ">
        {isExpanded ? <FaRegCaretSquareRight /> : <FaRegCaretSquareLeft />}
      </span>

      </nav>


      <button onClick={toggleSidebar} className="my-4 bg-green-500 p-2 rounded">
        {isExpanded ? <div  onClick={handleLogout} className="flex items-center text-white gap-4"><TbLogout /> <span>Logout</span> </div>  : <TbLogout />}
      </button>
    </menu>
  );
}
