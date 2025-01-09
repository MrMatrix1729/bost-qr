// filepath: /C:/Users/Triman/Desktop/bost-qr/seedFirestore.js
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc } = require('firebase/firestore');
const { getAuth } = require('firebase/auth');
require('dotenv').config();

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  const userRef = doc(db, 'users', 'test@example.com');
  await setDoc(userRef, {
    email: 'test@example.com',
    name: 'Test User',
  });

  const entriesCollectionRef = collection(db, 'users', 'test@example.com', 'entries');
  await setDoc(doc(entriesCollectionRef), {
    time: new Date(),
  });
  await setDoc(doc(entriesCollectionRef), {
    time: new Date(),
  });

  console.log('Database seeded successfully');
}

seed().catch(console.error);