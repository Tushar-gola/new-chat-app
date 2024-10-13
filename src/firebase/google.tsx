import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getMessaging, getToken } from "firebase/messaging";
const firebaseConfig = {
    apiKey: "AIzaSyCxPRaFkpez2x6Hvklfu8mHkAztM3dd630",
    authDomain: "auth-7443f.firebaseapp.com",
    projectId: "auth-7443f",
    storageBucket: "auth-7443f.appspot.com",
    messagingSenderId: "655429653040",
    appId: "1:655429653040:web:9703ec0ac397e4ae18d3f5",
    measurementId: "G-FWHH81DLD1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const messaging = getMessaging(app);
const provider = new GoogleAuthProvider()
provider.addScope('email');
provider.setCustomParameters({
    prompt: 'select_account'
});

const genratePermission = async () => {
    const permissiion = await Notification.requestPermission()
    if (permissiion == 'granted') {
        const token = await getToken(messaging, { vapidKey: "BGlemwmSLm_884a59bGko2P3kvyeRqGhQkVyOxQahcSkpH1DF1cwcWzF2mHFjGdd_sjnBmP62JtpNDX_leRSUA4" });

        console.log(token);
    }


}
export { auth, provider, genratePermission ,messaging}



// BGlemwmSLm_884a59bGko2P3kvyeRqGhQkVyOxQahcSkpH1DF1cwcWzF2mHFjGdd_sjnBmP62JtpNDX_leRSUA4
