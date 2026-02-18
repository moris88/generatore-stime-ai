import { GoogleGenerativeAI } from '@google/generative-ai';
import { createPrompt, createSingleEstimateSummaryPrompt } from './prompt';

// Funzione per generare un riassunto conciso di una singola stima
export async function summarizeSingleEstimateGemini(
	estimate: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const genAI = new GoogleGenerativeAI(apiKey);
	const model = genAI.getGenerativeModel({ model: modelUsed });

	const prompt = createSingleEstimateSummaryPrompt(estimate);

	try {
		const result = await model.generateContent(prompt);
		const response = result.response;
		return response.text().trim();
	} catch (error) {
		console.error(
			'Errore durante la generazione del riassunto della stima:',
			error,
		);
		throw error;
	}
}

// Funzione per generare la stima utilizzando il modello Gemini
export async function generateEstimateGemini(
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
