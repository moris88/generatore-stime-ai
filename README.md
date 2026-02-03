# Generatore di Stime di Progetto con AI

Questo è un tool a linea di comando (CLI) che utilizza l'intelligenza artificiale di Google Gemini per generare stime di progetto professionali in formato Markdown.

## Scopo del Progetto

Lo scopo di questa CLI è di standardizzare e accelerare il processo di stima dei progetti software. Raccogliendo input strutturati (cliente, stack, ambito, requisiti), il tool produce un documento di stima coerente e dettagliato, basato su un prompt ingegnerizzato per un Senior Software Architect.

## Funzionamento

Il tool è stato sviluppato in **TypeScript** e si basa su un'architettura modulare:

- **`src/index.ts`**: È il punto di ingresso dell'applicazione. Utilizza la libreria `inquirer` per creare un'interfaccia interattiva che guida l'utente nella raccolta delle informazioni necessarie.
- **`src/gemini.ts`**: Questo modulo contiene la logica per comunicare con l'API di Google Gemini. Prepara il prompt con i dati forniti dall'utente e restituisce la stima generata dall'AI.
- **File di output**: La stima finale viene salvata come file `.md` nella directory principale del progetto.

## Prerequisiti

Per utilizzare questa CLI, è necessario avere:

1. **Node.js** installato (versione 18 o superiore consigliata).
2. Una **chiave API di Google Gemini**.

## Come Avviare il Tool

1. **Clonare o scaricare il progetto** e navigare nella sua directory.

2. **Installare le dipendenze** con npm:

    ```bash
    npm install
    ```

3. **Avviare la CLI**:
    Una volta impostate le variabili d'ambiente, eseguire il seguente comando per avviare il processo interattivo:

    ```bash
    npm run build && npm start
    ```

4. **Seguire le istruzioni**:
    La CLI porrà una serie di domande. Per la selezione dello stack tecnologico, ora è possibile scegliere tra un elenco più ampio di opzioni (anche selezionando più elementi). Rispondere a ciascuna domanda. Al termine, il file di stima ".md" verrà generato nella directory principale.
