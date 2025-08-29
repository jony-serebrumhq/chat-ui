import { z } from "zod";
import type { Endpoint } from "../endpoints";
import type { TextGenerationStreamOutput } from "@huggingface/inference";

export const endpointCustomParametersSchema = z.object({
	type: z.literal("custom"),
	url: z.string().url(),
	apiKey: z.string().optional(),
	weight: z.number().int().positive().default(1),
	model: z.any(),
});

export function endpointCustom(input: z.input<typeof endpointCustomParametersSchema>): Endpoint {
	const { url, apiKey } = endpointCustomParametersSchema.parse(input);

	return async ({ messages, conversationId }) => {
		// Format the messages into a question string

		const lastMessage = messages[messages.length - 1];
		const question = lastMessage.content;

		// Prepare the request body for Flowise
		const r = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
			},
			body: JSON.stringify({
				// Optional: Include chat history if needed
				// history: messages.slice(0, -1).map(msg => ({
				//   role: msg.from,
				//   content: msg.content
				// })),
				question,
				overrideConfig: {
					sessionId: conversationId,
				},
			}),
		});

		if (!r.ok) {
			const bodyText = await r.text().catch(() => "");
			throw new Error(
				`Failed to generate text: ${r.status} ${r.statusText} for ${url}\n${bodyText}\n`
			);
		}

		const response = await r.json();

		// Extract the response text
		const responseText = response.text || response.answer || response.response || "";

		if (!responseText) {
			throw new Error("No response text received from the API");
		}

		return (async function* () {
			// Simulate streaming by breaking the response into chunks
			// This will make the UI display the text as if it's being streamed
			const chunkSize = 1; // Adjust this value to control streaming speed
			let tokenId = 0;
			let generatedText = "";

			// Split the text into words to make the streaming more natural
			const words = responseText.split(/(\s+)/);

			for (let i = 0; i < words.length; i += chunkSize) {
				// Get a chunk of words
				const chunk = words.slice(i, i + chunkSize).join("");
				generatedText += chunk;

				// Yield each chunk as a separate token
				yield {
					token: {
						id: tokenId++,
						text: chunk,
						logprob: 0,
						special: false,
					},
					generated_text: null,
					details: null,
				} satisfies TextGenerationStreamOutput;

				// Add a small delay to simulate real-time streaming
				await new Promise((resolve) => setTimeout(resolve, 10));
			}

			// Yield the final token with the complete text
			yield {
				token: {
					id: tokenId,
					text: "",
					logprob: 0,
					special: true,
				},
				generated_text: generatedText,
				details: null,
			} satisfies TextGenerationStreamOutput;
		})();
	};
}
