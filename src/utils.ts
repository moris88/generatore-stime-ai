import * as fs from 'node:fs/promises';
import path from 'node:path';
import inquirer from 'inquirer';
import { chatgptModels, geminiModels, scopes, techStack } from './constants';

// Interfaccia per definire la struttura dei dati raccolti
export interface UserInputs {
	clientName: string;
	techStack: string[];
	scope: 'Frontend' | 'Backend' | 'Full-stack';
	requirements: string;
	notes: string; // Nuovo campo per le note aggiuntive
	geminiApiKey: string; // Nuova chiave API Gemini
	geminiModel: string; // Nuovo modello Gemini
	llmChoice: 'gemini' | 'chatgpt'; // Scelta tra Gemini e ChatGPT
	chatgptApiKey?: string; // Chiave API ChatGPT (opzionale)
	chatgptModel?: string; // Modello ChatGPT (opzionale)
}

// Funzione per leggere le stime storiche presenti nella directory corrente
export async function readHistoricalEstimates(
	scope: 'Frontend' | 'Backend' | 'Full-stack',
): Promise<string[]> {
	const historicalEstimates: string[] = [];
	try {
		const pathDir = path.join(__dirname, scope.toLowerCase());
		if (!(await fs.stat(pathDir).catch(() => null))) {
			return historicalEstimates; // Se la cartella non esiste, ritorna l'array vuoto
		}
		const files = await fs.readdir(pathDir); // Leggi i file nella directory corrente
		const estimateFiles = files.filter(
			(file) => file.startsWith('stima_') && file.endsWith('.md'),
		);

		for (const file of estimateFiles) {
			const content = await fs.readFile(path.join(pathDir, file), {
				encoding: 'utf8',
			});
			historicalEstimates.push(content);
		}
	} catch (error) {
		// Se non riesce a leggere le stime storiche, lo segnala ma non blocca l'esecuzione
		console.warn(
			'[ATTENZIONE] Impossibile leggere alcune stime storiche (potrebbe essere dovuto a permessi o assenza di file):',
			error,
		);
	}
	return historicalEstimates;
}

// Funzione per raccogliere gli input dall'utente
export async function gatherUserInputs(): Promise<UserInputs> {
	const commonAnswers = await inquirer.prompt([
		{
			type: 'list',
			name: 'llmChoice',
			message: 'Quale LLM vuoi utilizzare?',
			choices: [
				{ name: 'Google Gemini', value: 'gemini' },
				{ name: 'OpenAI ChatGPT', value: 'chatgpt' },
			],
			default: 'gemini',
		},
		{
			type: 'password',
			name: 'geminiApiKey',
			message: 'Inserisci la tua chiave API di Google Gemini:',
			mask: '*',
			when: (answers) => answers.llmChoice === 'gemini',
			validate: (input: string) => {
				const apiKeyPattern = /^[A-Za-z0-9-_]{20,}$/;
				if (!apiKeyPattern.test(input)) {
					return 'Formato della chiave API non valido.';
				}
				return input ? true : 'La chiave API non può essere vuota.';
			},
		},
		{
			type: 'list',
			name: 'geminiModel',
			message:
				'Inserisci il modello Gemini da utilizzare (es. gemini-1.5-flash):',
			choices: geminiModels,
			default: 'gemini-2.5-flash',
			when: (answers) => answers.llmChoice === 'gemini',
			validate: (input: string) =>
				input ? true : 'Il modello Gemini non può essere vuoto.',
		},
		{
			type: 'password',
			name: 'chatgptApiKey',
			message: 'Inserisci la tua chiave API di OpenAI ChatGPT:',
			mask: '*',
			when: (answers) => answers.llmChoice === 'chatgpt',
			validate: (input: string) => {
				const apiKeyPattern = /^sk-[A-Za-z0-9-_]{32,}$/; // OpenAI API key typically starts with 'sk-'
				if (!apiKeyPattern.test(input)) {
					return 'Formato della chiave API non valido.';
				}
				return input ? true : 'La chiave API non può essere vuota.';
			},
		},
		{
			type: 'list',
			name: 'chatgptModel',
			message: 'Inserisci il modello ChatGPT da utilizzare (es. gpt-4o-mini):',
			choices: chatgptModels,
			default: 'gpt-4o-mini',
			when: (answers) => answers.llmChoice === 'chatgpt',
			validate: (input) =>
				input ? true : 'Il modello ChatGPT non può essere vuoto.',
		},
		{
			type: 'input',
			name: 'clientName',
			message: 'Nome del cliente:',
			validate: (input: string) =>
				input ? true : 'Il nome del cliente non può essere vuoto.',
		},
		{
			type: 'list',
			name: 'scope',
			message: 'Ambito del progetto:',
			choices: scopes.map((item) => ({
				name: `${item.name}·-·${item.description}`,
				value: item.value,
			})),
			validate: (input) =>
				input ? true : "L'ambito del progetto non può essere vuoto.",
		},
	]);

	const selectedScope = commonAnswers.scope;
	let filteredTechStack = [];

	if (selectedScope === 'Frontend') {
		filteredTechStack = techStack.filter(
			(item) => item.type === 'Frontend' || item.type === 'Full-stack',
		);
	} else if (selectedScope === 'Backend') {
		filteredTechStack = techStack.filter(
			(item) => item.type === 'Backend' || item.type === 'Full-stack',
		);
	} else {
		// Full-stack
		filteredTechStack = techStack;
	}

	const techStackAnswers = await inquirer.prompt([
		{
			type: 'checkbox',
			name: 'techStack',
			message: 'Stack tecnologico (seleziona una o più opzioni):',
			choices: filteredTechStack.map((item) => ({
				name: `${item.name}·-·${item.description}`,
				value: item.value,
			})),
			validate: (input) =>
				input.length > 0 ? true : 'Seleziona almeno una tecnologia.',
		},
		{
			type: 'input',
			name: 'requirements',
			message: 'Descrizione dei requisiti funzionali e tecnici del progetto:\n',
			validate: (input) =>
				input ? true : 'La descrizione dei requisiti non può essere vuota.',
		},
		{
			type: 'input',
			name: 'notes',
			message:
				'Note aggiuntive sul progetto (es. numero dev, persone nel team, informazioni contestuali, ecc...).\n',
		},
	]);

	return { ...commonAnswers, ...techStackAnswers };
}
