import React from 'react';

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0  ">
          {/* <div className={`fixed inset-0 z-50 ${isOpen ? "block" : "hidden"}`}> */}
          <div className="fixed inset-0 bg-black opacity-20"></div>
      <div className="flex justify-center items-center  min-h-screen">
        <div className="w-16 h-16 border-t-4 border-b-4 border-accent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
