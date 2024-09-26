import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAXokJhImVcXzFuuoBsZYf-iM2mrVG3omE",
  authDomain: "crm-r-3db0b.firebaseapp.com",
  projectId: "crm-r-3db0b",
  storageBucket: "crm-r-3db0b.appspot.com",
  messagingSenderId: "153603750389",
  appId: "1:153603750389:web:9d1628bb9ac87821e948bc",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
