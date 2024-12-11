"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [isAntivirusOpen, setIsAntivirusOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const totalQuantities = useSelector(state => state.cart.totalQuantities);

  const antivirusItems = [
    "Kaspersky",
    "Norton",
    "McAfee",
    "Bitdefender",
    "AVG"
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className={`bg-white w-full ${isScrolled ? 'fixed top-0 left-0 shadow-md z-50' : ''}`}>
      {/* Top bar - Hidden on mobile */}
      <div className="hidden sm:block bg-[#f8f8f8] py-2 px-4 text-sm">
        <div className="container mx-auto flex flex-wrap justify-end space-x-4">
          <Link href="/save-more" className="hover:text-orange-500">SAVE MORE ON APP</Link>
          <Link href="/seller" className="hover:text-orange-500">BECOME A SELLER</Link>
          <Link href="/support" className="hover:text-orange-500">HELP & SUPPORT</Link>
          <Link href="/login" className="hover:text-orange-500">LOGIN</Link>
          <Link href="/signup" className="hover:text-orange-500">SIGN UP</Link>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <FiX className="text-2xl" />
            ) : (
              <FiMenu className="text-2xl" />
            )}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-[#172b4d]">E-Software Shop</span>
          </Link>

          {/* Search bar - Hidden on mobile */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search in E-Software Shop"
                className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2">
                <FiSearch className="text-gray-400 text-xl" />
              </button>
            </div>
          </div>

          {/* Cart */}
          <Link href="/cart" className="relative">
            <FiShoppingCart className="text-2xl" />
            {totalQuantities > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {totalQuantities}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Search - Visible only on mobile */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <input 
              type="text"
              placeholder="Search in E-Software Shop"
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2">
              <FiSearch className="text-gray-400 text-xl" />
            </button>
          </div>
        </div>

        {/* Categories - Desktop */}
        <div className="hidden md:flex items-center space-x-8 mt-4 text-sm">
          <Link href="/" className="text-gray-700 hover:text-orange-500">
            HOME
          </Link>
          <div 
            className="relative group"
            onMouseEnter={() => setIsAntivirusOpen(true)}
            onMouseLeave={() => setIsAntivirusOpen(false)}
          >
            <button className="text-gray-700 hover:text-orange-500 flex items-center">
              ANTIVIRUS
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isAntivirusOpen && (
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                {antivirusItems.map((item, index) => (
                  <Link
                    key={index}
                    href={`/antivirus/${item.toLowerCase()}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {item}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Link href="/windows" className="text-gray-700 hover:text-orange-500">
            WINDOWS
          </Link>
          <Link href="/office" className="text-gray-700 hover:text-orange-500">
            OFFICE
          </Link>
          <Link href="/server" className="text-gray-700 hover:text-orange-500">
            SERVER
          </Link>
          <Link href="/other-software" className="text-gray-700 hover:text-orange-500">
            OTHER SOFTWARE
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="py-2 px-4 space-y-4">
            <Link href="/" className="block text-gray-700 hover:text-orange-500">
              HOME
            </Link>
            <div className="space-y-2">
              <button 
                className="flex items-center justify-between w-full text-gray-700 hover:text-orange-500"
                onClick={() => setIsAntivirusOpen(!isAntivirusOpen)}
              >
                ANTIVIRUS
                <svg className={`w-4 h-4 transform ${isAntivirusOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isAntivirusOpen && (
                <div className="pl-4 space-y-2">
                  {antivirusItems.map((item, index) => (
                    <Link
                      key={index}
                      href={`/antivirus/${item.toLowerCase()}`}
                      className="block text-sm text-gray-600 hover:text-orange-500"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/windows" className="block text-gray-700 hover:text-orange-500">
              WINDOWS
            </Link>
            <Link href="/office" className="block text-gray-700 hover:text-orange-500">
              OFFICE
            </Link>
            <Link href="/server" className="block text-gray-700 hover:text-orange-500">
              SERVER
            </Link>
            <Link href="/other-software" className="block text-gray-700 hover:text-orange-500">
              OTHER SOFTWARE
            </Link>
            
            {/* Mobile-only links */}
            <div className="pt-4 border-t border-gray-200">
              <Link href="/save-more" className="block text-gray-700 hover:text-orange-500">
                SAVE MORE ON APP
              </Link>
              <Link href="/seller" className="block text-gray-700 hover:text-orange-500 mt-4">
                BECOME A SELLER
              </Link>
              <Link href="/support" className="block text-gray-700 hover:text-orange-500 mt-4">
                HELP & SUPPORT
              </Link>
              <Link href="/login" className="block text-gray-700 hover:text-orange-500 mt-4">
                LOGIN
              </Link>
              <Link href="/signup" className="block text-gray-700 hover:text-orange-500 mt-4">
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;