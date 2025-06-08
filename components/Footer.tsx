
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-slate-800 p-4 text-center text-sm text-slate-400">
      &copy; {new Date().getFullYear()} Neural Translation Stack. All rights reserved.
    </footer>
  );
};
