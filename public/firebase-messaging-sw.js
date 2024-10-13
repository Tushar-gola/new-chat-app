
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


firebase.initializeApp({
    apiKey: "AIzaSyCxPRaFkpez2x6Hvklfu8mHkAztM3dd630",
    authDomain: "auth-7443f.firebaseapp.com",
    projectId: "auth-7443f",
    storageBucket: "auth-7443f.appspot.com",
    messagingSenderId: "655429653040",
    appId: "1:655429653040:web:9703ec0ac397e4ae18d3f5",
    measurementId: "G-FWHH81DLD1"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
      '[firebase-messaging-sw.js] Received background message ',
      payload
    );
    // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.image
    };
  
    self.registration.showNotification(notificationTitle, notificationOptions);
  });