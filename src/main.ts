import * as fs from 'node:fs/promises';
import path from 'node:path';
import inquirer from 'inquirer';
import { generateEstimateGemini, summarizeSingleEstimateGemini } from './gemini';
import { generateEstimateOpenAI, summarizeSingleEstimateOpenAI } from './openai';
import {
	cleanJsonString,
	gatherUserInputs,
	readHistoricalEstimates,
	saveToHistory,
	type UserInputs,
} from './utils';

export async function main() {
	console.log('--- Generatore di Stime di Progetto con AI ---');
	console.log(
		'Utilizza Gemini di Google Generative AI o OpenAI per creare stime accurate.\n',
	);
	console.log('Per uscire in qualsiasi momento, premi Ctrl+C.\n');

	let answers: UserInputs;
	let proceed = false;

	// Loop di conferma
	do {
		answers = await gatherUserInputs();

		console.log('\n--- Check dati AI inseriti ---');
		if (answers.llmChoice === 'gemini') {
			console.log(
				answers.geminiApiKey
					? '[OK] Chiave API Gemini fornita'
					: '[ERRORE] Chiave API Gemini mancante',
			);
			console.log(
				answers.geminiModel
					? `[OK] Modello Gemini selezionato: ${answers.geminiModel}`
					: '[ERRORE] Modello Gemini mancante',
			);
		} else {
			console.log(
				answers.chatgptApiKey
					? '[OK] Chiave API OpenAI fornita'
					: '[ERRORE] Chiave API OpenAI mancante',
			);
			console.log(
				answers.chatgptModel
					? `[OK] Modello OpenAI selezionato: ${answers.chatgptModel}`
					: '[ERRORE] Modello OpenAI mancante',
			);
		}
		console.log('-------------------------------------');

		console.log('\n--- Riepilogo dei Dati Inseriti ---');
		console.log(`LLM Selezionato: ${answers.llmChoice}`);
		console.log(`Nome Cliente: ${answers.clientName}`);
		console.log(`Stack Tecnologico: ${answers.techStack.join(', ')}`);
		console.log(`Ambito: ${answers.scope}`);
		console.log('Requisiti:');
		console.log(answers.requirements);
		console.log('Note Aggiuntive:');
		console.log(answers.notes);
		console.log('-------------------------------------\n');

		const confirmation = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'proceed',
				message:
					'I dati inseriti sono corretti? Vuoi procedere con la generazione della stima?',
				default: true,
			},
		]);

		proceed = confirmation.proceed;

		if (!proceed) {
			console.log('\nRichiesta annullata. Riprova!\n');
			console.log('Per uscire in qualsiasi momento, premi Ctrl+C.\n');
		}
	} while (!proceed);

	// Determina i parametri basati sulla scelta dell'utente
	const isGemini = answers.llmChoice === 'gemini';
	const apiKey = isGemini ? answers.geminiApiKey : (answers.chatgptApiKey as string);
	const modelUsed = isGemini ? answers.geminiModel : (answers.chatgptModel as string);
	const generateEstimate = isGemini ? generateEstimateGemini : generateEstimateOpenAI;
	const summarizeSingleEstimate = isGemini ? summarizeSingleEstimateGemini : summarizeSingleEstimateOpenAI;

	// Leggi le stime storiche prima di raccogliere gli input dell'utente
	const historicalContext = await readHistoricalEstimates(answers.scope);
	if (historicalContext.length > 0) {
		const n = historicalContext.length;
		console.log(
			`Trovat${n > 1 ? 'e' : 'a'} ${n} stim${n > 1 ? 'e' : 'a'} storiche nel file JSON. Verranno utilizzate come riferimento.`,
		);
	}

	const summarizedHistoricalContext = historicalContext;

	console.log(
		`\nRichiesta confermata. Contatto ${answers.llmChoice} per la stima... Attendi prego...`,
	);

	try {
		// Chiamata alla funzione che interroga l'AI scelta
		const markdownOutput = await generateEstimate(
			answers.techStack.join(', '),
			answers.scope,
			answers.requirements,
			answers.notes,
			summarizedHistoricalContext,
			apiKey,
			modelUsed,
		);

		console.log(
			`\nStima ricevuta da ${answers.llmChoice}. Generazione del riassunto per lo storico JSON...\n`,
		);

		// Generazione del riassunto della stima appena creata
		const summaryJsonRaw = await summarizeSingleEstimate(
			markdownOutput,
			apiKey,
			modelUsed,
		);

		try {
			// Pulizia della stringa JSON prima del parsing
			const cleanedSummary = cleanJsonString(summaryJsonRaw);
			const summaryData = JSON.parse(cleanedSummary);
			// Salvataggio nella cronologia JSON
			await saveToHistory({
				clientName: answers.clientName,
				date: new Date().toISOString(),
				stack: summaryData.stack,
				scope: summaryData.scope,
				hours: summaryData.hours,
				days: summaryData.days,
				objective: summaryData.objective,
				fullSummary: cleanedSummary,
			});
			console.log('Riassunto salvato con successo nella cronologia JSON.');
		} catch (parseError) {
			console.warn(
				'[ATTENZIONE] Errore nel parsing del riassunto JSON, salvataggio come testo grezzo.',
				parseError,
			);
			await saveToHistory({
				clientName: answers.clientName,
				date: new Date().toISOString(),
				stack: answers.techStack.join(', '),
				scope: answers.scope,
				hours: 'N/A',
				days: 'N/A',
				objective: 'N/A',
				fullSummary: summaryJsonRaw,
			});
		}

		// Sanificazione del nome del cliente per creare un nome file valido
		const safeFileName = answers.clientName
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase();
		const baseFileName = `stima_${safeFileName}`;
		let fileName = path.join(process.cwd(), `${baseFileName}.md`);
		let counter = 1;

		// Trova un nome file unico
		while (true) {
			try {
				await fs.access(fileName, fs.constants.F_OK); // Controlla se le file esiste
				// Se il file esiste, prova il prossimo nome
				fileName = path.join(process.cwd(), `${baseFileName}_${counter}.md`);
				counter++;
			} catch (_e) {
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
			`\n[ERRORE] Si è verificato un problema durante la generazione della stima con ${answers.llmChoice}:`,
		);
		console.error(error);
	}
}
