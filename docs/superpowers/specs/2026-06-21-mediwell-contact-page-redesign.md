# MediWell Contact Page Redesign

## Obiettivo

Trasformare `contatti.html` in una pagina di contatto essenziale e autorevole, eliminando il form e portando l'utente verso un contatto rapido su WhatsApp. La pagina deve usare esclusivamente recapiti già presenti nella landing page e nel footer MediWell.

## Struttura approvata

La pagina non include header o navigazione. Inizia direttamente con un hero editoriale chiaro, seguito da una CTA WhatsApp dominante, una griglia di recapiti e un blocco dedicato alla visita della sede. Il footer canonico esistente resta in fondo alla pagina.

### Hero

- Kicker: “Parliamo del tuo studio ideale”.
- Titolo: “Un contatto diretto. Una risposta concreta.”
- Testo breve orientato a disponibilità, tariffe e visite conoscitive.
- CTA principale verso `https://wa.me/393930593500`, con l'icona WhatsApp già usata nel footer.

### Recapiti

La griglia mostra quattro schede:

- Email: `info@mediwell.it` con link `mailto:`.
- Servizio clienti: `+39 393 059 3500` con link `tel:`.
- Sede operativa: Via Fornarina, 12/D, 48018 Faenza RA, Italia.
- PEC: `meeby@pec.it` con link `mailto:`.

Non vengono mostrati orari non confermati, numeri di telefono dimostrativi o indirizzi placeholder.

### Visita in sede

Un pannello scuro conclude il contenuto principale e invita a concordare la visita tramite WhatsApp. Il collegamento “Apri indicazioni” apre Google Maps con la sede MediWell a Faenza.

### Footer

Il footer animato canonico già presente in `contatti.html` viene mantenuto, inclusi recapiti, dati societari, social e icona WhatsApp.

## Direzione visiva

Il design usa la palette MediWell esistente: blu istituzionale, rosa e verde come accenti, superfici chiare, bordi morbidi e ombre controllate. Il hero usa gradienti e forme decorative senza aggiungere nuove immagini o asset. La CTA WhatsApp è il punto focale visivo.

Su desktop, i recapiti sono disposti in una griglia 2×2. Su mobile diventano una colonna; CTA, schede e collegamento alle indicazioni restano facilmente toccabili e leggibili.

## Accessibilità e comportamento

- Struttura semantica con titolo principale unico e sezioni riconoscibili.
- Link con destinazioni reali e testi accessibili.
- Icona WhatsApp con testo alternativo adeguato.
- Stati hover e focus visibili.
- Supporto a `prefers-reduced-motion`.
- Nessun JavaScript necessario per il contenuto principale.

## Verifica

- Test strutturale che conferma assenza di form, header e placeholder.
- Test dei recapiti, dei link `mailto:`, `tel:`, WhatsApp e Maps.
- Test che conferma il riuso dell'icona WhatsApp del footer.
- Verifica visuale in Google Chrome su desktop e mobile.
- Esecuzione della suite completa del repository.

## Istruzioni persistenti

> Stato finale: implementazione completata e verificata il 21 giugno 2026. Il form e i contenuti dimostrativi sono stati rimossi; recapiti, WhatsApp, Google Maps e footer canonico sono verificati. La scheda “Vieni a conoscere MediWell” è collocata tra le quattro schede dei recapiti e il footer per bilanciare lo spazio verticale. I test coprono struttura, destinazioni reali e assenza di overflow su desktop e mobile.

`AGENTS.md` verrà aggiornato affinché, per attività di progettazione visuale, il companion visuale venga usato direttamente senza chiedere conferma preventiva. La regola esistente che vieta il browser integrato resta valida.
