# VCNT Studio — sito di Vincenzo Russo

## Cosa c'è nella cartella

| File / cartella | A cosa serve |
|---|---|
| `index.html` | La pagina (non serve modificarla) |
| `content/site.json` | **Tutti i testi, i link e le foto del sito** |
| `images/` | Le foto (quelle attuali sono provvisorie, ritagliate dagli screen) |
| `css/style.css`, `js/app.js` | Grafica e funzionamento |
| `js/firebase-config.js` | Chiavi Firebase per il modulo contatti |
| `firestore.rules` | Regole di sicurezza da incollare in Firestore |
| `.pages.yml` | Configurazione dell'editor Pages CMS |

## 1. Pubblicare su GitHub Pages

1. Crea l'account GitHub di Enzo (es. `vincenzorusso`).
2. Crea un repository **pubblico** chiamato esattamente `vincenzorusso.github.io` (stesso nome dell'account + `.github.io`).
3. Carica tutto il contenuto di questa cartella (anche il file nascosto `.pages.yml`): *Add file → Upload files*.
4. *Settings → Pages* → Source: **Deploy from a branch**, branch `main`, cartella `/ (root)`.
5. Dopo un paio di minuti il sito è su `https://vincenzorusso.github.io`.

> Aprendo `index.html` con doppio clic dal computer la pagina resta vuota: i contenuti si caricano solo da GitHub Pages o da un server locale (es. *Live Server* di VS Code).

## 2. Modulo contatti (Firebase)

1. Su console.firebase.google.com crea un progetto (piano gratuito Spark va benissimo).
2. *Aggiungi app → Web*, copia i valori di `firebaseConfig` dentro `js/firebase-config.js`.
3. *Firestore Database → Crea database* → poi scheda **Regole**: incolla il contenuto di `firestore.rules` e pubblica.
4. I messaggi arrivano in Firestore, raccolta `messaggi`.

## 3. Come Enzo modifica il sito da solo (Pages CMS)

1. Va su **app.pagescms.org** e fa *Sign in with GitHub* con il suo account.
2. Autorizza l'app sul repository `vincenzorusso.github.io`.
3. Apre **Contenuti del sito**: trova le sezioni Home, Artistic, Studio, Contatti.
4. Modifica, aggiunge o elimina voci (composizioni, release, FAQ, foto) e preme **Save**.
5. Dopo circa un minuto le modifiche sono online.

Trucchi nei campi di testo:
- `**testo**` → **grassetto**
- `*testo*` → *corsivo*
- una riga vuota → nuovo paragrafo
- Link YouTube: si può incollare il link intero del video.

## Da sostituire prima della pubblicazione

- [ ] Foto originali (ritratti, studio, copertine, partiture, galleria) al posto di quelle ritagliate
- [ ] Link Spotify delle release (ora puntano alla home di Spotify) e verifica titoli/artisti
- [ ] Link YouTube di *Neuro Translation Engine*
- [ ] Instagram / YouTube / Spotify di Enzo (sezione Dati generali)
- [ ] Testi dei tre servizi dello Studio (scritti come esempio)
