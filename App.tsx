
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AudioInputArea } from './components/AudioInputArea';
import { ResultDisplay } from './components/ResultDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { translateSpeech } from './services/apiService';
import type { ApiResponseData } from './types';
import { API_URL } from './constants'; // Not strictly needed here, but good practice if App needed it

const App: React.FC = () => {
  const [selectedAudioFile, setSelectedAudioFile] = useState<File | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponseData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAudioReady = useCallback((file: File) => {
    setSelectedAudioFile(file);
    setApiResponse(null); // Clear previous results
    setError(null); // Clear previous errors
  }, []);

  const handleClearAudio = useCallback(() => {
    setSelectedAudioFile(null);
    setApiResponse(null);
    setError(null);
  }, []);

  const handleSubmit = async () => {
    if (!selectedAudioFile) {
      setError("Please select or record an audio file first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const responseData = await translateSpeech(selectedAudioFile);
      setApiResponse(responseData);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred during translation.");
      } else {
        setError("An unknown error occurred during translation.");
      }
      console.error("Translation API error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 space-y-8">
        <div className="w-full max-w-2xl space-y-6">
          <AudioInputArea
            onAudioReady={handleAudioReady}
            clearAudio={handleClearAudio}
            currentAudioFile={selectedAudioFile}
            isLoading={isLoading}
          />

          {selectedAudioFile && !isLoading && (
            <button
              onClick={handleSubmit}
              disabled={isLoading || !selectedAudioFile}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              Translate Audio
            </button>
          )}
        </div>

        {isLoading && <LoadingSpinner />}
        {error && !isLoading && <ErrorMessage message={error} />}
        {apiResponse && !isLoading && <ResultDisplay data={apiResponse} />}
      </main>
      <Footer />
    </div>
  );
};

export default App;
