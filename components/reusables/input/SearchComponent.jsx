import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchComponent({placeholder, ...props}) {
  return (
    <span 
      className='relative w-full border flex items-center border-accent/30  text-accent/50 rounded-full hocus:(border-gray-700)  overflow-hidden'
      {...props}
    >
     <FaSearch className='bg-transparent ml-5 absolute' />

      <input 
        type="search" 
        name='search' 
        id='search' 
        placeholder={placeholder}
        className='w-full outline-0 font-poppins   bg-[#EFBBFF]/30  px-10 py-2  placeholder:(text-gray-400)'
      />
    </span>
  )
}
