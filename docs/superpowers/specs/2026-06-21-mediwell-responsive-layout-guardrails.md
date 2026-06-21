# MediWell Responsive Layout Guardrails

## Obiettivo

Prevenire regressioni visuali nelle pagine MediWell, in particolare hero troppo alte, immagini decorative che coprono i testi, contenuti tagliati e spazi verticali sproporzionati.

## Correzioni consolidate

- `contatti.html`: eliminato il form; aggiunti recapiti verificati, CTA WhatsApp e scheda “Vieni a conoscere MediWell” prima del footer.
- `come-funziona.html`: rimossa la foto verticale sovrapposta; titolo ricomposto senza interruzioni HTML non valide; hero limitata a 540 px desktop e circa 371 px mobile nel viewport di riferimento.
- `prenota.html`: rimossa la foto verticale sovrapposta; titolo e sottotitolo resi indipendenti dall'immagine decorativa; hero limitata a 500 px desktop e circa 354 px mobile nel viewport di riferimento.

## Regole obbligatorie

Per ogni modifica frontend:

1. verificare almeno 1440×1000 e 390×844;
2. misurare l'altezza delle sezioni principali e controllare lo spazio verticale tra i blocchi;
3. verificare che testi, immagini, pseudo-elementi e CTA non si sovrappongano;
4. verificare che titoli, sottotitoli e pulsanti siano interamente contenuti nella sezione;
5. verificare l'assenza di overflow orizzontale;
6. ispezionare l'intera pagina in Google Chrome, non soltanto la parte iniziale;
7. aggiungere una regressione Playwright per ogni problema corretto.

## Automazione

- `tests/come-funziona.test.cjs` controlla altezza, overlay e overflow della hero Come funziona.
- `tests/prenota.test.cjs` controlla altezza, overlay, contenimento del testo e overflow della hero Prenota.
- `tests/contatti.test.cjs` controlla la pagina Contatti e la resa responsive.
- `tests/browser-tooling.test.cjs` protegge le regole operative di browser e responsive QA.

La verifica completa si esegue con `npm test`; il controllo visuale usa `npm run serve` e Google Chrome tramite Playwright.
