
import React from 'react';

interface ResultCardProps {
  title: string;
  children: React.ReactNode;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, children }) => {
  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-6 ring-1 ring-slate-700">
      <h3 className="text-lg font-semibold text-sky-500 mb-3 border-b border-slate-700 pb-2">{title}</h3>
      <div className="mt-2">{children}</div>
    </div>
  );
};
