import * as fs from "fs/promises";
import { generateEstimate, summarizeHistoricalEstimates } from "./gemini";
import { gatherUserInputs, readHistoricalEstimates, UserInputs } from "./utils";
import inquirer from "inquirer";
import path from "node:path";

export async function main() {
  console.log("--- Generatore di Stime di Progetto con AI ---");
  console.log(
    "Utilizza Gemini di Google Generative AI per creare stime accurate.\n",
  );
  console.log("Per uscire in qualsiasi momento, premi Ctrl+C.\n");

  let answers: UserInputs;
  let proceed = false;

  // Loop di conferma
  do {
    answers = await gatherUserInputs();

    console.log("\n--- Check dati AI inseriti ---");
    console.log(
      answers.geminiApiKey
        ? "[OK] Chiave API Gemini fornita"
        : "[ERRORE] Chiave API Gemini mancante",
    );
    console.log(
      answers.geminiModel
        ? `[OK] Modello Gemini selezionato: ${answers.geminiModel}`
        : "[ERRORE] Modello Gemini mancante",
    );
    console.log("-------------------------------------");

    console.log("\n--- Riepilogo dei Dati Inseriti ---");
    console.log(`Nome Cliente: ${answers.clientName}`);
    console.log(`Stack Tecnologico: ${answers.techStack.join(", ")}`);
    console.log(`Ambito: ${answers.scope}`);
    console.log("Requisiti:");
    console.log(answers.requirements);
    console.log("Note Aggiuntive:");
    console.log(answers.notes);
    console.log("-------------------------------------\n");

    const confirmation = await inquirer.prompt([
      {
        type: "confirm",
        name: "proceed",
        message:
          "I dati inseriti sono corretti? Vuoi procedere con la generazione della stima?",
        default: true,
      },
    ]);

    proceed = confirmation.proceed;

    if (!proceed) {
      console.log("\nRichiesta annullata. Riprova!\n");
      console.log("Per uscire in qualsiasi momento, premi Ctrl+C.\n");
    }
  } while (!proceed);

  // Leggi le stime storiche prima di raccogliere gli input dell'utente
  const historicalContext = await readHistoricalEstimates(answers.scope);
  if (historicalContext.length > 0) {
    console.log(
      `Trovate ${historicalContext.length} stime storiche. Verranno utilizzate come riferimento per migliorare la precisione.`,
    );
  }

  let summarizedHistoricalContext: string[] = [];
  if (historicalContext.length > 0) {
    console.log(
      `Riassumendo le stime storiche rilevanti per l'ambito scelto (${answers.scope})... Attendi prego...`,
    );
    summarizedHistoricalContext = await summarizeHistoricalEstimates(
      historicalContext,
      answers.geminiApiKey,
      answers.geminiModel,
    );
    console.log("\nSintesi delle stime storiche completata.");
    if (summarizedHistoricalContext.length > 0) {
      console.log(
        `Riassunte ${summarizedHistoricalContext.length} stime storiche.`,
      );
    } else {
      console.log(
        "Nessuna stima storica rilevante trovata o riassunta per l'ambito scelto.",
      );
    }
  }

  console.log(
    "\nRichiesta confermata. Contatto l'AI per la stima... Attendi prego...",
  );

  try {
    // Chiamata alla funzione che interroga Gemini, passando il contesto storico RIASSUNTO
    const markdownOutput = await generateEstimate(
      answers.techStack.join(", "),
      answers.scope,
      answers.requirements,
      answers.notes,
      summarizedHistoricalContext, // Passiamo il contesto storico RIASSUNTO
      answers.geminiApiKey, // Passiamo la chiave API dal prompt
      answers.geminiModel, // Passiamo il modello dal prompt
    );

    console.log("\nStima ricevuta. Creazione del file in corso...\n");

    // Creazione della cartella per l'ambito se non esiste
    const pathDir = path.join(__dirname, answers.scope.toLowerCase());
    if (!(await fs.stat(pathDir).catch(() => null))) {
      await fs.mkdir(pathDir);
    }

    // Sanificazione del nome del cliente per creare un nome file valido
    const safeFileName = answers.clientName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    let baseFileName = `stima_${safeFileName}`;
    let fileName = `${pathDir}/${baseFileName}.md`;
    let counter = 1;

    // Trova un nome file unico
    while (true) {
      try {
        await fs.access(fileName, fs.constants.F_OK); // Controlla se il file esiste
        // Se il file esiste, prova il prossimo nome
        fileName = `${baseFileName}_${counter}.md`;
        counter++;
      } catch (e) {
        // Se il file non esiste (errore), allora il nome è unico
        break;
      }
    }

    // Scrittura del file Markdown
    await fs.writeFile(fileName, markdownOutput);

    console.log(
      `\nStima completata con successo! Il file è stato salvato come: ${fileName}`,
    );
  } catch (error) {
    console.error(
      "\n[ERRORE] Si è verificato un problema durante la generazione della stima:",
    );
    console.error(error);
  }
}
