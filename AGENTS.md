## Test frontend

- Per verifiche visuali e interazioni web usa Playwright MCP con Google Chrome visibile.
- Prima della verifica avvia il sito con `npm run serve` e usa `http://127.0.0.1:4173`.
- Non usare il browser integrato di Codex e non ripiegare silenziosamente su di esso.
- Il browser deve usare il profilo isolato configurato in `.codex/config.toml`; non usare il profilo Chrome personale.
- Dopo ogni modifica frontend, ricarica la pagina interessata e verifica lo stato richiesto.
- Se Chrome o Playwright MCP non sono disponibili, fermati e segnala il problema.
