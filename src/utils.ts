import inquirer from 'inquirer';
import {
	anthropicModels,
	chatgptModels,
	geminiModels,
	scopes,
	techStack,
} from './constants';
import { getAllEstimates, getHistoricalEstimates, saveEstimate } from './db';

// Interfaccia per definire la struttura dei dati raccolti
export interface UserInputs {
	clientName: string;
	techStack: string[];
	scope: 'Frontend' | 'Backend' | 'Full-stack';
	requirements: string;
	notes: string; // Nuovo campo per le note aggiuntive
	geminiApiKey: string; // Nuova chiave API Gemini
	geminiModel: string; // Nuovo modello Gemini
	llmChoice: 'gemini' | 'chatgpt' | 'anthropic'; // Scelta tra Gemini, ChatGPT e Anthropic
	chatgptApiKey?: string; // Chiave API ChatGPT (opzionale)
	chatgptModel?: string; // Modello ChatGPT (opzionale)
	anthropicApiKey?: string; // Chiave API Anthropic (opzionale)
	anthropicModel?: string; // Modello Anthropic (opzionale)
}

// Interfaccia per la cronologia delle stime
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

// Funzione per salvare una nuova stima nella cronologia
export async function saveToHistory(entry: EstimateHistory) {
	saveEstimate(entry);
}

// Funzione per leggere le stime storiche presenti nel database
export async function readHistoricalEstimates(
	scope: 'Frontend' | 'Backend' | 'Full-stack',
): Promise<string[]> {
	const history = getHistoricalEstimates(scope);
	return history.map((entry) => entry.fullSummary);
}

// Funzione per mostrare la cronologia all'utente
export async function showHistory() {
	const history = getAllEstimates();

	if (history.length === 0) {
		console.log('\nNessuna stima trovata nella cronologia.\n');
		return;
	}

	console.log('\n--- Cronologia delle Stime ---');
	for (const entry of history) {
		console.log(`\nID: ${entry.id}`);
		console.log(`Cliente: ${entry.clientName}`);
		console.log(`Data: ${new Date(entry.date).toLocaleString()}`);
		console.log(`Ambito: ${entry.scope}`);
		console.log(`Stack: ${entry.stack}`);
		console.log(`Sforzo: ${entry.hours} ore (${entry.days} giorni)`);
		console.log(`Obiettivo: ${entry.objective}`);
		console.log('------------------------------');
	}

	const { action } = await inquirer.prompt([
		{
			type: 'list',
			name: 'action',
			message: 'Cosa vuoi fare?',
			choices: [
				{ name: 'Torna al menu principale', value: 'back' },
				{ name: 'Visualizza riassunto completo di una stima', value: 'view' },
			],
		},
	]);

	if (action === 'view') {
		const { id } = await inquirer.prompt([
			{
				type: 'input',
				name: 'id',
				message: "Inserisci l'ID della stima da visualizzare:",
				validate: (input) => {
					const id = Number.parseInt(input, 10);
					return history.some((e) => e.id === id) ? true : 'ID non valido.';
				},
			},
		]);

		const selected = history.find((e) => e.id === Number.parseInt(id, 10));
		if (selected) {
			console.log('\n--- Riassunto Completo ---');
			console.log(selected.fullSummary);
			console.log('\n--------------------------');
			await inquirer.prompt([
				{
					type: 'input',
					name: 'continue',
					message: 'Premi invio per continuare...',
				},
			]);
		}
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
				{ name: 'Anthropic Claude', value: 'anthropic' },
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
			type: 'password',
			name: 'anthropicApiKey',
			message: 'Inserisci la tua chiave API di Anthropic Claude:',
			mask: '*',
			when: (answers) => answers.llmChoice === 'anthropic',
			validate: (input: string) => {
				const apiKeyPattern = /^sk-ant-[A-Za-z0-9-_]{32,}$/;
				if (!apiKeyPattern.test(input)) {
					return 'Formato della chiave API non valido.';
				}
				return input ? true : 'La chiave API non può essere vuota.';
			},
		},
		{
			type: 'list',
			name: 'anthropicModel',
			message:
				'Inserisci il modello Claude da utilizzare (es. claude-3-5-sonnet-latest):',
			choices: anthropicModels,
			default: 'claude-3-5-sonnet-latest',
			when: (answers) => answers.llmChoice === 'anthropic',
			validate: (input) =>
				input ? true : 'Il modello Claude non può essere vuoto.',
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
