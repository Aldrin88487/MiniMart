import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm text-gray-500">
          &copy; {new Date().getFullYear()} MiniMart E-Commerce. All rights reserved.
        </p>
        <p className="text-xs text-gray-400 mt-1 font-mono">
          By: Aldrin, Akshay & Akshaya
        </p>
      </div>
    </footer>
  );
};

export default Footer;
