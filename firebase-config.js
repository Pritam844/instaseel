// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd_ycIZ_5dvbOSM3heuofxeH-Bb0Bx9TQ",
  authDomain: "instaseel.firebaseapp.com",
  databaseURL: "https://instaseel-default-rtdb.firebaseio.com",
  projectId: "instaseel",
  storageBucket: "instaseel.firebasestorage.app",
  messagingSenderId: "1050867540860",
  appId: "1:1050867540860:web:f78d0987f2243cc0aefaf9"
};

// Export the config if needed or just use it globally
// For simple HTML/JS without bundler, we'll use a global object or import map
window.firebaseConfig = firebaseConfig;
