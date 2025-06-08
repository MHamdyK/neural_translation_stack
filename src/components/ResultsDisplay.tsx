import React from 'react';
import { FileText, Volume2, Languages } from 'lucide-react';

interface ResultsDisplayProps {
  arabicTranscript: string;
  englishTranslation: string;
  audioBase64: string;
  sampleRate: number;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  arabicTranscript,
  englishTranslation,
  audioBase64,
  sampleRate
}) => {
  const audioSrc = `data:audio/wav;base64,${audioBase64}`;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Translation Results</h2>
      
      {/* Arabic Transcript */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-800">Arabic Transcript</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-800 text-right leading-relaxed" dir="rtl" lang="ar">
            {arabicTranscript}
          </p>
        </div>
      </div>

      {/* English Translation */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Languages className="w-5 h-5 text-emerald-500" />
          <h3 className="text-lg font-semibold text-gray-800">English Translation</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-800 leading-relaxed">
            {englishTranslation}
          </p>
        </div>
      </div>

      {/* Synthesized Audio */}
      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <Volume2 className="w-5 h-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-800">Synthesized English Speech</h3>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <audio 
            controls 
            className="w-full"
            preload="metadata"
          >
            <source src={audioSrc} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <p className="text-xs text-gray-500 mt-2">
            Sample Rate: {sampleRate} Hz
          </p>
        </div>
      </div>
    </div>
  );
};