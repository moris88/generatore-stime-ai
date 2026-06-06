# PIANIFICAZIONE DEGLI SPRINT

La pianificazione prevede **6 Sprint** complessivi gestiti secondo la metodologia Agile, coordinati da un PM ed eseguiti da un singolo sviluppatore Full-stack.

### Sprint 1: Setup, UX/UI Design & Design System
* **Durata:** 10 Giorni (80 Ore)
* **Obiettivo dello Sprint:** Definire l'aspetto visivo dell'applicazione, impostare l'architettura tecnica e preparare l'ambiente di sviluppo.
* **Deliverable:** UI Kit approvato, Repository Git configurata e applicazione React iniziale funzionante in locale.
* **TODO List:**
  - [ ] Analisi dei requisiti grafici e strutturazione dei flussi utente (UX).
  - [ ] Creazione del prototipo ad alta fedeltà (Figma) per il configuratore d'offerte.
  - [ ] Inizializzazione del progetto React con TypeScript e Tailwind CSS.
  - [ ] Configurazione della libreria di icone e dei token grafici del brand (Design System).
  - [ ] Setup del Zoho Widget SDK (`ZSDK`) locale per i test di integrazione.

### Sprint 2: Frontend Core - Componenti Interfaccia & Stato Locale
* **Durata:** 10 Giorni (80 Ore)
* **Obiettivo dello Sprint:** Sviluppare l'interfaccia utente interattiva della Web App, focalizzandosi sulla navigazione e sulla gestione del carrello prodotti.
* **Deliverable:** Interfaccia utente navigabile e reattiva con dati fittizi (mock).
* **TODO List:**
  - [ ] Sviluppo del layout principale responsive dell'applicazione.
  - [ ] Creazione del sistema di navigazione a step (Wizard: Seleziona -> Configura -> Anteprima).
  - [ ] Implementazione del React Context per la gestione globale dello stato dell'offerta (prodotti selezionati, prezzi, calcolo dei totali).
  - [ ] Sviluppo della tabella interattiva dei prodotti con input per quantità e sconti.
  - [ ] Integrazione delle validazioni sui campi di input (es. quantità minima, sconti massimi consentiti).

### Sprint 3: Integrazione Zoho CRM & Flusso Dati (Deluge e SDK)
* **Durata:** 10 Giorni (80 Ore)
* **Obiettivo dello Sprint:** Collegare la Web App ai dati reali di Zoho CRM, recuperando le informazioni del cliente e dei prodotti.
* **Deliverable:** Widget integrato in Zoho CRM che popola i dati in tempo reale dal record aperto.
* **TODO List:**
  - [ ] Configurazione e inizializzazione del Widget all'interno del dettaglio dei record (es. Deals).
  - [ ] Scrittura di Client Script e Custom Function Deluge per estrarre i dati del record corrente (Contatto/Azienda associati).
  - [ ] Implementazione delle chiamate API per la ricerca e il recupero dei prodotti e relativi listini prezzi da Zoho CRM.
  - [ ] Integrazione del recupero dati asincrono all'interno del frontend React tramite TypeScript.
  - [ ] Gestione degli stati di caricamento (loading state) e degli errori di connessione al CRM.

### Sprint 4: Motore PDF & Chiusura Offerta su Zoho CRM
* **Durata:** 10 Giorni (80 Ore)
* **Obiettivo dello Sprint:** Implementare la generazione del documento PDF finale e l'aggiornamento automatico dei dati di vendita sul CRM.
* **Deliverable:** Generatore PDF funzionante con salvataggio automatico dell'offerta e del file all'interno del record del CRM.
* **TODO List:**
  - [ ] Progettazione del layout PDF dell'offerta (in linea con il Design System).
  - [ ] Sviluppo del motore di rendering PDF in React per la mappatura dinamica dei dati commerciali.
  - [ ] Creazione della funzione di salvataggio dei dati dell'offerta (creazione/aggiornamento di un record Quotes/Offerte in Zoho CRM).
  - [ ] Sviluppo del modulo di upload automatico del PDF generato come allegato (Attachment) nel record Zoho di origine.
  - [ ] Implementazione dell'anteprima di stampa interattiva per l'operatore.

### Sprint 5: Testing, Rifiniture & Gestione Modifiche
* **Durata:** 10 Giorni (80 Ore)
* **Obiettivo dello Sprint:** Validare l'intero flusso operativo, correggere le anomalie e implementare affinamenti derivanti dai feedback del cliente.
* **Deliverable:** Versione stabile "Release Candidate" dell'applicazione pronta per il rilascio.
* **TODO List:**
  - [ ] Esecuzione dei test di integrazione end-to-end (dalla selezione del prodotto al PDF su Zoho).
  - [ ] Debugging e correzione dei bug evidenziati dal PM e nei test (cross-browser e mobile responsiveness).
  - [ ] Implementazione di modifiche e ottimizzazioni richieste sul flusso di configurazione (Change Requests).
  - [ ] Test di carico e verifica dei limiti API Zoho durante operazioni simultanee.

### Sprint 6: Rilascio, Collaudo & Supporto al Go-Live
* **Durata:** 5 Giorni (40 Ore)
* **Obiettivo dello Sprint:** Distribuire l'applicazione in ambiente di produzione Zoho CRM e supportare gli utenti durante la fase di avvio.
* **Deliverable:** Widget pubblicato e pienamente operativo in produzione con documentazione tecnica sintetica consegnata.
* **TODO List:**
  - [ ] Configurazione finale del Widget nell'ambiente Zoho CRM di produzione del cliente.
  - [ ] Esecuzione del fumo test (Smoke Test) post-deploy per accertare il corretto funzionamento di tutte le integrazioni.
  - [ ] Fornitura di supporto tecnico durante la prima fase di UAT (User Acceptance Testing) da parte del team del cliente.
  - [ ] Passaggio di consegne e chiusura del progetto.