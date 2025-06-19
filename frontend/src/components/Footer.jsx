import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 shadow-sm w-full mt-auto">
      <div className="w-full max-w-screen-xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-1 rtl:space-x-reverse ml-4">
            <img
              src="https://raw.githubusercontent.com/DeterminedSage/images/refs/heads/main/ultimate_final.png"
              className="h-8"
              alt="Leaf Coders Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Leaf Coders
            </span>
          </a>
          <span className="text-sm text-gray-400 text-center sm:text-right">
            Made with <span className="text-red-500">❤️</span> by{' '}
            DeterminedSage |{' '}
            <a
              href="https://github.com/DeterminedSage"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-white ml-1"
            >
              Github
            </a>{' '}
            |{' '}
            <a
              href="https://www.linkedin.com/in/akshatsharma-nsut/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-white ml-1"
            >
              LinkedIn
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;



