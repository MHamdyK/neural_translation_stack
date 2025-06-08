
export interface AudioData {
  sample_rate: number;
  base64: string;
}

export interface ApiResponseData {
  arabic_transcript: string;
  english_translation: string;
  audio_data: AudioData;
}
