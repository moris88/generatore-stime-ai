import Anthropic from '@anthropic-ai/sdk';
import { createPrompt, createSingleEstimateSummaryPrompt } from './prompt';

export async function generateEstimateAnthropic(
	techStack: string,
	scope: 'Frontend' | 'Backend' | 'Full-stack',
	requirements: string,
	notes: string,
	summarizedHistoricalContext: string[],
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const anthropic = new Anthropic({ apiKey });
	const prompt = createPrompt(
		techStack,
		scope,
		requirements,
		notes,
		summarizedHistoricalContext,
	);

	const response = await anthropic.messages.create({
		model: modelUsed,
		max_tokens: 4096,
		messages: [{ role: 'user', content: prompt }],
	});

	const content = response.content[0];
	if (content.type === 'text') {
		return content.text;
	}
	throw new Error('Unexpected response format from Anthropic');
}

export async function summarizeSingleEstimateAnthropic(
	estimate: string,
	apiKey: string,
	modelUsed: string,
): Promise<string> {
	const anthropic = new Anthropic({ apiKey });
	const prompt = createSingleEstimateSummaryPrompt(estimate);

	const response = await anthropic.messages.create({
		model: modelUsed,
		max_tokens: 1024,
		messages: [{ role: 'user', content: prompt }],
	});

	const content = response.content[0];
	if (content.type === 'text') {
		return content.text;
	}
	throw new Error('Unexpected response format from Anthropic');
}
