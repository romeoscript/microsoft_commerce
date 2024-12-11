import React from 'react';
import logo from "/logo.svg"
import Image from 'next/image';

export default function Loader() {
  return (
    <div className='w-full h-screen fixed top-0 left-0 z-[99999] bg-white-900 flex items-center justify-center'>
      <Image src={logo} alt="Boles Admin" width={300} height={300} tw='transition-all animate-ping' />
    </div>
  )
}
