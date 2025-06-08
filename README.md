# Neural Translation Stack

A clean, modern, and mobile-responsive frontend web application designed to provide a user-friendly interface for speech-to-speech translation from Arabic to English. This project leverages cutting-edge AI technology through an external API to deliver accurate translations and synthesized speech.

## Features

*   **Audio Input:** Users can either upload an audio file (e.g., .wav, .mp3, .ogg) or record audio directly using their microphone.
*   **Real-time Processing Feedback:** Displays a loading indicator and disables the submit button while the API processes the audio.
*   **Comprehensive Results Display:** Presents the Arabic transcript, English translation, and synthesized English speech (playable via an HTML audio player) in clearly labeled sections.
*   **Robust Error Handling:** Gracefully handles API errors and displays user-friendly messages.
*   **Modern UI/UX:** Clean, minimalist, and fully responsive design using a card-based layout, optimized for both desktop and mobile devices.

## Technologies Used

*   **React:** For building the dynamic user interface.
*   **TypeScript:** For type safety and improved code quality.
*   **Tailwind CSS:** A utility-first CSS framework for rapid and consistent styling.
*   **Lucide React:** For a comprehensive set of beautiful and customizable icons.
*   **Vite:** A fast build tool for modern web projects.

## Project Structure

```
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── AudioRecorder.tsx
│   │   ├── AudioUpload.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ResultsDisplay.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```


## API Integration

This project utilizes a pre-existing public API for speech translation, hosted on Hugging Face Spaces.

*   **API Endpoint:** `https://mohamdyy-speech-translator.hf.space/process-speech/`
*   **Functionality:** The frontend application sends audio data to this endpoint and receives the Arabic transcript, English translation, and synthesized English audio in response.
*   **Setup:** No separate API deployment was required for this project, as we are consuming an existing service. The integration involves making HTTP POST requests to the public endpoint, handled within the `handleSubmit` function in `src/App.tsx`.

## Getting Started

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd neural-translation-stack
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Start the development server:**
    ```bash
    npm run dev
    ```
    This will typically open the application in your browser at `http://localhost:5173`.

## Deployment

This application can be deployed as a static site. For continuous deployment, platforms like Netlify are recommended.
