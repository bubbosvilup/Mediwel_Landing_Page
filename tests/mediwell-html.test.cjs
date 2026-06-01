const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const html = readFileSync(resolve(__dirname, '..', 'index.html'), 'utf8');
const text = html.replace(/\s+/g, ' ');

test('keeps the reset document unstyled and WordPress-embeddable', () => {
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /<nav[\s>]/i);
  assert.doesNotMatch(html, /<footer[\s>]/i);
  assert.match(html, /COLORI PRINCIPALI DEL DESIGN PRECEDENTE/);
});

test('uses the client hero and pricing copy without forbidden wording or individual studio cards', () => {
  assert.doesNotMatch(text, /\bambulatori?\b/i);
  assert.doesNotMatch(text, /\bASL\b/i);
  assert.doesNotMatch(text, /\bcertificat\w*\b/i);
  assert.doesNotMatch(text, /mezzi pubblici/i);
  assert.doesNotMatch(text, /Studio (Medico )?(Uno|Due|Tre|Quattro|Cinque|[1-5])/i);
  assert.match(text, /Apertura il 2 settembre 2026 a Faenza: riserva ora il tuo studio in anteprima/);
  assert.match(text, /ottimizza i costi, azzera gli sprechi e blocca la tua giornata ideale prima del lancio ufficiale/i);
  assert.match(text, /Il modello: condivisione intelligente e tariffe trasparenti/);
  assert.match(text, /da euro 76,00 a euro 98,00 al giorno, IVA inclusa/i);
  assert.match(text, /prenotazioni avvengono esclusivamente a giornata intera/i);
  assert.match(text, /non è richiesto alcun investimento iniziale/i);
});

test('presents the client studios overview once', () => {
  assert.match(text, /Gli spazi: arredi a regolazione elettrica in un contesto esclusivo/);
  assert.match(text, /metrature da 12 a 15 mq/);
  assert.match(text, /scrivanie regolabili motorizzate/i);
  assert.match(text, /sedie comfort per pazienti o clienti/i);
  assert.match(text, /appendiabiti/i);
  assert.match(text, /armadietti di archiviazione con chiave privata/i);
  assert.match(text, /lettini medici elettrici/i);
  assert.match(text, /lettini fisioterapici elettrici/i);
  assert.match(text, /poltrone multifunzionali elettriche/i);
});

test('explains the three-step technology flow with the client details', () => {
  assert.match(text, /La tecnologia: indipendenza operativa e tutela della privacy/i);
  assert.match(text, /Prenotazione online:/i);
  assert.match(text, /www\.mediwell\.it/i);
  assert.match(text, /disponibilità in tempo reale/i);
  assert.match(text, /Accesso autonomo:/i);
  assert.match(text, /codice digitale personale/i);
  assert.match(text, /tastiera elettronica/i);
  assert.match(text, /dalle 7:00 alle 20:00/i);
  assert.match(text, /Citofono privato:/i);
  assert.match(text, /citofono privato collegato alla tua stanza/i);
});

test('keeps the parking message and the September 2 2026 launch countdown', () => {
  assert.match(text, /Dove siamo: posizione strategica a Faenza senza stress da parcheggio/i);
  assert.match(text, /Via Fornarina 12\/D a Faenza/i);
  assert.match(text, /100 metri/i);
  assert.match(text, /parcheggio ampio e completamente gratuito/i);
  assert.match(text, /2 settembre 2026/i);
  assert.match(html, /2026-09-02T07:00:00\+02:00/);
  assert.match(text, /all'Apertura Ufficiale/i);
});

test('keeps WhatsApp outside the demonstrative required-fields form', () => {
  const form = html.match(/<form\b[\s\S]*?<\/form>/i)?.[0] || '';
  assert.ok(form, 'expected a form element');
  assert.doesNotMatch(form, /wa\.me/i);
  assert.match(html, /wa\.me\/393930593500/i);
  assert.match(form, /name="nome-cognome"[\s\S]*?required/i);
  assert.match(form, /name="professione"[\s\S]*?required/i);
  assert.match(form, /name="telefono"[\s\S]*?required/i);
  assert.match(form, /name="email"[\s\S]*?required/i);
  assert.match(form, /name="privacy"[\s\S]*?required/i);
  assert.match(form, /Compila il modulo per bloccare la tua precedenza/i);
  assert.match(form, /Professione o Specializzazione/i);
  assert.match(form, /Numero di Telefono o WhatsApp/i);
  assert.match(html, /data-demo="true"/);
});
