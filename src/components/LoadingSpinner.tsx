import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = "Processing..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      <p className="text-gray-600 font-medium">{message}</p>
      <p className="text-sm text-gray-500 text-center max-w-md">
        Your audio is being processed. This may take a few moments depending on the file size.
      </p>
    </div>
  );
};