# VS Code Chrome Automation Design

## Obiettivo

Consentire a Codex in VS Code di aprire e controllare Google Chrome per le verifiche del sito Mediwell, senza usare il browser integrato di Codex e senza accedere al profilo Chrome personale dell'utente.

## Soluzione

Il repository registrerà Playwright MCP nella configurazione Codex locale al progetto. Il server MCP userà il canale Google Chrome in modalità visibile e un profilo temporaneo isolato. La configurazione diventerà disponibile dopo il riavvio di Codex o l'apertura di una nuova sessione VS Code.

Il sito statico sarà esposto su un indirizzo `localhost` mediante uno script npm dedicato. Questo evita differenze e restrizioni proprie delle URL `file://` e rende ripetibili le verifiche.

## Componenti

- `.codex/config.toml`: registra Playwright MCP con Google Chrome e profilo isolato.
- `package.json` e lockfile: espongono un comando stabile per avviare il server statico locale e includono solo le dipendenze necessarie.
- `AGENTS.md`: impone l'uso di Playwright MCP per le verifiche frontend e vieta il fallback silenzioso al browser integrato.
- Test di smoke: verifica che Google Chrome possa essere avviato tramite Playwright e che la homepage locale venga caricata correttamente.

## Flusso operativo

1. Codex avvia il server statico del repository.
2. Playwright MCP apre Google Chrome visibile con un profilo temporaneo separato.
3. Codex naviga verso il percorso locale richiesto, ispeziona la pagina e svolge le interazioni necessarie.
4. Dopo una modifica frontend, Codex ricarica la pagina e verifica nuovamente lo stato interessato.
5. Se Chrome o Playwright MCP non sono disponibili, Codex segnala l'errore senza passare al browser integrato.

## Isolamento e sicurezza

Il profilo del browser non condivide cookie, cronologia, password o sessioni con il profilo Chrome personale. Il profilo temporaneo viene ricreato per ogni sessione MCP. La configurazione è limitata a questo repository e non modifica le preferenze globali degli altri progetti.

## Verifica

- Convalidare la sintassi della configurazione Codex.
- Verificare che il comando Playwright MCP riconosca le opzioni configurate.
- Avviare il server statico e controllare che risponda su `localhost`.
- Avviare Google Chrome visibile con il canale `chrome` e caricare la homepage.
- Eseguire la suite `npm test` esistente per escludere regressioni.

## Fuori ambito

- Utilizzo del profilo Chrome personale o delle relative sessioni autenticate.
- Installazione dell'estensione Chrome dell'app desktop Codex.
- Introduzione di test end-to-end completi per tutte le pagine del sito.
