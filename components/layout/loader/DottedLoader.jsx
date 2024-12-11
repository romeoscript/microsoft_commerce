import React from 'react';

const DottedLoader = () => (
  <div className="flex space-x-2">
    <div className="w-2 h-2 bg-[#fff] rounded-full animate-bounce"></div>
    <div className="w-2 h-2 bg-[#fff] rounded-full animate-bounce delay-200"></div>
    <div className="w-2 h-2 bg-[#fff] rounded-full animate-bounce delay-400"></div>
  </div>
);

export default DottedLoader;
