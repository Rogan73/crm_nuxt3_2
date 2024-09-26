// plugins/firebase.js
import { initializeApp, getApps } from 'firebase/app'
import { getFirestore} from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const firebaseConfig = {
    apiKey: config.public.FB_API_KEY,
    authDomain: config.public.FB_AUTH_DOMAIN,
    projectId: config.public.FB_PROJECT_ID,
    storageBucket: config.public.FB_STORAGE_BUCKET,
    messagingSenderId: config.public.FB_MESSAGING_SENDER_ID,
    appId: config.public.FB_APP_ID,
    measurementId: config.public.FB_MEASUREMENT_ID
  };

  
  // Инициализируем Firebase только если оно еще не было инициализировано
  let firebaseApp
  let auth 
  let provider
  
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig)
    console.log('🟢 Firebase initialized');

     auth = getAuth(firebaseApp);
     provider = new GoogleAuthProvider();
    
  } else {
    firebaseApp = getApps()[0]
  }

  const firestore = getFirestore(firebaseApp)



  // Делаем firebaseApp и firestore доступными в контексте Nuxt
  nuxtApp.provide('firebase', firebaseApp)
  nuxtApp.provide('firestore', firestore)
  nuxtApp.provide('authFB', auth)
  nuxtApp.provide('providerFB', provider)
  



})