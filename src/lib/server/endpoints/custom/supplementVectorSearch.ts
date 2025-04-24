import { z } from "zod";
import type { Endpoint } from "../endpoints";
import type { TextGenerationStreamOutput } from "@huggingface/inference";
import { OpenAI } from "openai";

export const endpointSupplementVectorSearchParametersSchema = z.object({
	type: z.literal("supplementVectorSearch"),
	openaiApiKey: z.string(),
	weight: z.number().int().positive().default(1),
	model: z.any(),
	vectorStoreId: z.string(),
});

// Define a type for the structured health information
// interface HealthInformation {
// 	primaryHealthGoal: string;
// 	secondaryHealthGoal: string;
// 	gender: string;
// 	age: number;
// 	height: string;
// 	weight: string;
// 	allergiesIntolerances: string[];
// 	healthConditions: string[];
// 	symptoms: string[];
// 	medications: string;
// 	exerciseFrequency: string;
// 	exerciseTypes: string[];
// 	priceRange: string;
// 	ingredientPreference: string;
// 	plantBasedPreference: string;
// 	additionalInfo?: string;
// }

// Define types for our data structures
// interface NutraceuticalRecommendation {
// 	nutraceutical_name: string;
// 	reason_for_recommendation: string;
// 	benefits: string;
// 	interactions_with_users_medications: string;
// 	best_time_to_take: string;
// 	user_gender: string;
// }

// interface EducationalVideo {
// 	nutraceutical_name: string;
// 	video_link: string;
// }

// interface ProductRecommendation {
// 	product_name: string;
// 	image: string;
// 	description: string;
// 	price: string;
// 	product_link: string;
// }

export function endpointSupplementVectorSearch(
	input: z.input<typeof endpointSupplementVectorSearchParametersSchema>
): Endpoint {
	const { openaiApiKey, vectorStoreId } =
		endpointSupplementVectorSearchParametersSchema.parse(input);

	// Initialize OpenAI client
	const openai = new OpenAI({
		apiKey: openaiApiKey,
	});

	// const tools = [
	// 	{
	// 		type: "function",
	// 		name: "getAllRecommendations",
	// 		description:
	// 			"Provides nutraceuticals, products and educational vidoes recommendations as per user's profile.",
	// 		parameters: {
	// 			type: "object",
	// 			properties: {
	// 				primaryHealthGoal: {
	// 					type: "string",
	// 					description: "The user's main health goal",
	// 					enum: [
	// 						"Weight loss",
	// 						"Muscle gain",
	// 						"Improved energy",
	// 						"Boosted immunity",
	// 						"Better sleep",
	// 						"Enhanced focus and mental clarity",
	// 						"Healthy aging",
	// 					],
	// 				},
	// 				secondaryHealthGoal: {
	// 					type: "string",
	// 					description: "The user's secondary health goal",
	// 					enum: [
	// 						"Weight loss",
	// 						"Muscle gain",
	// 						"Improved energy",
	// 						"Boosted immunity",
	// 						"Better sleep",
	// 						"Enhanced focus and mental clarity",
	// 						"Healthy aging",
	// 					],
	// 				},
	// 				gender: {
	// 					type: "string",
	// 					description: "The user's gender",
	// 					enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
	// 				},
	// 				age: {
	// 					type: "number",
	// 					description: "The user's age",
	// 				},
	// 				height: {
	// 					type: "string",
	// 					description: "The user's height",
	// 				},
	// 				weight: {
	// 					type: "string",
	// 					description: "The user's weight range in pounds",
	// 				},
	// 				allergiesIntolerances: {
	// 					type: "array",
	// 					description: "List of user's allergies and intolerances",
	// 					items: {
	// 						type: "string",
	// 					},
	// 				},
	// 				healthConditions: {
	// 					type: "array",
	// 					description: "List of user's health conditions",
	// 					items: {
	// 						type: "string",
	// 					},
	// 				},
	// 				symptoms: {
	// 					type: "array",
	// 					description: "List of symptoms the user experiences",
	// 					items: {
	// 						type: "string",
	// 					},
	// 				},
	// 				medications: {
	// 					type: "string",
	// 					description: "Medications the user is currently taking",
	// 				},
	// 				// exerciseFrequency: {
	// 				// 	type: "string",
	// 				// 	description: "How often the user exercises",
	// 				// 	enum: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week"],
	// 				// },
	// 				// exerciseTypes: {
	// 				// 	type: "array",
	// 				// 	description: "Types of exercise the user does",
	// 				// 	items: {
	// 				// 		type: "string",
	// 				// 	},
	// 				// },
	// 				// priceRange: {
	// 				// 	type: "string",
	// 				// 	description: "User's preferred price range for supplements",
	// 				// 	enum: ["10$-20$", "20$-40$", "40$+", "No limit"],
	// 				// },
	// 				// ingredientPreference: {
	// 				// 	type: "string",
	// 				// 	description: "User's preference for supplement ingredients",
	// 				// 	enum: ["Minimal", "Extensive"],
	// 				// },
	// 				// plantBasedPreference: {
	// 				// 	type: "string",
	// 				// 	description: "User's preference for plant-based supplements",
	// 				// 	enum: ["Yes", "No", "No Preference"],
	// 				// },
	// 				additionalInfo: {
	// 					type: "string",
	// 					description: "Any additional information provided by the user",
	// 				},
	// 			},
	// 			required: [
	// 				"primaryHealthGoal",
	// 				"secondaryHealthGoal",
	// 				"gender",
	// 				"age",
	// 				"height",
	// 				"weight",
	// 				"allergiesIntolerances",
	// 				"healthConditions",
	// 				"symptoms",
	// 				"medications",
	// 				// "exerciseFrequency",
	// 				// "exerciseTypes",
	// 				// "priceRange",
	// 				// "ingredientPreference",
	// 				// "plantBasedPreference",
	// 				"additionalInfo",
	// 			],
	// 			additionalProperties: false,
	// 		},
	// 		strict: true,
	// 	},
	// 	// {
	// 	// 	"type": "function",
	// 	// 	"name": "getYoutubeVideos",
	// 	// 	"description": "Searches for educational YouTube videos about a specific supplement.",
	// 	// 	"parameters": {
	// 	// 			"type": "object",
	// 	// 			"properties": {
	// 	// 				"supplement": {
	// 	// 					"type": "string",
	// 	// 					"description": "The name of the supplement to search videos for"
	// 	// 				}
	// 	// 			},
	// 	// 			"required": ["supplement"],
	// 	// 			"additionalProperties": false
	// 	// 	},
	// 	// 	"strict": true
	// 	// },
	// 	// {
	// 	// 	"type": "function",
	// 	// 	"name": "getProductsRecommendations",
	// 	// 	"description": "Provides product recommendations for a specific supplement appropriate for the user's gender.",
	// 	// 	"parameters": {
	// 	// 			"type": "object",
	// 	// 			"properties": {
	// 	// 				"supplement": {
	// 	// 					"type": "string",
	// 	// 					"description": "The name of the supplement to find products for"
	// 	// 				},
	// 	// 				"gender": {
	// 	// 					"type": "string",
	// 	// 					"description": "The user's gender for gender-appropriate recommendations",
	// 	// 					"enum": ["Male", "Female", "Non-binary", "Prefer not to say"]
	// 	// 				}
	// 	// 			},
	// 	// 			"required": ["supplement", "gender"],
	// 	// 			"additionalProperties": false
	// 	// 	},
	// 	// 	"strict": true
	// 	// 	}
	// ];

	// function formatHealthInfoForPrompt(healthInfo: HealthInformation): string {
	// 	// Format array values, using 'None' if the array only contains 'None'
	// 	const formatArray = (arr: string[]): string => {
	// 		return arr.includes("None") ? "None" : arr.join(", ");
	// 	};

	// 	return `
	//   HEALTH GOALS
	//   Primary Health Goal= ${healthInfo.primaryHealthGoal}
	//   Secondary Health Goal= ${healthInfo.secondaryHealthGoal}

	//   GENERAL INFORMATION
	//   Gender= ${healthInfo.gender}
	//   Age= ${healthInfo.age}
	//   Height= ${healthInfo.height}
	//   Weight= ${healthInfo.weight} lb

	//   MEDICAL AND HEALTH CONDITIONS
	//   Allergies/Intolerances= ${formatArray(healthInfo.allergiesIntolerances)}
	//   Existing Health Conditions= ${formatArray(healthInfo.healthConditions)}
	//   Symptoms Experienced= ${formatArray(healthInfo.symptoms)}
	//   Current Medications= ${healthInfo.medications || "None"}

	//   ADDITIONAL INFORMATION
	//   ${healthInfo.additionalInfo || "None"}`;
	// }

	// Nutraceutical Consultant Agent
	// async function getNutraceuticals(
	// 	healthInfo: HealthInformation
	// ): Promise<NutraceuticalRecommendation[]> {
	// 	try {
	// 		const formattedHealthInfo = formatHealthInfoForPrompt(healthInfo);
	// 		const response = await openai.responses.create({
	// 			model: "gpt-4o",
	// 			input: [
	// 				{
	// 					role: "system",
	// 					content: [
	// 						{
	// 							type: "input_text",
	// 							text: "You are a knowledgeable supplement advisor. Based solely on the user's profile — and only recommending supplements appropriate for their gender — suggest the **five best** supplements, ranked most → least important. Respond strictly in JSON format.",
	// 						},
	// 					],
	// 				},
	// 				{
	// 					role: "user",
	// 					content: [
	// 						{
	// 							type: "input_text",
	// 							text: formattedHealthInfo,
	// 						},
	// 					],
	// 				},
	// 			],
	// 			text: {
	// 				format: {
	// 					name: "NutraceuticalResponseFormat",
	// 					type: "json_schema",
	// 					schema: {
	// 						type: "object",
	// 						additionalProperties: false,
	// 						properties: {
	// 							nutraceutical_recommendations: {
	// 								type: "array",
	// 								items: {
	// 									type: "object",
	// 									additionalProperties: false,
	// 									properties: {
	// 										nutraceutical_name: { type: "string" },
	// 										reason_for_recommendation: { type: "string" },
	// 										benefits: { type: "string" },
	// 										interactions_with_users_medications: { type: "string" },
	// 										best_time_to_take: { type: "string" },
	// 										user_gender: { type: "string" },
	// 									},
	// 									required: [
	// 										"nutraceutical_name",
	// 										"reason_for_recommendation",
	// 										"benefits",
	// 										"interactions_with_users_medications",
	// 										"best_time_to_take",
	// 										"user_gender",
	// 									],
	// 								},
	// 							},
	// 						},
	// 						required: ["nutraceutical_recommendations"],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		// Parse the JSON response correctly
	// 		const parsedResponse = JSON.parse(response.output_text);
	// 		return parsedResponse.nutraceutical_recommendations; // Return the entire parsed array
	// 	} catch (error) {
	// 		console.error("Error in nutraceutical consultant:", error);
	// 		return [];
	// 	}
	// }

	// YouTube Video Search Agent
	// async function getYoutubeVideo(supplement: string): Promise<EducationalVideo> {
	// 	try {
	// 		const response = await openai.responses.create({
	// 			model: "gpt-4o",
	// 			tools: [{ type: "web_search_preview" }],
	// 			tool_choice: { type: "web_search_preview" },
	// 			input: `Use the web_search_preview tool and find one suitable educational YouTube video about ${supplement}. Response strictly in JSON format.`,
	// 			text: {
	// 				format: {
	// 					name: "NutraceuticalEducationalVideoResponseFormat",
	// 					type: "json_schema",
	// 					schema: {
	// 						type: "object",
	// 						additionalProperties: false,
	// 						properties: {
	// 							nutraceutical_name: { type: "string" },
	// 							video_link: { type: "string" },
	// 						},
	// 						required: ["nutraceutical_name", "video_link"],
	// 					},
	// 				},
	// 			},
	// 		});

	// 		// Parse the JSON response correctly
	// 		const parsedResponse = JSON.parse(response.output_text);
	// 		return parsedResponse; // Return the entire parsed array
	// 	} catch (error) {
	// 		console.error("Error in YouTube video search:", error);
	// 		return {
	// 			nutraceutical_name: "",
	// 			video_link: "",
	// 		};
	// 	}
	// }

	// Product Consultant Agent
	async function getProductsRecommendations(user_input: string): Promise<string> {
		try {
			const response = await openai.responses.create({
				model: "gpt-4o",
				tools: [
					{
						type: "file_search",
						vector_store_ids: [vectorStoreId],
					},
				],
				tool_choice: { type: "file_search" },
				input: [
					{
						role: "system",
						content:
							"You are a Product Consultant with access to a product catalog. Recommend suitable products based on the user's input. Respond strictly in JSON format.",
					},
					{
						role: "user",
						content: user_input,
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
											product_name: { type: "string", description: "The name of the product" },
											image: { type: "string", description: "The image URL of the product" },
											description: {
												type: "string",
												description: "The description of the product",
											},
											price: { type: "string", description: "The price of the product" },
											product_link: { type: "string", description: "The link to the product" },
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

			const productRecommendationsArray = JSON.parse(response.output_text);
			console.log("productRecommendationsArray", productRecommendationsArray);

			let formattedResponse = "";
			if (productRecommendationsArray) {
				formattedResponse += "```json\n";
				formattedResponse += JSON.stringify(productRecommendationsArray, null, 2);
				formattedResponse += "\n```\n\n";
			}

			console.log("formattedResponse", formattedResponse);
			return formattedResponse; // Return the entire parsed array
		} catch (error) {
			console.error("Error in product consultant:", error);
			return "";
		}
	}

	return async ({ messages }) => {
		// Get the last 1 messages
		const user_input = messages.slice(Math.max(0, messages.length - 1))[0].content;

		const response = await getProductsRecommendations(user_input);

		// Return the stream generator function
		return (async function* () {
			// Simulate streaming by breaking the response into chunks
			const words = response.split(/(\s+)/);
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
	};

	// Add product recommendations section
	// if (productRecommendationsArray.length > 0) {
	// 	formattedResponse += "Product Recommendations:\n```json\n";
	// 	formattedResponse += JSON.stringify({ product_recommendations: productRecommendationsArray });
	// 	formattedResponse += "\n```\n\n";
	// }

	// Add nutraceutical recommendations section
	// if (nutraceuticalRecommendationsArray.length > 0) {
	// 	formattedResponse += "Nutraceutical Recommendations:\n```json\n";
	// 	formattedResponse += JSON.stringify({
	// 		nutraceutical_recommendations: nutraceuticalRecommendationsArray,
	// 	});
	// 	formattedResponse += "\n```\n\n";
	// }

	// // Add educational videos section
	// if (educationalVideosArray.length > 0) {
	// 	formattedResponse += "Educational Videos:\n```json\n";
	// 	formattedResponse += JSON.stringify({ educational_videos: educationalVideosArray });
	// 	formattedResponse += "\n```\n\n";
	// }

	// return formattedResponse;
}
