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

## Tabella di Complessità e Stime

### Solo Frontend — Deluge & Client Script (Su piattaforma Zoho)

| Complessità | Minimo (Ore) | Minimo (Giornate) | Ambito Applicativo                                                                            |
| ----------- | ------------ | ----------------- | --------------------------------------------------------------------------------------------- |
| Minima      | **1 h**      | 0,125 g           | Custom Function Deluge con logica semplice                                                    |
| Molto Bassa | **3 h**      | 0,375 g           | Client Script Zoho CRM o Custom Function con logica complessa                                 |
| Bassa       | **8 h**      | 1 g               | Più Custom Functions + integrazioni API semplici + Client Script semplici                     |
| Media       | **24 h**     | 3 g               | Custom Functions complesse, integrazioni multiple, workflow semplici, Client Script complessi |
| Alta        | **40 h**     | 5 g               | Custom Functions avanzate, integrazioni Zoho multiple, workflow avanzati                      |
| Molto Alta  | **64 h**     | 8 g               | Funzioni critiche, integrazioni mission-critical, workflow complessi e ottimizzati            |

### Solo Frontend - web app/widget/interfacce grafiche

| Complessità | Minimo (Ore) | Minimo (Giornate) | Ambito Applicativo                                          |
| ----------- | ------------ | ----------------- | ----------------------------------------------------------- |
| Molto Bassa | **8 h**      | 1 g               | HTML statico, CSS minimo, UI base, nessuna integrazione     |
| Bassa       | **48 h**     | 6 g               | UI semplice, max 3 componenti, una vista, logica minima     |
| Media       | **96 h**     | 12 g              | UI articolata, routing, state, validazioni, API base        |
| Alta        | **176 h**    | 22 g              | UI complessa, multi-step, business logic, forms multipli    |
| Molto Alta  | **240 h**    | 30 g              | Design system, animazioni complesse, accessibilità completa |
| Estrema     | **320 h**    | 40 g              | Portali web senza backend o con CMS non personalizzato      |

### Solo Backend - API, serverless, integrazioni, database

| Complessità | Minimo (Ore) | Minimo (Giornate) | Ambito Applicativo                                           |
| ----------- | ------------ | ----------------- | ------------------------------------------------------------ |
| Molto Bassa | **24 h**     | 3 g               | Singola API, logica minima                                   |
| Bassa       | **56 h**     | 7 g               | CRUD, API base, una integrazione                             |
| Media       | **96 h**     | 12 g              | Business logic strutturata, più integrazioni, sicurezza base |
| Alta        | **160 h**    | 20 g              | Workflow complessi, asincronia, performance, monitoraggio    |
| Molto Alta  | **280 h**    | 35 g              | Microservizi, scalabilità, sicurezza avanzata, compliance    |

### Full-stack Frontend + Backend

| Complessità | Minimo (Ore) | Minimo (Giornate) | Ambito Applicativo                                    |
| ----------- | ------------ | ----------------- | ----------------------------------------------------- |
| Molto Bassa | **80 h**     | 10 g              | UI semplice + backend leggero                         |
| Bassa       | **200 h**    | 25 g              | UI + BE standard, DB semplice                         |
| Media       | **256 h**    | 32 g              | UI complessa, business logic, integrazioni            |
| Alta        | **320 h**    | 40 g              | Workflow articolati, sistemi multipli                 |
| Molto Alta  | **400 h**    | 50 g              | Architettura complessa, performance, sicurezza        |
| Estrema     | **480 h**    | 60 g              | Portali enterprise, microservizi, compliance rigorosa |

#### Note di Interpretazione

Gli esempi tra parentesi sono indicativi, non cumulativi

Ogni opzione selezionata oltre la prima comporta incremento di giornate

Le soglie rappresentano minimi di ingaggio, non stime definitive

#### Regole di Calcolo Applicative

Setup progetto: max 1h

Deploy & supporto finale: max 1h

Testing: max 20% (incluso, non aggiuntivo)

Buffer imprevisti: 20% incluso

Richieste di modifica: 10% incluso

Se la somma dei task < soglia → riallocare ore su Business Logic e Testing
