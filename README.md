# CLI per la Stima di Progetti Gemini

Questo è un tool da riga di comando (CLI) progettato per semplificare il processo di generazione di stime professionali di progetto in formato Markdown, sfruttando la potenza dell'intelligenza artificiale di Google Gemini.

## Panoramica del Progetto

L'obiettivo principale di questa CLI è standardizzare e accelerare la stima dei progetti software. Raccogliendo input strutturati (cliente, stack tecnologico, ambito, requisiti), il tool genera documenti di stima coerenti e dettagliati basati su un prompt meticolosamente ingegnerizzato per un Senior Software Architect.

## Come Funziona

Sviluppato in **TypeScript**, il tool presenta un'architettura modulare:

- **`src/index.ts`**: Punto di ingresso dell'applicazione, utilizza la libreria `inquirer` per creare un'interfaccia interattiva che raccoglie le informazioni necessarie per il progetto dall'utente.
- **`src/gemini.ts`**: Questo modulo gestisce la comunicazione con l'API di Google Gemini. Costruisce il prompt AI utilizzando i dati forniti dall'utente ed elabora la stima generata.
- **File di Output**: La stima finale del progetto viene salvata come file `.md` nella directory radice del progetto.

## Prerequisiti

Per utilizzare questa CLI, assicurati di avere:

1. **Node.js** installato (versione 18 o superiore consigliata).
2. Una **Chiave API di Google Gemini**.

## Guida Rapida

1. **Clona o scarica il progetto** e naviga nella sua directory.

2. **Installa le dipendenze** usando npm:

    ```bash
    npm install
    ```

3. **Avvia la CLI**:
    Dopo aver configurato le variabili d'ambiente (es. la tua chiave API Gemini), esegui il seguente comando per avviare il processo interattivo:

    ```bash
    npm run build && npm start
    ```

4. **Segui le Istruzioni**:
    La CLI ti guiderà attraverso una serie di domande. Per la selezione dello stack tecnologico, ora puoi scegliere da un elenco più ampio di opzioni, incluse selezioni multiple. Fornisci le risposte a ciascun prompt. Al completamento, il tuo file di stima `.md` verrà generato nella directory radice del progetto.

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
