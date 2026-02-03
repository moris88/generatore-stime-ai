export function createPrompt(
  techStack: string,
  scope: "Frontend" | "Backend" | "Full-stack",
  requirements: string,
  notes: string, // Nuovo parametro per le note aggiuntive
  summarizedHistoricalContext: string[] // Nuovo parametro per il contesto storico RIASSUNTO
): string {
  const historicalSection = summarizedHistoricalContext.length > 0
    ? `Sintesi delle Stime Storiche Rilevanti (per riferimento):
${summarizedHistoricalContext.map((summary, index) => `### Sintesi Stima Storica ${index + 1}\n${summary}`).join('\n---\n')}\n
Usa queste sintesi delle stime storiche come esempi per calibrare e migliorare l'accuratezza della nuova stima, ma non copiarle direttamente. Analizza la struttura, il livello di dettaglio e le ore stimate per tipi di task simili da queste sintesi.
`
    : '';

  return `
Ruolo: Agisci come un Senior Software Architect. Il tuo compito è generare un documento di stima professionale per un progetto basato su ${techStack} (${scope}).

${historicalSection}
Soglie Minime di Ingaggio (Base di Partenza):
Identifica la tipologia di progetto e il livello di complessità dai requisiti funzionali e tecnici.
Applica rigorosamente una delle seguenti soglie minime (1 giornata = 8h).

- Solo Frontend (per Deluge e Client Script per Zoho CRM):
  - Complessità Minima: Minimo 1h
    (Codice Deluge per una Custom Function di Zoho CRM con logica semplice)
  - Complessità Molto Bassa: Minimo 3h
    (Client Script per Zoho CRM, Codice Deluge per una Custom Function di Zoho CRM con logica complessa)
  - Complessità Bassa: Minimo 1 giornata (8 ore)
    (più Custom Functions con integrazioni API semplici su Zoho CRM, più Client Script semplici)
  - Complessità Media: Minimo 3 giornate (24 ore)
    (più Custom Functions con logica complessa e integrazioni multiple su Zoho CRM, logiche multi-workflow semplici, Client Script complessi)
  - Complessità Alta: Minimo 5 giornate (40 ore)
    (Custom Functions molto complesse, integrazioni multiple sulla suite Zoho, logiche multi-workflow avanzate, più Client Script complessi)
  - Complessità Molto Alta: Minimo 8 giornate (64 ore)
    (Custom Functions critiche, integrazioni mission-critical, logiche multi-workflow complesse e ottimizzate, numerosi Client Script complessi)

- Solo Frontend (web app/widget/interfacce grafiche):
  - Complessità Molto Bassa: Minimo 1 giornata (8 ore)
    (Html statico, style css minimo, UI basico, Nessuna integrazione)
  - Complessità Bassa: Minimo 6 giornate (48 ore)
    (UI semplice, max 3 componenti UI, una vista, logica minima, integrazione limitata)
  - Complessità Media: Minimo 12 giornate (96 ore)
    (UI articolata, max 6 componenti, mono-step, max 3 viste, routing, state management, validazioni, integrazioni API base, form singolo)
  - Complessità Alta: Minimo 22 giornate (176 ore)
    (UI complessa, multi-step, forte business logic, più forms, integrazioni base, animazioni semplici, accessibilità base)
  - Complessità Molto Alta: Minimo 30 giornate (240 ore)
    (Design System completo, animazioni complesse, accessibilità completa, integrazioni critiche, forms complessi, performance ottimizzate)
  - Complessità Estrema: Minimo 40 giornate (320 ore)
    (portali web senza backend o con backend semplice gestito da un CMS non personalizzato)

- Solo Backend (API, serverless, integrazioni, database):
  - Complessità Molto Bassa: Minimo 3 giornate (24 ore)
    (Funzionalità backend molto semplice, unica route API, logica molto leggera)
  - Complessità Bassa: Minimo 7 giornate (56 ore)
    (CRUD, logica semplice, API minima, una singola integrazione, serverless basici)
  - Complessità Media: Minimo 12 giornate (96 ore)
    (business logic strutturata, più integrazioni, gestione stati, sicurezza base, API RESTful base, serverless avanzati)
  - Complessità Alta: Minimo 20 giornate (160 ore)
    (workflow complessi, integrazioni multiple, asincronia, sicurezza, performance, API complesse, monitoraggio base)
  - Complessità Molto Alta: Minimo 35 giornate (280 ore)
    (architettura microservizi, alta scalabilità, requisiti di performance critici, integrazioni mission-critical, gestione avanzata della sicurezza, compliance, monitoraggio e logging estesi)

- Full-stack (Frontend + Backend):
  - Complessità Molto Bassa: Minimo 10 giornate (80 ore)
    (UI molto semplice + backend leggero, flussi lineari, integrazione minima)
  - Complessità Bassa: Minimo 25 giornate (200 ore)
    (UI + BE standard, flussi lineari, integrazione controllata e base, database semplice)
  - Complessità Media: Minimo 32 giornate (256 ore)
    (UI complessa, business logic significativa, integrazioni esterne, gestione stati, sicurezza, API RESTful base)
  - Complessità Alta: Minimo 40 giornate (320 ore)
    (UI avanzata, workflow articolati, più sistemi, asincronia, alta criticità, database complessi)
  - Complessità Molto Alta: Minimo 50 giornate (400 ore)
    (animazioni, accessibilità, architettura complessa, scalabilità, requisiti di performance critici, integrazioni mission-critical, database distribuiti, sicurezza avanzata, compliance)
  - Complessità Estrema: Minimo 60 giornate (480 ore)
    (portali web complessi, CMS personalizzati, frontend con complessità alta, backend con microservizi, database complessi, integrazioni critiche, requisiti di sicurezza e compliance rigorosi)

Nota Importante: 
Nelle parentesi, per ogni ambito, sono forniti esempi indicativi (opzioni) per aiutarti a classificare correttamente la complessità del progetto, ovviamente vale una opzione tra quelle elencate, non una somma di più opzioni, per questo caso vanno aumentate le giornate per ogni opzione selezionata in base alla complessità e al caso specifico.

Calcolo delle Ore:
Analizza i requisiti forniti e scomponili in task tecnici specifici.
Assegna ore stimate a ciascun task basandoti sulla tua esperienza e sulle best practice del settore.
Se il calcolo dei singoli task risulta inferiore alla soglia minima individuata,
distribuisci le ore mancanti proporzionalmente sui task di Business Logic e Testing
fino al raggiungimento del minimo richiesto (NON indicarlo nel documento finale).

Vincoli Temporali Mandatori:
- Setup Progetto: Massimo 1 ora.
- Deploy & Supporto Finale: Massimo 1 ora.
- Testing: Massimo 20% del totale ore (incluso nel calcolo complessivo, non aggiuntivo).
- Buffer Imprevisti: Aggiungi un buffer del 20% sul totale ore (incluso nel calcolo complessivo, non aggiuntivo).
- Aggiungi un 10% di ore per eventuali richieste di modifica (incluso nel calcolo complessivo, non aggiuntivo).

Istruzioni di Output:
Genera un documento in formato Markdown con questa struttura:
- Obiettivo del Progetto: Sintesi del valore di business.
- Classificazione Progetto: Specifica se stimato come Frontend, Backend o Full-stack e indica il livello di complessità e il minimo di giornate applicato.
- Funzionalità Principali: Elenco task tecnici.
- Stima Effort (Tabella):
  - Elenco task in ore (rispettando le soglie minime applicate).
  - Riga "Buffer Imprevisti (20%)".
  - Totale Complessivo: Ore e Giornate (Totale Ore / 8).
- Vincoli e Assunzioni: Limiti tecnici (solo quelli rilevanti) e prerequisiti.
- Criticità e Rischi: Colli di bottiglia e rischi di integrazione (solo quelli veramente rilevanti).

Dati del Progetto da stimare (requisiti funzionali e tecnici):
${requirements}

${
  notes
    ? `Note Aggiuntive sul Progetto (non parte dei requisiti ma importanti da considerare):
${notes}`
    : ""
}
`;
}

export function createHistoricalEstimatesPrompt(historicalEstimates: string[]): string {
  return `
Riassumi le seguenti stime di progetto in modo conciso, mantenendo solo le informazioni essenziali per l'analisi comparativa. Per ogni stima, estrai:
- Obiettivo del Progetto (evidenzia il valore di business)
- Classificazione (Frontend, Backend, Full-stack e complessità)
- Funzionalità Principali (elenco dei task tecnici)
- Stima Effort (in ore e giornate)

Ecco le stime da riassumere:
${historicalEstimates.map((estimate, index) => `### Stima ${index + 1}\n${estimate}`).join('\n---\n')}
`;
}
