// ─────────────────────────────────────────────────────────────
//  CONFIGURAZIONE FIREBASE (solo per il modulo contatti)
//  1. Firebase console → crea progetto → aggiungi app Web
//  2. Copia qui i valori di "firebaseConfig"
//  3. Attiva Firestore e incolla le regole del file firestore.rules
//  Finché apiKey è vuota, il modulo mostra un avviso e non invia nulla.
// ─────────────────────────────────────────────────────────────
export const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

// Nome della raccolta Firestore dove finiscono i messaggi
export const MESSAGES_COLLECTION = "messaggi";
