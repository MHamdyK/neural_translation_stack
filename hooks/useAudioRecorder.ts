
import { useState, useRef, useCallback } from 'react';

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    setAudioBlob(null);
    audioChunksRef.current = [];

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError("Media Devices API not supported by your browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Try to record in WAV format if supported, otherwise browser default (often webm)
      const options = MediaRecorder.isTypeSupported('audio/wav') 
        ? { mimeType: 'audio/wav' }
        : MediaRecorder.isTypeSupported('audio/webm') 
        ? { mimeType: 'audio/webm' } 
        : {};

      mediaRecorderRef.current = new MediaRecorder(stream, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const completeAudioBlob = new Blob(audioChunksRef.current, { type: mediaRecorderRef.current?.mimeType || 'audio/wav' });
        setAudioBlob(completeAudioBlob);
        setIsRecording(false);
         // Clean up the stream
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error("MediaRecorder error:", event);
        setError("Error during recording.");
        setIsRecording(false);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err instanceof Error && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setError("Microphone access denied. Please allow microphone permission in your browser settings.");
      } else {
        setError("Could not access microphone. Please ensure it's connected and enabled.");
      }
      setIsRecording(false);
    }
  }, []);

  const stopRecording = useCallback(async (): Promise<File | null> => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => { // Overwrite onstop to resolve promise
          const mimeType = mediaRecorderRef.current?.mimeType || 'audio/wav';
          const completeAudioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          setAudioBlob(completeAudioBlob);
          setIsRecording(false);
          
          // Stop tracks from the original stream if not already stopped
          mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop());

          const fileExtension = mimeType.includes('wav') ? 'wav' : 'webm'; // Or more robust extension detection
          const recordedFile = new File([completeAudioBlob], `recording.${fileExtension}`, { type: mimeType });
          resolve(recordedFile);
        };
        mediaRecorderRef.current.stop();
      } else {
        resolve(null);
      }
    });
  }, [isRecording]);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setAudioBlob(null);
    audioChunksRef.current = [];
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    setError(null);
  }, []);

  return { isRecording, audioBlob, startRecording, stopRecording, error, resetRecording };
};
