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

// Interfaccia per la cronologia delle stime nel file JSON
export interface EstimateHistory {
	clientName: string;
	date: string;
	stack: string;
	scope: string;
	hours: string;
	days: string;
	objective: string;
	fullSummary: string;
}

const HISTORY_FILE = path.join(process.cwd(), 'stima_history.json');

// Funzione per salvare una nuova stima nella cronologia JSON
export async function saveToHistory(entry: EstimateHistory) {
	let history: EstimateHistory[] = [];
	try {
		const data = await fs.readFile(HISTORY_FILE, 'utf8');
		history = JSON.parse(data);
	} catch (_error) {
		// Se il file non esiste, iniziamo con un array vuoto
	}

	history.push(entry);

	await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
}

// Funzione per leggere le stime storiche presenti nel file JSON (esclusivo)
export async function readHistoricalEstimates(
	scope: 'Frontend' | 'Backend' | 'Full-stack',
): Promise<string[]> {
	// Preleva esclusivamente dallo storico JSON generato alla fine di ogni stima
	try {
		const data = await fs.readFile(HISTORY_FILE, 'utf8');
		const history: EstimateHistory[] = JSON.parse(data);
		return history
			.filter((entry) => entry.scope === scope)
			.map((entry) => entry.fullSummary);
	} catch (_error) {
		return [];
	}
}

// Funzione per pulire una stringa JSON che potrebbe contenere blocchi di codice Markdown
export function cleanJsonString(jsonString: string): string {
	return jsonString
		.replace(/```json\n?/g, '') // Rimuove l'apertura ```json
		.replace(/```\n?/g, '') // Rimuove la chiusura ```
		.trim();
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
