import { GoogleGenerativeAI } from '@google/generative-ai';
import { createHistoricalEstimatesPrompt, createPrompt } from './prompt';

// Funzione per riassumere le stime storiche filtrate per ambito
export async function summarizeHistoricalEstimates(
	historicalEstimates: string[],
	apiKey: string,
	modelUsed: string,
): Promise<string[]> {
	if (historicalEstimates.length === 0) {
		return [];
	}

	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: modelUsed });

	const summaryPrompts = createHistoricalEstimatesPrompt(historicalEstimates);

	const summaries: string[] = [];
	try {
		const result = await model.generateContent(summaryPrompts);
		const response = result.response;
		summaries.push(response.text().trim());
	} catch (error) {
		console.error(
			'Errore durante la generazione del riassunto di una stima storica:',
			error,
		);
		// Continua anche se un riassunto fallisce
	}

	return summaries;
}

// Funzione per generare la stima utilizzando il modello Gemini
export async function generateEstimate(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string, // Nuovo parametro per le note aggiuntive
	historicalContext: string[], // Nuovo parametro per il contesto storico
	apiKey: string, // Chiave API passata come parametro
	modelUsed: string, // Modello passato come parametro
): Promise<string> {
	// Inizializza il client di Google Generative AI
	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: modelUsed });

	// Costruisce il prompt finale sostituendo i placeholder
	const prompt = createPrompt(
		techStack,
		scope,
		requirements,
		notes,
		historicalContext,
	);

	// Invia il prompt al modello e attende la risposta
	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		const text = response.text().trim();
		return text;
	} catch (error) {
		console.error('Errore durante la generazione della stima:', error);
		throw error; // Re-throw the error after logging
	}
}
