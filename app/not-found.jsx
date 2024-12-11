import Image from 'next/image'
import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='flex bg-gray-100 h-screen flex-col items-center justify-center'>
        <div className="text-center ">
        <iframe src="https://lottie.host/embed/85eed89b-b6e1-4642-988f-a1f44b135b2d/2cvGLkHANF.json" width={500} height={400} allowFullScreen ></iframe>      
        <h2 className='text-2xl font-bold'>Not Found</h2>
      <p>Could not find requested page</p>
      <Link href="/" className='bg-green-500 inline-block p-4 mt-10 rounded text-white'>Return Home</Link>
        </div>
    </div>
  )
}