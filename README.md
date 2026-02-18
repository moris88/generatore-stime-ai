# CLI per la Stima di Progetti Software (Gemini/AI)

Questo è un tool da riga di comando (CLI) professionale progettato per generare stime di progetto accurate in formato Markdown, sfruttando la potenza di Google Gemini (e OpenAI ChatGPT). Il sistema è calibrato per Senior Software Architect e segue rigide soglie di complessità aziendali.

## Caratteristiche Principali

- **Workflow Interattivo**: Guida l'utente nella definizione di stack tecnologico, ambito (Frontend, Backend, Full-stack) e requisiti.
- **Logica di Complessità Rigorosa**: Applica automaticamente soglie minime di ingaggio basate su standard predefiniti (Zoho ecosystem, Web Apps, Backend enterprise).
- **Storico Intelligente (JSON)**: Salva automaticamente un riassunto strutturato di ogni stima in `stima_history.json`.
- **Contesto AI Potenziato**: Utilizza lo storico per fornire all'AI esempi reali di stime precedenti, garantendo coerenza e calibrazione nel tempo.
- **Output Professionale**: Genera file Markdown pronti per essere presentati, completi di analisi dei rischi, vincoli e tabelle di effort.

## Come Funziona

Il tool è sviluppato in **TypeScript** con un'architettura modulare:

1. **Raccolta Input**: Interfaccia interattiva con `inquirer`.
2. **Recupero Contesto**: Estrazione di stime simili dal file centralizzato `stima_history.json`.
3. **Generazione AI**: Chiamata a Google Gemini (o ChatGPT) con prompt ingegnerizzato.
4. **Finalizzazione**: Creazione del file `.md` e aggiornamento automatico dello storico JSON con un riassunto conciso.

## Installazione e Avvio

### Prerequisiti

- **Node.js** >= 22
- **pnpm** >= 9
- **Chiave API**: Google Gemini (o OpenAI)

### Guida Rapida

1. **Installa le dipendenze**:

    ```bash
    pnpm install
    ```

2. **Avvia in modalità sviluppo**:

    ```bash
    npm run dev
    ```

3. **Build e Avvio produzione**:

    ```bash
    npm run build && npm start
    ```

## Comandi Disponibili

- `npm run dev`: Avvia il tool direttamente con `vite-node`.
- `npm run build`: Compila il progetto con Vite.
- `npm start`: Esegue la versione compilata (richiede build).
- `npm run lint`: Controlla la qualità del codice con Biome.
- `npm run format`: Formatta automaticamente i file.

## Gestione dello Storico

Il file `stima_history.json` funge da database centralizzato. È fondamentale non cancellarlo per permettere all'AI di mantenere la memoria delle stime passate e migliorare progressivamente la precisione dei calcoli.
