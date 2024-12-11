"use client"
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slides = [
    {
      id: 1,
      title: "Professional Software Solutions",
      subtitle: "Premium Licenses | Enterprise Support",
      image: "https://media.istockphoto.com/id/1401460590/photo/businessman-working-on-laptop-with-document-management-icon.jpg?s=612x612&w=0&k=20&c=o8Ci6F_YCWFlKE2Yr6A2wbDvrZRwSB3YssLakLkrFBo=",
      buttonText: "Explore Products",
      gradientFrom: "from-blue-900",
      gradientTo: "to-blue-700"
    },
    {
      id: 2,
      title: "Special Enterprise Deals",
      subtitle: "Volume Licensing | Priority Support",
      image: "https://www.shutterstock.com/image-photo/artificial-intelligence-content-generator-man-600nw-2471042165.jpg",
      buttonText: "View Enterprise Plans",
      gradientFrom: "from-purple-900",
      gradientTo: "to-purple-700"
    },
    {
      id: 3,
      title: "Latest Software Releases",
      subtitle: "Stay Updated | Enhanced Security",
      image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N",
      buttonText: "Discover More",
      gradientFrom: "from-indigo-900",
      gradientTo: "to-indigo-700"
    }
  ];

  useEffect(() => {
    let interval;
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 6000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length]);

  const handleSlideChange = (direction) => {
    setIsAutoPlaying(false);
    if (direction === 'next') {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    } else {
      setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    }
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-gray-900">
      {/* Main Slider */}
      <AnimatePresence initial={false} custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 }
          }}
          className="absolute w-full h-full"
        >
          <div className="relative w-full h-full">
            <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradientFrom} ${slides[currentSlide].gradientTo} opacity-80`} />
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24">
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="max-w-4xl"
              >
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                  {slides[currentSlide].title}
                </h2>
                <p className="text-lg md:text-xl text-white/90 mb-8">
                  {slides[currentSlide].subtitle}
                </p>
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                  {slides[currentSlide].buttonText}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={() => handleSlideChange('prev')}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-300"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
        <button
          onClick={() => handleSlideChange('next')}
          className="p-2 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
};

export default Hero;