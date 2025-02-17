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
			throw new Error(`Failed to generate text: ${await r.text()}`);
		}

		const response = await r.json();

		// Extract the response text
		const responseText = response.text || response.answer || response.response || "";

		if (!responseText) {
			throw new Error("No response text received from the API");
		}

		return (async function* () {
			// Yield the entire response as a single token
			yield {
				token: {
					id: 1,
					text: responseText,
					logprob: 0,
					special: false,
				},
				generated_text: null,
				details: null,
			} satisfies TextGenerationStreamOutput;

			// Yield the final token with the complete text
			yield {
				token: {
					id: 2,
					text: "",
					logprob: 0,
					special: true,
				},
				generated_text: responseText,
				details: null,
			} satisfies TextGenerationStreamOutput;
		})();
	};
}
