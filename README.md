# MediWell Landing Page

Sito statico HTML, CSS e JavaScript per MediWell, polistudio sanitario a Faenza. I frammenti sono progettati per essere pubblicati su WordPress/Hostinger senza una fase di build.

## Stato del progetto

- Landing page con presentazione degli studi, planimetria interattiva, flusso tecnologico e conto alla rovescia verso il 7 settembre 2026.
- Pagine interne coordinate con il sistema visivo MediWell.
- Pagina Contatti senza form, con recapiti verificati, CTA WhatsApp e invito alla visita in sede.
- Hero di `come-funziona.html` e `prenota.html` compatte e prive della foto verticale sovrapposta.
- Footer canonico con recapiti, social, privacy e cookie policy.
- Verifiche automatiche strutturali e responsive tramite Node.js, Playwright e Google Chrome.

## Pagine principali

- `index.html`: landing page principale.
- `homepage.html`: variante della home.
- `chi-siamo.html`: presentazione MediWell.
- `come-funziona.html`: percorso di prenotazione in quattro passaggi.
- `prenota.html`: scelta dello studio.
- `contatti.html`: hub contatti e WhatsApp.
- `studio-uno.html` ... `studio-cinque.html`: schede dei singoli studi.

## Sviluppo e test

```powershell
npm install
npm run serve
npm test
```

Il sito locale è disponibile su `http://127.0.0.1:4173`. Per la verifica visiva usare Google Chrome tramite Playwright, seguendo le regole in `AGENTS.md`.

## Requisiti responsive

Ogni modifica frontend deve essere controllata almeno a 1440×1000 e 390×844. Devono essere verificati altezza e spazio verticale delle sezioni, leggibilità completa dei testi, assenza di sovrapposizioni tra testi e immagini, assenza di contenuti tagliati e assenza di overflow orizzontale.

## Documentazione

Le specifiche e i piani storici sono in `docs/superpowers`. Lo stato consolidato delle ultime correzioni responsive è descritto in `docs/superpowers/specs/2026-06-21-mediwell-responsive-layout-guardrails.md`.

## Prossimi interventi

- Completare il flusso di prenotazione guidata.
- Collegare disponibilità e tariffe reali degli studi.
- Sostituire eventuali fotografie temporanee residue prima della pubblicazione definitiva.
- Ripetere la matrice di controllo desktop/mobile dopo ogni modifica visuale.
