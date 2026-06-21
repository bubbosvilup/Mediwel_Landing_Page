## Test frontend

- Per verifiche visuali e interazioni web usa Playwright MCP con Google Chrome visibile.
- Prima della verifica avvia il sito con `npm run serve` e usa `http://127.0.0.1:4173`.
- Non usare il browser integrato di Codex e non ripiegare silenziosamente su di esso.
- Il browser deve usare il profilo isolato configurato in `.codex/config.toml`; non usare il profilo Chrome personale.
- Dopo ogni modifica frontend, ricarica la pagina interessata e verifica lo stato richiesto.
- Se Chrome o Playwright MCP non sono disponibili, fermati e segnala il problema.

## Controllo responsive obbligatorio

- Verifica ogni pagina modificata su desktop e mobile; usa almeno i viewport 1440×1000 e 390×844.
- Controlla lo spazio verticale sopra, dentro e sotto hero, sezioni, card, CTA e footer: non devono esserci vuoti sproporzionati o contenuti compressi.
- Verifica che testi e immagini non siano sovrapposti, che titoli, sottotitoli, pulsanti e didascalie restino completamente leggibili e che nessun elemento venga tagliato.
- Controlla che pseudo-elementi, immagini decorative e fondali non coprano il contenuto e non alterino l'altezza della sezione.
- Verifica che il passaggio desktop/mobile non introduca overflow orizzontale, colonne instabili o spaziature incoerenti.
- Dopo il controllo automatico, esegui sempre una verifica visuale dell'intera pagina in Chrome e non limitarti al solo viewport iniziale.
- Quando correggi un problema di layout, aggiungi o aggiorna un test Playwright che misuri sovrapposizioni, spazio verticale, visibilità e overflow.

## Progettazione visuale

- Per attività che richiedono confronti visuali, mockup o valutazioni di layout usa direttamente il visual companion.
- Non chiedere conferma preventiva prima di avviare il visual companion.
