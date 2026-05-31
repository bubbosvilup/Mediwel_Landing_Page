const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { resolve } = require('node:path');

const html = readFileSync(resolve(__dirname, '..', 'mediwell.html'), 'utf8');
const text = html.replace(/\s+/g, ' ');

test('keeps the reset document unstyled and WordPress-embeddable', () => {
  assert.doesNotMatch(html, /<style[\s>]/i);
  assert.doesNotMatch(html, /<nav[\s>]/i);
  assert.doesNotMatch(html, /<footer[\s>]/i);
  assert.match(html, /COLORI PRINCIPALI DEL DESIGN PRECEDENTE/);
});

test('uses the approved copy without forbidden wording or individual studio cards', () => {
  assert.doesNotMatch(text, /\bambulatori?\b/i);
  assert.doesNotMatch(text, /\bASL\b/i);
  assert.doesNotMatch(text, /\bcertificat\w*\b/i);
  assert.doesNotMatch(text, /mezzi pubblici/i);
  assert.doesNotMatch(text, /Studio (Medico )?(Uno|Due|Tre|Quattro|Cinque|[1-5])/i);
  assert.match(text, /Il tuo nuovo studio sanitario a giornata a Faenza/);
  assert.match(text, /Ottimizza i costi, azzera gli sprechi/);
  assert.match(text, /Condivisione intelligente che elimina i costi fissi/);
  assert.match(text, /da € 76,00 a € 98,00 al giorno, IVA inclusa/i);
  assert.match(text, /prenotazioni avvengono esclusivamente a giornata intera/i);
});

test('presents the studios once as a general ready-to-use overview', () => {
  assert.match(text, /Solo 5 studi domotici/);
  assert.match(text, /da 12 a 15 mq/);
  assert.match(text, /scrivanie regolabili motorizzate/i);
  assert.match(text, /due sedie per pazienti o clienti/i);
  assert.match(text, /appendiabiti/i);
  assert.match(text, /armadietti con chiave/i);
  assert.match(text, /lettini medici elettrici/i);
  assert.match(text, /lettini fisioterapici elettrici/i);
  assert.match(text, /poltrone multifunzionali elettriche/i);
});

test('explains the technology-led private access flow', () => {
  assert.match(text, /La tecnologia sostituisce la segreteria/i);
  assert.match(text, /disponibilità in tempo reale/i);
  assert.match(text, /codice personale/i);
  assert.match(text, /tastiera elettronica/i);
  assert.match(text, /numero dello studio/i);
  assert.match(text, /citofono privato dello studio/i);
});

test('keeps the parking message and the September 2 2026 launch countdown', () => {
  assert.match(text, /Posizione strategica, senza stress da parcheggio/i);
  assert.match(text, /100 metri/i);
  assert.match(text, /parcheggio ampio e gratuito/i);
  assert.match(text, /2 settembre 2026/i);
  assert.match(html, /2026-09-02T07:00:00\+02:00/);
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
  assert.match(form, /Manifesta interesse e blocca la priorità/i);
  assert.match(html, /data-demo="true"/);
});
