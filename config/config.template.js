// Configuration Template
// Copy this file to config.js and add your actual API credentials

window.config = {
  // ElevenLabs API (Optional - for premium voice)
  elevenLabs: {
    apiKey: 'your-elevenlabs-api-key-here',
    voiceId: 'your-voice-id-here'
  },
  
  // Firebase Configuration
  // Get these from: Firebase Console > Project Settings > General > Your Apps
  firebase: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
  },
  
  // Stripe Configuration (for payments)
  stripe: {
    publishableKey: 'your-stripe-publishable-key-here'
  }
};