import { z } from "zod";
import type { Endpoint } from "../endpoints";
import type { TextGenerationStreamOutput } from "@huggingface/inference";
import { OpenAI } from "openai";

export const endpointSupplementFlowParametersSchema = z.object({
	type: z.literal("supplementFlow"),
	openaiApiKey: z.string(),
	weight: z.number().int().positive().default(1),
	model: z.any(),
	vectorStoreId: z.string(),
});

// Define a type for the structured health information
interface HealthInformation {
	primaryHealthGoal: string;
	secondaryHealthGoal: string;
	gender: string;
	age: number;
	height: string;
	weight: string;
	allergiesIntolerances: string[];
	healthConditions: string[];
	symptoms: string[];
	medications: string;
	exerciseFrequency: string;
	exerciseTypes: string[];
	priceRange: string;
	ingredientPreference: string;
	plantBasedPreference: string;
	additionalInfo?: string;
}

// Define types for our data structures
interface NutraceuticalRecommendation {
	nutraceutical_name: string;
	reason_for_recommendation: string;
	benefits: string;
	interactions_with_users_medications: string;
	best_time_to_take: string;
	user_gender: string;
}

interface EducationalVideo {
	nutraceutical_name: string;
	video_link: string;
}

interface ProductRecommendation {
	product_name: string;
	image: string;
	description: string;
	price: string;
	product_link: string;
}

export function endpointSupplementFlow(
	input: z.input<typeof endpointSupplementFlowParametersSchema>
): Endpoint {
	const { openaiApiKey, vectorStoreId } = endpointSupplementFlowParametersSchema.parse(input);

	// Initialize OpenAI client
	const openai = new OpenAI({
		apiKey: openaiApiKey,
	});

	const tools = [
		{
			type: "function",
			name: "getAllRecommendations",
			description:
				"Provides nutraceuticals, products and educational vidoes recommendations as per user's profile.",
			parameters: {
				type: "object",
				properties: {
					primaryHealthGoal: {
						type: "string",
						description: "The user's main health goal",
						enum: [
							"Weight loss",
							"Muscle gain",
							"Improved energy",
							"Boosted immunity",
							"Better sleep",
							"Enhanced focus and mental clarity",
							"Healthy aging",
						],
					},
					secondaryHealthGoal: {
						type: "string",
						description: "The user's secondary health goal",
						enum: [
							"Weight loss",
							"Muscle gain",
							"Improved energy",
							"Boosted immunity",
							"Better sleep",
							"Enhanced focus and mental clarity",
							"Healthy aging",
						],
					},
					gender: {
						type: "string",
						description: "The user's gender",
						enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
					},
					age: {
						type: "number",
						description: "The user's age",
					},
					height: {
						type: "string",
						description: "The user's height",
					},
					weight: {
						type: "string",
						description: "The user's weight range in pounds",
					},
					allergiesIntolerances: {
						type: "array",
						description: "List of user's allergies and intolerances",
						items: {
							type: "string",
						},
					},
					healthConditions: {
						type: "array",
						description: "List of user's health conditions",
						items: {
							type: "string",
						},
					},
					symptoms: {
						type: "array",
						description: "List of symptoms the user experiences",
						items: {
							type: "string",
						},
					},
					medications: {
						type: "string",
						description: "Medications the user is currently taking",
					},
					// exerciseFrequency: {
					// 	type: "string",
					// 	description: "How often the user exercises",
					// 	enum: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week"],
					// },
					// exerciseTypes: {
					// 	type: "array",
					// 	description: "Types of exercise the user does",
					// 	items: {
					// 		type: "string",
					// 	},
					// },
					// priceRange: {
					// 	type: "string",
					// 	description: "User's preferred price range for supplements",
					// 	enum: ["10$-20$", "20$-40$", "40$+", "No limit"],
					// },
					// ingredientPreference: {
					// 	type: "string",
					// 	description: "User's preference for supplement ingredients",
					// 	enum: ["Minimal", "Extensive"],
					// },
					// plantBasedPreference: {
					// 	type: "string",
					// 	description: "User's preference for plant-based supplements",
					// 	enum: ["Yes", "No", "No Preference"],
					// },
					additionalInfo: {
						type: "string",
						description: "Any additional information provided by the user",
					},
				},
				required: [
					"primaryHealthGoal",
					"secondaryHealthGoal",
					"gender",
					"age",
					"height",
					"weight",
					"allergiesIntolerances",
					"healthConditions",
					"symptoms",
					"medications",
					// "exerciseFrequency",
					// "exerciseTypes",
					// "priceRange",
					// "ingredientPreference",
					// "plantBasedPreference",
					"additionalInfo",
				],
				additionalProperties: false,
			},
			strict: true,
		},
		// {
		// 	"type": "function",
		// 	"name": "getYoutubeVideos",
		// 	"description": "Searches for educational YouTube videos about a specific supplement.",
		// 	"parameters": {
		// 			"type": "object",
		// 			"properties": {
		// 				"supplement": {
		// 					"type": "string",
		// 					"description": "The name of the supplement to search videos for"
		// 				}
		// 			},
		// 			"required": ["supplement"],
		// 			"additionalProperties": false
		// 	},
		// 	"strict": true
		// },
		// {
		// 	"type": "function",
		// 	"name": "getProductsRecommendations",
		// 	"description": "Provides product recommendations for a specific supplement appropriate for the user's gender.",
		// 	"parameters": {
		// 			"type": "object",
		// 			"properties": {
		// 				"supplement": {
		// 					"type": "string",
		// 					"description": "The name of the supplement to find products for"
		// 				},
		// 				"gender": {
		// 					"type": "string",
		// 					"description": "The user's gender for gender-appropriate recommendations",
		// 					"enum": ["Male", "Female", "Non-binary", "Prefer not to say"]
		// 				}
		// 			},
		// 			"required": ["supplement", "gender"],
		// 			"additionalProperties": false
		// 	},
		// 	"strict": true
		// 	}
	];

	function formatHealthInfoForPrompt(healthInfo: HealthInformation): string {
		// Format array values, using 'None' if the array only contains 'None'
		const formatArray = (arr: string[]): string => {
			return arr.includes("None") ? "None" : arr.join(", ");
		};

		return `
	  HEALTH GOALS
	  Primary Health Goal= ${healthInfo.primaryHealthGoal}
	  Secondary Health Goal= ${healthInfo.secondaryHealthGoal}
	  
	  GENERAL INFORMATION
	  Gender= ${healthInfo.gender}
	  Age= ${healthInfo.age}
	  Height= ${healthInfo.height}
	  Weight= ${healthInfo.weight} lb
	  
	  MEDICAL AND HEALTH CONDITIONS
	  Allergies/Intolerances= ${formatArray(healthInfo.allergiesIntolerances)}
	  Existing Health Conditions= ${formatArray(healthInfo.healthConditions)}
	  Symptoms Experienced= ${formatArray(healthInfo.symptoms)}
	  Current Medications= ${healthInfo.medications || "None"}
	  
	  ADDITIONAL INFORMATION
	  ${healthInfo.additionalInfo || "None"}`;
	}

	// Nutraceutical Consultant Agent
	async function getNutraceuticals(
		healthInfo: HealthInformation
	): Promise<NutraceuticalRecommendation[]> {
		try {
			const formattedHealthInfo = formatHealthInfoForPrompt(healthInfo);
			const response = await openai.responses.create({
				model: "gpt-4o",
				input: [
					{
						role: "system",
						content: [
							{
								type: "input_text",
								text: "You are a knowledgeable supplement advisor. Based solely on the user’s profile — and only recommending supplements appropriate for their gender — suggest the **five best** supplements, ranked most → least important. Respond strictly in JSON format.",
							},
						],
					},
					{
						role: "user",
						content: [
							{
								type: "input_text",
								text: formattedHealthInfo,
							},
						],
					},
				],
				text: {
					format: {
						name: "NutraceuticalResponseFormat",
						type: "json_schema",
						schema: {
							type: "object",
							additionalProperties: false,
							properties: {
								nutraceutical_recommendations: {
									type: "array",
									items: {
										type: "object",
										additionalProperties: false,
										properties: {
											nutraceutical_name: { type: "string" },
											reason_for_recommendation: { type: "string" },
											benefits: { type: "string" },
											interactions_with_users_medications: { type: "string" },
											best_time_to_take: { type: "string" },
											user_gender: { type: "string" },
										},
										required: [
											"nutraceutical_name",
											"reason_for_recommendation",
											"benefits",
											"interactions_with_users_medications",
											"best_time_to_take",
											"user_gender",
										],
									},
								},
							},
							required: ["nutraceutical_recommendations"],
						},
					},
				},
			});
			// Parse the JSON response correctly
			const parsedResponse = JSON.parse(response.output_text);
			return parsedResponse.nutraceutical_recommendations; // Return the entire parsed array
		} catch (error) {
			console.error("Error in nutraceutical consultant:", error);
			return [];
		}
	}

	// YouTube Video Search Agent
	async function getYoutubeVideos(supplement: string): Promise<EducationalVideo[]> {
		try {
			const response = await openai.responses.create({
				model: "gpt-4o",
				tools: [{ type: "web_search_preview" }],
				tool_choice: { type: "web_search_preview" },
				input: [
					{
						role: "system",
						content: `Use the web search tool and find an educational YouTube video about ${supplement}. Provide the nutraceutical name and video link in JSON format.`,
					},
				],
				text: {
					format: {
						name: "EducationalResponseFormat",
						type: "json_schema",
						schema: {
							type: "object",
							additionalProperties: false,
							properties: {
								educational_videos: {
									type: "array",
									items: {
										type: "object",
										additionalProperties: false,
										properties: {
											nutraceutical_name: { type: "string" },
											video_link: { type: "string" },
										},
										required: ["nutraceutical_name", "video_link"],
									},
								},
							},
							required: ["educational_videos"],
						},
					},
				},
			});

			// Parse the JSON response correctly
			const parsedResponse = JSON.parse(response.output_text);
			return parsedResponse.educational_videos; // Return the entire parsed array
		} catch (error) {
			console.error("Error in YouTube video search:", error);
			return [];
		}
	}

	// Product Consultant Agent
	async function getProductsRecommendations(
		supplement: string,
		gender: string
	): Promise<ProductRecommendation[]> {
		try {
			const response = await openai.responses.create({
				model: "gpt-4o",
				tools: [
					{
						type: "file_search",
						vector_store_ids: [vectorStoreId],
					},
				],
				input: [
					{
						role: "system",
						content: `You are a Product Consultant with access to a product catalog. Recommend a product that matches the nutraceutical supplement ${supplement} and is appropriate for the gender ${gender}. Include product name, image URL, description, and price. Respond strictly in JSON format.`,
					},
				],
				text: {
					format: {
						name: "ProductResponseFormat",
						type: "json_schema",
						schema: {
							type: "object",
							additionalProperties: false,
							properties: {
								product_recommendations: {
									type: "array",
									items: {
										type: "object",
										additionalProperties: false,
										properties: {
											product_name: { type: "string" },
											image: { type: "string" },
											description: { type: "string" },
											price: { type: "string" },
											product_link: { type: "string" },
										},
										required: ["product_name", "image", "description", "price", "product_link"],
									},
								},
							},
							required: ["product_recommendations"],
						},
					},
				},
			});

			// Parse the JSON response correctly
			const parsedResponse = JSON.parse(response.output_text);
			return parsedResponse.product_recommendations; // Return the entire parsed array
		} catch (error) {
			console.error("Error in product consultant:", error);
			return [];
		}
	}

	return async ({ messages }) => {
		// Get the last 20 messages (or all messages if less than 20)
		const contextMessages = messages.slice(Math.max(0, messages.length - 20));

		const input = [
			{
				role: "system",
				content: `
You are a knowledgeable health advisor. Your job is to assist users in discovering health supplements tailored to their goals and preferences.

#Flow:
Accept the user's input on their health goals, concerns, or symptoms.
Assess whether enough information is provided to recommend supplements: 
- If yes, call the getAllRecommendations tool with the user's details.
- If no, ask polite follow-up questions to collect the needed info.

#IMPORTANT Response Rule After Tool Call:
When you receive the tool output from getAllRecommendations, you MUST DO THE FOLLOWING:
- Prefix the output with the friendly line. 
- Then immediately follow it with the raw output received from tool getAllRecommendations inside a code block.
    Example: { ...exact JSON output received from getAllRecommendations tool... }
    Note: Do not add any other text or formatting to the output from the getAllRecommendations tool.

#Close your message with a thoughtful question to help users achieve their health goals.

#Maintain a warm, supportive tone throughout the interaction, but strictly follow the format and output instructions above.
`,
			},
		];

		// Get the last message content as the user's health information
		// const lastMessage = messages[messages.length - 1];
		// const userHealthInfo = lastMessage.content;

		// Convert contextMessages into the format requested
		contextMessages.forEach((msg) => {
			input.push({
				role: msg.from === "user" ? "user" : "assistant",
				content: msg.content,
			});
		});

		try {
			const response = await openai.responses.create({
				model: "gpt-4o",
				tools,
				input,
			});

			let toolUsed = false;
			for (const toolCall of response.output) {
				if (toolCall.type !== "function_call") {
					continue;
				}

				if (toolCall.name === "getAllRecommendations") {
					// Parse the function arguments
					const functionArgs: HealthInformation = JSON.parse(toolCall.arguments);
					console.log("getAllRecommendations", functionArgs);

					// Call the function
					const result = await getAllRecommendations(functionArgs);

					console.log("result", result);

					input.push(toolCall);

					input.push({
						type: "function_call_output",
						call_id: toolCall.call_id,
						output: result.toString(),
					});

					toolUsed = true;
				}

				console.log("toolUsed", toolUsed);

				if (toolUsed) {
					// Send the function result back to the model
					const finalResponse = await openai.responses.create({
						model: "gpt-4o",
						input,
						tools,
					});
					response.output_text = finalResponse.output_text;
				}
			}

			// Step 1: Get supplement recommendations
			// const supplementRecommendations = await getNutraceuticals(conversationHistory);

			// if (supplementRecommendations.length === 0) {
			// 	const noRecommendationsMessage =
			// 		"I couldn't find any specific supplement recommendations based on the information provided. Could you please share more details about your health concerns?";

			// 	return (async function* () {
			// 		yield {
			// 			token: {
			// 				id: 0,
			// 				text: noRecommendationsMessage,
			// 				logprob: 0,
			// 				special: false,
			// 			},
			// 			generated_text: null,
			// 			details: null,
			// 		} satisfies TextGenerationStreamOutput;

			// 		yield {
			// 			token: {
			// 				id: 1,
			// 				text: "",
			// 				logprob: 0,
			// 				special: true,
			// 			},
			// 			generated_text: noRecommendationsMessage,
			// 			details: null,
			// 		} satisfies TextGenerationStreamOutput;
			// 	})();
			// }

			// // Arrays to store each type of recommendation
			// let productRecommendationsArray: ProductRecommendation[] = [];
			// const nutraceuticalRecommendationsArray = [...supplementRecommendations];
			// let educationalVideosArray: EducationalVideo[] = [];

			// // Step 2: Get educational videos and product recommendations for each supplement
			// // We use Promise.all to run these requests in parallel
			// await Promise.all(
			// 	supplementRecommendations.map(async (supplement: NutraceuticalRecommendation) => {
			// 		// Get videos for this supplement
			// 		const videos = await getYoutubeVideos(supplement.nutraceutical_name);

			// 		if (videos && videos.length > 0) {
			// 			educationalVideosArray = educationalVideosArray.concat(videos);
			// 		}

			// 		// Get products for this supplement
			// 		const products = await getProductsRecommendations(
			// 			supplement.nutraceutical_name,
			// 			supplement.user_gender
			// 		);
			// 		if (products && products.length > 0) {
			// 			productRecommendationsArray = productRecommendationsArray.concat(products);
			// 		}
			// 	})
			// );

			// // Format the response with text headings and JSON arrays
			// let formattedResponse = "";

			// // Add product recommendations section
			// if (productRecommendationsArray.length > 0) {
			// 	formattedResponse += "Here are the recommended products for you:\n```json\n";
			// 	formattedResponse += JSON.stringify(
			// 		{ product_recommendations: productRecommendationsArray },
			// 		null,
			// 		2
			// 	);
			// 	formattedResponse += "\n```\n\n";
			// }

			// // Add nutraceutical recommendations section
			// if (nutraceuticalRecommendationsArray.length > 0) {
			// 	formattedResponse += "Here are the recommended nutraceuticals for you:\n```json\n";
			// 	formattedResponse += JSON.stringify(
			// 		{ nutraceutical_recommendations: nutraceuticalRecommendationsArray },
			// 		null,
			// 		2
			// 	);
			// 	formattedResponse += "\n```\n\n";
			// }

			// // Add educational videos section
			// if (educationalVideosArray.length > 0) {
			// 	formattedResponse += "Here are the recommended tutorials for you:\n```json\n";
			// 	formattedResponse += JSON.stringify(
			// 		{ educational_videos: educationalVideosArray },
			// 		null,
			// 		2
			// 	);
			// 	formattedResponse += "\n```\n\n";
			// }

			// // If no recommendations were found
			// if (formattedResponse === "") {
			// 	formattedResponse =
			// 		"I couldn't find any specific recommendations based on the information provided. Could you please share more details about your health concerns?";
			// }

			// Return the stream generator function
			return (async function* () {
				// Simulate streaming by breaking the response into chunks
				const words = response.output_text.split(/(\s+)/);
				let tokenId = 0;
				let generatedText = "";
				const chunkSize = 8; // Process several words at a time for smoother streaming
				// Higher value for code blocks to stream faster

				for (let i = 0; i < words.length; i += chunkSize) {
					// Get a chunk of words
					const chunk = words.slice(i, Math.min(i + chunkSize, words.length)).join("");
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
					// Use a shorter delay for JSON blocks to make them stream faster
					const delay = chunk.includes('"') ? 3 : 10;
					await new Promise((resolve) => setTimeout(resolve, delay));
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
		} catch (error) {
			console.error("Error in supplement flow endpoint:", error);

			// Return an error message as streamed content
			const errorMessage = `Sorry, there was an error processing your request: ${error instanceof Error ? error.message : "Unknown error"}`;

			return (async function* () {
				yield {
					token: {
						id: 0,
						text: errorMessage,
						logprob: 0,
						special: false,
					},
					generated_text: null,
					details: null,
				} satisfies TextGenerationStreamOutput;

				yield {
					token: {
						id: 1,
						text: "",
						logprob: 0,
						special: true,
					},
					generated_text: errorMessage,
					details: null,
				} satisfies TextGenerationStreamOutput;
			})();
		}
	};

	async function getAllRecommendations(healthInfo: HealthInformation) {
		// // Arrays to store each type of recommendation
		const nutraceuticalRecommendationsArray = await getNutraceuticals(healthInfo);

		let productRecommendationsArray: ProductRecommendation[] = [];
		let educationalVideosArray: EducationalVideo[] = [];

		// Step 2: Get educational videos and product recommendations for each supplement
		// We use Promise.all to run these requests in parallel
		await Promise.all(
			nutraceuticalRecommendationsArray.map(async (supplement: NutraceuticalRecommendation) => {
				// Get videos for this supplement
				const videos = await getYoutubeVideos(supplement.nutraceutical_name);

				if (videos && videos.length > 0) {
					educationalVideosArray = educationalVideosArray.concat(videos);
				}

				// Get products for this supplement
				const products = await getProductsRecommendations(
					supplement.nutraceutical_name,
					supplement.user_gender
				);
				if (products && products.length > 0) {
					productRecommendationsArray = productRecommendationsArray.concat(products);
				}
			})
		);

		// Format the response with text headings and JSON arrays
		let formattedResponse = "";

		// Add product recommendations section
		if (productRecommendationsArray.length > 0) {
			formattedResponse += "Product Recommendations:\n```json\n";
			formattedResponse += JSON.stringify({ product_recommendations: productRecommendationsArray });
			formattedResponse += "\n```\n\n";
		}

		// Add nutraceutical recommendations section
		if (nutraceuticalRecommendationsArray.length > 0) {
			formattedResponse += "Nutraceutical Recommendations:\n```json\n";
			formattedResponse += JSON.stringify({
				nutraceutical_recommendations: nutraceuticalRecommendationsArray,
			});
			formattedResponse += "\n```\n\n";
		}

		// Add educational videos section
		if (educationalVideosArray.length > 0) {
			formattedResponse += "Educational Videos:\n```json\n";
			formattedResponse += JSON.stringify({ educational_videos: educationalVideosArray });
			formattedResponse += "\n```\n\n";
		}

		return formattedResponse;
	}
}
