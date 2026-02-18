import OpenAI from 'openai';
import { createPrompt, createSingleEstimateSummaryPrompt } from './prompt';

// Funzione per generare un riassunto conciso di una singola stima con OpenAI
export async function summarizeSingleEstimateOpenAI(
	estimate: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const openai = new OpenAI({ apiKey });

	const prompt = createSingleEstimateSummaryPrompt(estimate);

	try {
		const response = await openai.chat.completions.create({
			model: modelUsed,
			messages: [{ role: 'user', content: prompt }],
		});
		return response.choices[0]?.message?.content?.trim() || '';
	} catch (error) {
		console.error(
			'Errore durante la generazione del riassunto della stima (OpenAI):',
			error,
		);
		throw error;
	}
}

// Funzione per generare la stima utilizzando il modello OpenAI
export async function generateEstimateOpenAI(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	historicalContext: string[],
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const openai = new OpenAI({ apiKey });

	const prompt = createPrompt(
		techStack,
		scope,
		requirements,
		notes,
		historicalContext,
	);

	try {
		const response = await openai.chat.completions.create({
			model: modelUsed,
			messages: [{ role: 'user', content: prompt }],
		});
		return response.choices[0]?.message?.content?.trim() || '';
	} catch (error) {
		console.error('Errore durante la generazione della stima (OpenAI):', error);
		throw error;
	}
}
