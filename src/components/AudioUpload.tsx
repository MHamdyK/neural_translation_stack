import React, { useCallback } from 'react';
import { Upload, File } from 'lucide-react';

interface AudioUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  selectedFile?: File | null;
}

export const AudioUpload: React.FC<AudioUploadProps> = ({ onFileSelect, disabled, selectedFile }) => {
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files);
    const audioFile = files.find(file => file.type.startsWith('audio/'));
    if (audioFile) {
      onFileSelect(audioFile);
    }
  }, [onFileSelect, disabled]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  return (
    <div className="space-y-4">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${disabled 
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
            : 'border-blue-300 bg-blue-50 hover:border-blue-400 hover:bg-blue-100 cursor-pointer'
          }
        `}
      >
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        <div className="flex flex-col items-center space-y-3">
          <Upload className={`w-12 h-12 ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
          <div className="space-y-1">
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
              Drop your audio file here
            </p>
            <p className={`text-sm ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              or click to browse (.wav, .mp3, .ogg)
            </p>
          </div>
        </div>
      </div>
      
      {selectedFile && (
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <File className="w-5 h-5 text-gray-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};