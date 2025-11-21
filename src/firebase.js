// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// COPIE E COLE SUA CONFIGURAÇÃO DO SITE DO FIREBASE AQUI
// (Substitua este bloco pelo que o Google te deu)
const firebaseConfig = {
  apiKey: "AIzaSyALmVqHE0HJbm45rEvc8oKtt8TwDgu2X4Y",
  authDomain: "oraculo-mistico.firebaseapp.com",
  projectId: "oraculo-mistico",
  storageBucket: "oraculo-mistico.firebasestorage.app",
  messagingSenderId: "648455555472",
  appId: "1:648455555472:web:106424c2a36f1aa0a0cb15"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Banco de Dados
const db = getFirestore(app);

export { db };