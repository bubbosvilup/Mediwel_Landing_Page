# MediWell Landing Page Content Reset

## Objective

Replace the existing MediWell landing page with a clean, unstyled content structure for later integration into WordPress. This phase defines the message hierarchy and removes the previous visual design. A separate design pass will follow.

## Scope

- Remove the previous layout and embedded styling.
- Do not add a navigation bar or footer.
- Preserve the main colors from the previous design only inside an HTML comment for future reference.
- Keep a semantic, readable HTML structure with the approved content.
- Keep the interest form demonstrative: it validates required fields and displays a success message, but does not send data.
- Keep WhatsApp in the hero and as a floating contact action, but not inside the form.
- Keep the opening date and countdown for September 2, 2026.

## Content Structure

### 1. Hero

- Opening message: a new advanced space with 5 studios is about to launch in Faenza.
- Main heading: "Il tuo nuovo studio sanitario a giornata a Faenza."
- Supporting message: "Ottimizza i costi, azzera gli sprechi."
- Audience: doctors, physiotherapists, healthcare professionals, and wellness professionals.
- Mention that the booking website will be online soon.
- Primary CTA: manifest interest and obtain priority access.
- Secondary CTA: WhatsApp.

### 2. Cost Model

- Heading: "Condivisione intelligente che elimina i costi fissi."
- Explain that paying traditional rent on unused days is no longer necessary.
- State that bookings are only for a full day.
- State the public range: from EUR 76.00 to EUR 98.00 per day, VAT included.
- Mention no initial investment and no long-term contractual commitment.

### 3. Ready-To-Use Studios

- Provide one general overview only. Do not number or describe individual studios.
- State that there are only 5 home-automated studios, between 12 and 15 square meters.
- Describe them as ready for doctors, physiotherapists, healthcare professionals, and wellness professionals.
- Mention the available setup as a collective overview: motorized adjustable desks, two chairs for patients or clients, coat hooks, lockable cabinets, electric medical beds, electric physiotherapy beds, and electric multifunction chairs.
- Keep this section concise and use a contact CTA to invite discovery without publishing a room-by-room inventory.

### 4. Technology, Autonomy, And Privacy

- Explain that technology replaces the traditional front desk.
- The professional selects the most suitable studio for their specialization and sees real-time availability online.
- The professional books the full day and receives a personal access code for the electronic keypad.
- The professional tells the patient the assigned studio number privately after booking.
- The patient rings the private intercom for that studio.
- The professional opens the door directly from the studio.
- Emphasize autonomy and privacy without repeating details elsewhere.

### 5. Included Advantages

- Zero constraints: complete freedom without deposit or traditional 4+4 lease contracts.
- Everything included: utilities, Wi-Fi, and special waste disposal. Keep bureaucratic wording light.
- Hygiene: rigorous daily cleaning so the space is ready for use.
- Waiting room: a comfortable, elegant, quiet shared area for patients.

### 6. Location

- Heading: "Posizione strategica, senza stress da parcheggio."
- Explain that patient comfort begins before the visit.
- State that the facility is easy to reach and only 100 meters from a large free parking area.
- Emphasize convenience and reduced travel time.
- Do not mention public transport.

### 7. Launch And Priority Access

- Keep the official opening date: September 2, 2026.
- Keep a countdown targeting September 2, 2026.
- Do not mention reserved launch pricing.
- Invite professionals to request priority access before online booking becomes active.

### 8. Interest Form

- Present the form inside a visually distinct container later during the design pass.
- Heading: "Assicurati l'anteprima prima del lancio ufficiale."
- Explain that the 5 studios are expected to be in high demand and availability is intentionally limited to protect quality and privacy.
- Explain that submitting the form places the professional on the priority waiting list and that the team will make personal contact when online booking becomes active.
- Required fields:
  - Nome e Cognome
  - Specializzazione / Professione
  - Numero di telefono / WhatsApp
  - Email
  - Privacy consent
- CTA: "Manifesta interesse e blocca la priorità."
- Do not include WhatsApp as an alternative inside the form.

## Copy Constraints

- Never use "ambulatorio" or "ambulatori". Use "studio", "studi", "polistudio", or "spazio".
- Never mention ASL.
- Never use claims involving "certificato" or "certificate".
- Do not mention public transport.
- Communicate each benefit once whenever possible.
- Do not publish a detailed room-by-room breakdown.
- Do not imply hourly booking or time slots: reservations are for full days only.

## Technical Notes

- The target remains a standalone HTML file suitable for later adaptation inside WordPress.
- The form remains demonstrative until a WordPress form plugin or endpoint is selected.
- Required-field validation must include every visible form field and privacy consent.
- The previous JavaScript countdown target must be corrected from `2025-09-02` to `2026-09-02`.
- The design pass is explicitly deferred. No new visual system is introduced during the reset.

## Deferred Work

- High-fidelity visual design.
- WordPress integration details.
- Selection and configuration of a production form plugin or endpoint.
- Production submission handling, email delivery, spam prevention, and consent storage.
