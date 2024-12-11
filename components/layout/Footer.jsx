"use client"
import { FiArrowRight, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';
import { FaTiktok } from 'react-icons/fa';
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white text-gray-800 py-10 mt-auto relative">
      <div className="container mx-auto px-4">
        {/* Consolidated Footer Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 border-t p-5">
          <div>
            <h3 className="font-semibold mb-4 text-lg">Support</h3>
            <ul className="space-y-3">
              <Link href="/contact-us">
                <li className="flex items-center hover:underline">
                  Customer Support <FiArrowRight className="ml-2" />
                </li>
              </Link>
              <Link href="/contact-us">
                <li className="flex items-center hover:underline">
                  Locate Us <FiArrowRight className="ml-2" />
                </li>
              </Link>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4 text-lg">Stay Connected</h3>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61557175347951" target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                <FiFacebook size={24} />
              </a>
              <a href="https://x.com/euodiawholefood" target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                <FiTwitter size={24} />
              </a>
              <a href="https://www.instagram.com/euodiawholefoods/" target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                <FiInstagram size={24} />
              </a>
              <a href="https://www.tiktok.com/search?q=euodia%20whole%20food&t=1725082399905" target="_blank" rel="noopener noreferrer" className="bg-gray-200 p-2 rounded-full hover:bg-green-600 hover:text-white transition-colors">
                <FaTiktok size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-600 mt-4 md:mt-0">
            © 2024 All Rights Reserved. Euodia Whole Foods
          </p>
          {/* Optional links for privacy and terms */}
          {/* <div className="mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:underline text-gray-600">Privacy Policy</Link>
            <span className="mx-2">|</span>
            <Link href="/terms-of-use" className="hover:underline text-gray-600">Terms of Use</Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
