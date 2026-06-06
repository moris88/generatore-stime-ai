import { constants } from 'node:fs';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import inquirer from 'inquirer';
import {
	generateEstimateAnthropic,
	summarizeSingleEstimateAnthropic,
} from './anthropic';
import { migrateFromJson } from './db';
import {
	generateEstimateGemini,
	summarizeSingleEstimateGemini,
} from './gemini';
import {
	generateEstimateOpenAI,
	summarizeSingleEstimateOpenAI,
} from './openai';
import {
	cleanJsonString,
	gatherUserInputs,
	readHistoricalEstimates,
	saveToHistory,
	showHistory,
	type UserInputs,
} from './utils';

export async function main() {
	console.log('--- Generatore di Stime di Progetto con AI ---');
	console.log(
		'Utilizza Gemini di Google Generative AI o OpenAI per creare stime accurate.\n',
	);

	// Esegui migrazione se necessario
	await migrateFromJson();

	while (true) {
		const { action } = await inquirer.prompt([
			{
				type: 'list',
				name: 'action',
				message: 'Cosa vuoi fare?',
				choices: [
					{ name: 'Crea una Nuova Stima', value: 'new' },
					{ name: 'Visualizza Storico Stime (Database)', value: 'history' },
					{ name: 'Esci', value: 'exit' },
				],
			},
		]);

		if (action === 'new') {
			await createNewEstimate();
		} else if (action === 'history') {
			await showHistory();
		} else {
			console.log('Arrivederci!');
			process.exit(0);
		}
	}
}

async function createNewEstimate() {
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
		} else if (answers.llmChoice === 'chatgpt') {
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
		} else if (answers.llmChoice === 'anthropic') {
			console.log(
				answers.anthropicApiKey
					? '[OK] Chiave API Anthropic fornita'
					: '[ERRORE] Chiave API Anthropic mancante',
			);
			console.log(
				answers.anthropicModel
					? `[OK] Modello Anthropic selezionato: ${answers.anthropicModel}`
					: '[ERRORE] Modello Anthropic mancante',
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
	const choice = answers.llmChoice;
	let apiKey: string;
	let modelUsed: string;
	let generateEstimate: (
		techStack: string,
		scope: 'Frontend' | 'Backend' | 'Full-stack',
		requirements: string,
		notes: string,
		summarizedHistoricalContext: string[],
		apiKey: string,
		modelUsed: string,
	) => Promise<string>;
	let summarizeSingleEstimate: (
		estimate: string,
		apiKey: string,
		modelUsed: string,
	) => Promise<string>;

	if (choice === 'gemini') {
		apiKey = answers.geminiApiKey;
		modelUsed = answers.geminiModel;
		generateEstimate = generateEstimateGemini;
		summarizeSingleEstimate = summarizeSingleEstimateGemini;
	} else if (choice === 'chatgpt') {
		apiKey = answers.chatgptApiKey as string;
		modelUsed = answers.chatgptModel as string;
		generateEstimate = generateEstimateOpenAI;
		summarizeSingleEstimate = summarizeSingleEstimateOpenAI;
	} else {
		// anthropic
		apiKey = answers.anthropicApiKey as string;
		modelUsed = answers.anthropicModel as string;
		generateEstimate = generateEstimateAnthropic;
		summarizeSingleEstimate = summarizeSingleEstimateAnthropic;
	}

	// Leggi le stime storiche prima di raccogliere gli input dell'utente
	const historicalContext = await readHistoricalEstimates(answers.scope);
	if (historicalContext.length > 0) {
		const n = historicalContext.length;
		console.log(
			`Trovat${n > 1 ? 'e' : 'a'} ${n} stim${n > 1 ? 'e' : 'a'} storiche nel database. Verranno utilizzate come riferimento.`,
		);
	}

	const summarizedHistoricalContext = historicalContext;

	console.log(
		`\nRichiesta confermata. Contatto ${answers.llmChoice} per la stima... Attendi prego...`,
	);

	try {
		// Chiamata alla funzione che interroga l'AI scelta
		const fullAiOutput = await generateEstimate(
			answers.techStack.join(', '),
			answers.scope,
			answers.requirements,
			answers.notes,
			summarizedHistoricalContext,
			apiKey,
			modelUsed,
		);

		// Separa la stima dagli sprint
		const parts = fullAiOutput.split('---SEPARATOR---');
		const markdownOutput = parts[0].trim();
		const sprintsOutput = parts[1] ? parts[1].trim() : '';

		console.log(
			`\nStima ricevuta da ${answers.llmChoice}. Generazione del riassunto per lo storico...\n`,
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
			// Salvataggio nella cronologia
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
			console.log('Riassunto salvato con successo nel database.');
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

		let estimateFileName = path.join(process.cwd(), `stima_${safeFileName}.md`);
		let sprintsFileName = path.join(
			process.cwd(),
			`sprints_${safeFileName}.md`,
		);
		let counter = 1;

		// Trova un nome file unico (basato sulla stima principale)
		while (true) {
			try {
				await fs.access(estimateFileName, constants.F_OK);
				// Se il file esiste, prova il prossimo nome per entrambi
				estimateFileName = path.join(
					process.cwd(),
					`stima_${safeFileName}_${counter}.md`,
				);
				sprintsFileName = path.join(
					process.cwd(),
					`sprints_${safeFileName}_${counter}.md`,
				);
				counter++;
			} catch (_e) {
				break;
			}
		}

		// Scrittura dei file Markdown
		await fs.writeFile(estimateFileName, markdownOutput);
		if (sprintsOutput) {
			await fs.writeFile(sprintsFileName, sprintsOutput);
		}

		console.log('\nStima completata con successo!');
		console.log(`File stima: ${estimateFileName}`);
		if (sprintsOutput) {
			console.log(`File sprint: ${sprintsFileName}`);
		}
	} catch (error) {
		console.error(
			`\n[ERRORE] Si è verificato un problema durante la generazione della stima con ${answers.llmChoice}:`,
		);
		console.error(error);
	}
}
