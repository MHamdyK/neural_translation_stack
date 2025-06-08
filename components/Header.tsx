
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-slate-800 shadow-md p-4 text-center">
      <h1 className="text-2xl sm:text-3xl font-bold text-sky-400">
        Neural Translation Stack
      </h1>
      <p className="text-sm text-slate-400 mt-1">Arabic to English Speech-to-Speech Translation</p>
    </header>
  );
};
