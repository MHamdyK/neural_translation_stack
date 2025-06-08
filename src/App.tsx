import React, { useState } from 'react';
import { AudioUpload } from './components/AudioUpload';
import { AudioRecorder } from './components/AudioRecorder';
import { ResultsDisplay } from './components/ResultsDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorDisplay } from './components/ErrorDisplay';
import { Brain, Zap } from 'lucide-react';

interface TranslationResult {
  arabicTranscript: string;
  englishTranslation: string;
  audioData: {
    sampleRate: number;
    base64: string;
  };
}

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TranslationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'record'>('upload');

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setResults(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      // Validate file type
      if (!selectedFile.type.startsWith('audio/')) {
        throw new Error('Please select a valid audio file (.wav, .mp3, .ogg, etc.)');
      }

      // Validate file size (limit to 50MB)
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (selectedFile.size > maxSize) {
        throw new Error('File size too large. Please select a file smaller than 50MB.');
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      console.log('Sending request to API with file:', selectedFile.name, selectedFile.type, selectedFile.size);

      const response = await fetch('https://mohamdyy-speech-translator.hf.space/process-speech/', {
        method: 'POST',
        body: formData,
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        let errorMessage = `Server responded with status ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `: ${errorText}`;
          }
        } catch (e) {
          // If we can't read the error text, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      // Validate the response structure
      if (!data.arabic_transcript || !data.english_translation || !data.audio_data) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from server. Please try again.');
      }

      // Validate audio data
      if (!data.audio_data.base64 || !data.audio_data.sample_rate) {
        console.error('Invalid audio data:', data.audio_data);
        throw new Error('Invalid audio data received from server.');
      }
      
      setResults({
        arabicTranscript: data.arabic_transcript,
        englishTranslation: data.english_translation,
        audioData: data.audio_data,
      });
    } catch (err) {
      console.error('Translation error:', err);
      setError(
        err instanceof Error 
          ? err.message 
          : 'An unexpected error occurred while processing your audio. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResults(null);
    setError(null);
    setIsLoading(false);
  };

  const canSubmit = selectedFile && !isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Brain className="w-8 h-8 text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">Neural Translation Stack</h1>
            <Zap className="w-8 h-8 text-emerald-600" />
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced speech-to-speech translation from Arabic to English using cutting-edge AI technology
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {!results && !isLoading && (
            <>
              {/* Tab Navigation */}
              <div className="border-b border-gray-200">
                <nav className="flex">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                      activeTab === 'upload'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload Audio File
                  </button>
                  <button
                    onClick={() => setActiveTab('record')}
                    className={`flex-1 py-4 px-6 text-center font-medium transition-colors duration-200 ${
                      activeTab === 'record'
                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Record Audio
                  </button>
                </nav>
              </div>

              {/* Content */}
              <div className="p-8">
                {activeTab === 'upload' ? (
                  <AudioUpload
                    onFileSelect={handleFileSelect}
                    disabled={isLoading}
                    selectedFile={selectedFile}
                  />
                ) : (
                  <AudioRecorder
                    onRecordingComplete={handleFileSelect}
                    disabled={isLoading}
                  />
                )}

                {/* Submit Button */}
                {selectedFile && (
                  <div className="mt-8 text-center space-y-4">
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Translate Audio
                    </button>
                    <div>
                      <button
                        onClick={handleReset}
                        className="text-sm text-gray-500 hover:text-gray-700 underline"
                      >
                        Start Over
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="p-8">
              <LoadingSpinner message="Translating your audio..." />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-8">
              <ErrorDisplay message={error} onRetry={handleReset} />
            </div>
          )}

          {/* Results */}
          {results && (
            <div className="p-8">
              <ResultsDisplay
                arabicTranscript={results.arabicTranscript}
                englishTranslation={results.englishTranslation}
                audioBase64={results.audioData.base64}
                sampleRate={results.audioData.sampleRate}
              />
              <div className="mt-8 text-center">
                <button
                  onClick={handleReset}
                  className="inline-flex items-center px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Translate Another Audio
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by advanced neural networks for accurate speech translation</p>
        </div>
      </div>
    </div>
  );
}

export default App;