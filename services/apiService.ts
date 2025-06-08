
import type { ApiResponseData } from '../types';
import { API_URL } from '../constants';

export const translateSpeech = async (audioFile: File): Promise<ApiResponseData> => {
  const formData = new FormData();
  formData.append('file', audioFile);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorData.message || errorMessage;
      } catch (e) {
        // Could not parse error JSON, stick with status text
      }
      throw new Error(errorMessage);
    }

    const data: ApiResponseData = await response.json();
    
    // Validate expected fields
    if (!data.arabic_transcript || !data.english_translation || !data.audio_data || !data.audio_data.base64) {
        throw new Error("Received incomplete data from translation API.");
    }

    return data;
  } catch (error) {
    console.error('Error in translateSpeech:', error);
    if (error instanceof Error) {
      throw error; // Re-throw existing Error instances
    }
    throw new Error('Network error or invalid response from translation API.'); // Generic fallback
  }
};
