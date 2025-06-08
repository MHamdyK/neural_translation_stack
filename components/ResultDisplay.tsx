
import React from 'react';
import type { ApiResponseData } from '../types';
import { ResultCard } from './ResultCard';

interface ResultDisplayProps {
  data: ApiResponseData;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ data }) => {
  const audioSrc = `data:audio/wav;base64,${data.audio_data.base64}`;

  return (
    <div className="w-full max-w-2xl space-y-6 mt-8">
      <h2 className="text-2xl font-semibold text-sky-400 mb-4 text-center">Translation Results</h2>
      <ResultCard title="Arabic Transcript">
        <p className="text-slate-200 whitespace-pre-wrap text-lg leading-relaxed">{data.arabic_transcript}</p>
      </ResultCard>
      <ResultCard title="English Translation">
        <p className="text-slate-200 whitespace-pre-wrap text-lg leading-relaxed">{data.english_translation}</p>
      </ResultCard>
      <ResultCard title="Synthesized English Speech">
        <audio controls src={audioSrc} className="w-full rounded-md">
          Your browser does not support the audio element.
        </audio>
      </ResultCard>
    </div>
  );
};
