
import React, { useState, useRef, useCallback } from 'react';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { MicIcon } from './icons/MicIcon';
import { StopIcon } from './icons/StopIcon';
import { UploadIcon } from './icons/UploadIcon';
import { TrashIcon } from './icons/TrashIcon';

interface AudioInputAreaProps {
  onAudioReady: (file: File) => void;
  clearAudio: () => void;
  currentAudioFile: File | null;
  isLoading: boolean;
}

export const AudioInputArea: React.FC<AudioInputAreaProps> = ({ onAudioReady, clearAudio, currentAudioFile, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    isRecording,
    startRecording,
    stopRecording,
    error: recorderError,
    audioBlob,
    resetRecording,
  } = useAudioRecorder();
  
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) { // 25MB limit, example
        setUploadError("File is too large. Max 25MB allowed.");
        onAudioReady(null as any); // Clear any previous file
        return;
      }
      if (!['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3', 'audio/x-wav'].includes(file.type)) {
        setUploadError("Invalid file type. Please upload MP3, WAV, or OGG.");
        onAudioReady(null as any); // Clear any previous file
         return;
      }
      onAudioReady(file);
      resetRecording(); // Clear any previous recording
    }
  };

  const handleRecordClick = async () => {
    setUploadError(null);
    if (isRecording) {
      const recordedFile = await stopRecording();
      if (recordedFile) {
        onAudioReady(recordedFile);
      }
    } else {
      clearAudio(); // Clear uploaded file if user starts recording
      startRecording();
    }
  };
  
  const handleClearCurrentAudio = () => {
    clearAudio();
    resetRecording();
    setUploadError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset file input
    }
  };

  return (
    <div className="bg-slate-800 shadow-xl rounded-lg p-6 space-y-6 ring-1 ring-slate-700">
      <div>
        <h2 className="text-xl font-semibold text-sky-400 mb-3">1. Provide Audio</h2>
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label
              htmlFor="audio-upload"
              className={`w-full flex items-center justify-center px-6 py-3 border-2 border-dashed border-slate-600 rounded-lg cursor-pointer hover:border-sky-500 transition-colors duration-150 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <UploadIcon className="w-6 h-6 mr-2 text-slate-400" />
              <span className="text-slate-300">Upload Audio File (.mp3, .wav, .ogg)</span>
            </label>
            <input
              id="audio-upload"
              type="file"
              accept="audio/mpeg,audio/wav,audio/ogg,audio/mp3,audio/x-wav"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
              disabled={isLoading}
            />
            {uploadError && <p className="text-red-400 text-sm mt-2">{uploadError}</p>}
          </div>

          <div className="flex items-center">
            <hr className="flex-grow border-slate-700" />
            <span className="px-3 text-slate-500 text-sm">OR</span>
            <hr className="flex-grow border-slate-700" />
          </div>

          {/* Microphone Recording */}
          <div>
            <button
              onClick={handleRecordClick}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-opacity-75
                ${isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-400' 
                  : 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-400'}
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isRecording ? (
                <>
                  <StopIcon className="w-6 h-6 mr-2" />
                  Stop Recording
                </>
              ) : (
                <>
                  <MicIcon className="w-6 h-6 mr-2" />
                  Record Audio
                </>
              )}
            </button>
            {recorderError && <p className="text-red-400 text-sm mt-2">{recorderError}</p>}
            {isRecording && <p className="text-yellow-400 text-sm mt-2 text-center animate-pulse">Recording in progress...</p>}
          </div>
        </div>
      </div>
      
      {currentAudioFile && (
        <div className="mt-4 p-3 bg-slate-700 rounded-md text-sm text-slate-300 flex justify-between items-center">
          <span>Selected: <strong>{currentAudioFile.name}</strong> ({(currentAudioFile.size / 1024).toFixed(2)} KB)</span>
          <button 
            onClick={handleClearCurrentAudio} 
            className="text-slate-400 hover:text-red-400 disabled:opacity-50"
            disabled={isLoading}
            title="Clear selection"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
