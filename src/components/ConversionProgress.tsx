import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConversionProgressProps {
  progress: number;
  total: number;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({ progress, total }) => {
  const percentage = Math.round((progress / total) * 100);

  return (
    <div className="w-full max-w-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-700">Converting pages...</span>
        <span className="text-sm font-medium text-blue-700">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="flex items-center justify-center mt-4">
        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
        <span className="ml-2 text-sm text-gray-600">
          Processing page {progress} of {total}
        </span>
      </div>
    </div>
  );
};