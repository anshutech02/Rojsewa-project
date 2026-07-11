import React from 'react';

const Footer = () => {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center gap-4 text-zinc-500 text-sm">
        <div>
          <span className="font-bold tracking-tight text-zinc-300">ROJSEWA — Hyperlocal Service Marketplace.</span>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-white">
          &copy; {new Date().getFullYear()} ROJSEWA. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
