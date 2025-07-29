import { z } from "zod";
import type { Endpoint } from "../endpoints";
import type { TextGenerationStreamOutput } from "@huggingface/inference";
import { OpenAI } from "openai";
import { collections } from "$lib/server/database";
import { searchYouTubeVideoId } from "$lib/server/tools/web/youtubeSearch";

export const endpointSupplementFlowParametersSchema = z.object({
	type: z.literal("supplementFlow"),
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
interface NutraceuticalRecommendation {
	nutraceutical_name: string;
	reason_for_recommendation: string;
	benefits: string;
	interactions_with_users_medications: string;
	best_time_to_take: string;
	popular_abbreviation: string[];
	user_gender_preference: string;
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
	const { openaiApiKey } = endpointSupplementFlowParametersSchema.parse(input);

	// Initialize OpenAI client
	const openai = new OpenAI({
		apiKey: openaiApiKey,
	});

	const tools = [
		{
			type: "function",
			name: "getAllRecommendations",
			description: "Provides nutraceuticals recommendations based on user's input.",
			parameters: {
				type: "object",
				properties: {
					userInfo: {
						type: "string",
						description: "The user's input",
					},
					// secondaryHealthGoal: {
					// 	type: "string",
					// 	description: "The user's secondary health goal",
					// 	enum: [
					// 		"Weight loss",
					// 		"Muscle gain",
					// 		"Improved energy",
					// 		"Boosted immunity",
					// 		"Better sleep",
					// 		"Enhanced focus and mental clarity",
					// 		"Healthy aging",
					// 	],
					// },
					// gender: {
					// 	type: "string",
					// 	description: "The user's gender",
					// 	enum: ["Male", "Female", "Non-binary", "Prefer not to say"],
					// },
					// age: {
					// 	type: "number",
					// 	description: "The user's age",
					// },
					// height: {
					// 	type: "string",
					// 	description: "The user's height",
					// },
					// weight: {
					// 	type: "string",
					// 	description: "The user's weight range in pounds",
					// },
					// allergiesIntolerances: {
					// 	type: "array",
					// 	description: "List of user's allergies and intolerances",
					// 	items: {
					// 		type: "string",
					// 	},
					// },
					// healthConditions: {
					// 	type: "array",
					// 	description: "List of user's health conditions",
					// 	items: {
					// 		type: "string",
					// 	},
					// },
					// symptoms: {
					// 	type: "array",
					// 	description: "List of symptoms the user experiences",
					// 	items: {
					// 		type: "string",
					// 	},
					// },
					// medications: {
					// 	type: "string",
					// 	description: "Medications the user is currently taking",
					// },
					// // exerciseFrequency: {
					// // 	type: "string",
					// // 	description: "How often the user exercises",
					// // 	enum: ["Never", "1-2 times per week", "3-4 times per week", "5+ times per week"],
					// // },
					// // exerciseTypes: {
					// // 	type: "array",
					// // 	description: "Types of exercise the user does",
					// // 	items: {
					// // 		type: "string",
					// // 	},
					// // },
					// // priceRange: {
					// // 	type: "string",
					// // 	description: "User's preferred price range for supplements",
					// // 	enum: ["10$-20$", "20$-40$", "40$+", "No limit"],
					// // },
					// // ingredientPreference: {
					// // 	type: "string",
					// // 	description: "User's preference for supplement ingredients",
					// // 	enum: ["Minimal", "Extensive"],
					// // },
					// // plantBasedPreference: {
					// // 	type: "string",
					// // 	description: "User's preference for plant-based supplements",
					// // 	enum: ["Yes", "No", "No Preference"],
					// // },
					// additionalInfo: {
					// 	type: "string",
					// 	description: "Any additional information provided by the user",
					// },
				},
				required: [
					"userInfo",
					// "primaryHealthGoal",
					// "secondaryHealthGoal",
					// "gender",
					// "age",
					// "height",
					// "weight",
					// "allergiesIntolerances",
					// "healthConditions",
					// "symptoms",
					// "medications",
					// "exerciseFrequency",
					// "exerciseTypes",
					// "priceRange",
					// "ingredientPreference",
					// "plantBasedPreference",
					// "additionalInfo",
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

	// function formatHealthInfoForPrompt(healthInfo: HealthInformation): string {
	// 	// Format array values, using 'None' if the array only contains 'None'
	// 	const formatArray = (arr: string[]): string => {
	// 		return arr.includes("None") ? "None" : arr.join(", ");
	// 	};

	// 	return `
	// 	  HEALTH GOALS
	// 	  Primary Health Goal= ${healthInfo.primaryHealthGoal}
	// 	  Secondary Health Goal= ${healthInfo.secondaryHealthGoal}
	//
	// 	  GENERAL INFORMATION
	// 	  Gender= ${healthInfo.gender}
	// 	  Age= ${healthInfo.age}
	// 	  Height= ${healthInfo.height}
	// 	  Weight= ${healthInfo.weight} lb

	// 	  MEDICAL AND HEALTH CONDITIONS
	// 	  Allergies/Intolerances= ${formatArray(healthInfo.allergiesIntolerances)}
	// 	  Existing Health Conditions= ${formatArray(healthInfo.healthConditions)}
	// 	  Symptoms Experienced= ${formatArray(healthInfo.symptoms)}
	// 	  Current Medications= ${healthInfo.medications || "None"}

	// 	  ADDITIONAL INFORMATION
	// 	  ${healthInfo.additionalInfo || "None"}`;
	// }

	// Nutraceutical Consultant Agent
	async function getNutraceuticals(healthInfo: string): Promise<NutraceuticalRecommendation[]> {
		try {
			// const formattedHealthInfo = formatHealthInfoForPrompt(healthInfo);
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
								text: healthInfo,
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
											popular_abbreviation: {
												type: "array",
												items: { type: "string" },
												description:
													"list of 3 most commonly used alternate names for this supplement (as referred to by consumers, manufacturers, or in online listings)",
											},
											user_gender_preference: {
												type: "string",
												enum: ["All", "Kids", "Men", "Women"],
												description: "The user's gender preference for the supplement",
											},
										},
										required: [
											"nutraceutical_name",
											"reason_for_recommendation",
											"benefits",
											"interactions_with_users_medications",
											"popular_abbreviation",
											"best_time_to_take",
											"user_gender_preference",
										],
									},
								},
							},
							required: ["nutraceutical_recommendations"],
						},
					},
				},
			});
			console.log("end getNutraceuticals", Date.now());
			// Parse the JSON response correctly
			const parsedResponse = JSON.parse(response.output_text);
			return parsedResponse.nutraceutical_recommendations; // Return the entire parsed array
		} catch (error) {
			console.error("Error in nutraceutical consultant:", error);
			return [];
		}
	}

	// YouTube Video Search Agent
	async function getYoutubeVideo(supplement: string): Promise<EducationalVideo> {
		try {
			const youtubeVideoSearchStartTime = Date.now();

			const youtubeVideoId = await searchYouTubeVideoId(supplement);
			const educationalVideo: EducationalVideo = {
				nutraceutical_name: supplement,
				video_link: youtubeVideoId || "",
			};

			const youtubeVideoSearchEndTime = Date.now();
			console.log(
				"YouTube video search time taken:",
				(youtubeVideoSearchEndTime - youtubeVideoSearchStartTime) / 1000,
				"seconds"
			);

			if (youtubeVideoId) {
				return educationalVideo;
			} else {
				return {
					nutraceutical_name: "",
					video_link: "",
				};
			}
		} catch (error) {
			console.error("Error in YouTube video search:", error);
			return {
				nutraceutical_name: "",
				video_link: "",
			};
		}
	}

	// Product Consultant Agent
	// async function getProductsRecommendations(
	// 	supplement: string,
	// 	gender: string
	// ): Promise<ProductRecommendation> {
	// 	try {
	// 		console.log("start getProductsRecommendations",Date.now());
	// 		const response = await openai.responses.create({
	// 			model: "gpt-4o",
	// 			tools: [
	// 				{
	// 					type: "file_search",
	// 					vector_store_ids: [vectorStoreId],
	// 				},
	// 			],
	// 			input: [
	// 				{
	// 					role: "system",
	// 					content: `You are a Product Consultant with access to a product catalog. Recommend one suitable product that matches the nutraceutical supplement ${supplement} and is appropriate for the gender ${gender}. Respond strictly in JSON format.`,
	// 				},
	// 			],
	// 			text: {
	// 				format: {
	// 					name: "ProductResponseFormat",
	// 					type: "json_schema",
	// 					schema: {
	// 						type: "object",
	// 						additionalProperties: false,
	// 						properties: {
	// 							product_name: { type: "string", description: "The name of the product" },
	// 							image: { type: "string", description: "The image URL of the product" },
	// 							description: { type: "string", description: "The description of the product" },
	// 							price: { type: "string", description: "The price of the product" },
	// 							product_link: { type: "string", description: "The link to the product" },
	// 						},
	// 						required: ["product_name", "image", "description", "price", "product_link"],
	// 					},
	// 				},
	// 			},
	// 		});
	// 		console.log("end getProductsRecommendations",Date.now());
	// 		// Parse the JSON response correctly
	// 		const parsedResponse = JSON.parse(response.output_text);
	// 		return parsedResponse; // Return the entire parsed array
	// 	} catch (error) {
	// 		console.error("Error in product consultant:", error);
	// 		return {
	// 			product_name: "",
	// 			image: "",
	// 			description: "",
	// 			price: "",
	// 			product_link: "",
	// 		};
	// 	}
	// }

	// Product Consultant Agent
	async function getProductsRecommendationsFromDatabase(
		supplement: string,
		gender: string,
		popular_abbreviation: string[]
	): Promise<ProductRecommendation | null> {
		try {
			// if gender is not All, then filter by All or the gender
			let product = null;
			if (gender !== "All") {
				product = await collections.products.findOne({
					normalized_product_name: { $regex: new RegExp(supplement) },
					$or: [{ gender }, { gender: "All" }],
				});

				if (!product) {
					product = await collections.products.findOne({
						$or: popular_abbreviation.map((abbreviation) => ({
							normalized_product_name: { $regex: new RegExp(abbreviation) },
							$or: [{ gender }, { gender: "All" }],
						})),
					});
				}
			} else {
				product = await collections.products.findOne({
					normalized_product_name: { $regex: new RegExp(supplement) },
				});

				if (!product) {
					product = await collections.products.findOne({
						$or: popular_abbreviation.map((abbreviation) => ({
							normalized_product_name: { $regex: new RegExp(abbreviation) },
						})),
					});
				}
			}

			// if product is found, return the product
			if (product) {
				return {
					product_name: product.product_name || "",
					image: product.image_url || "",
					description: product.description || "",
					price: product.price?.toString() || "",
					product_link: product.product_url || "",
				};
			}

			return null;
		} catch (error) {
			console.error("Error fetching product from database:", error);
			return null;
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
Accept the user's input on their health goals, health concerns or any other information provided by the user.
- call the getAllRecommendations tool to provide the user with the best recommendations based on their input.

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
			const supervisorStartTime = Date.now();
			const response = await openai.responses.create({
				model: "gpt-4o",
				tools,
				input,
			});
			const supervisorEndTime = Date.now();
			console.log(
				"Supervisor time taken:",
				(supervisorEndTime - supervisorStartTime) / 1000,
				"seconds"
			);

			let toolUsed = false;
			for (const toolCall of response.output) {
				if (toolCall.type !== "function_call") {
					continue;
				}

				if (toolCall.name === "getAllRecommendations") {
					// Parse the function arguments
					const functionArgs: { userInfo: string } = JSON.parse(toolCall.arguments);

					// Call the function
					const result = await getAllRecommendations(functionArgs.userInfo);

					// Add the tool call to the input
					input.push(toolCall);

					input.push({
						type: "function_call_output",
						call_id: toolCall.call_id,
						output: result.toString(),
					});

					toolUsed = true;
				}

				if (toolUsed) {
					// Send the function result back to the model
					const finalResponseStartTime = Date.now();
					const finalResponse = await openai.responses.create({
						model: "gpt-4o",
						input,
						tools,
					});
					const finalResponseEndTime = Date.now();
					console.log(
						"Final response time taken:",
						(finalResponseEndTime - finalResponseStartTime) / 1000,
						"seconds"
					);
					response.output_text = finalResponse.output_text;
				}
			}

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

	async function getAllRecommendations(healthInfo: string) {
		// console.log("healthInfo", healthInfo);
		// // Arrays to store each type of recommendation
		const nutraceuticalRecommendationsStartTime = Date.now();
		const nutraceuticalRecommendationsArray = await getNutraceuticals(healthInfo);
		const nutraceuticalRecommendationsEndTime = Date.now();
		console.log(
			"Nutraceutical recommendations time taken:",
			(nutraceuticalRecommendationsEndTime - nutraceuticalRecommendationsStartTime) / 1000,
			"seconds"
		);

		const productRecommendationsArray: ProductRecommendation[] = [];
		const educationalVideosArray: EducationalVideo[] = [];

		// Step 2: Get educational videos and product recommendations for each supplement
		// We use Promise.all to run these requests in parallel
		const videoAndProductRecommendationsStartTime = Date.now();
		await Promise.all(
			nutraceuticalRecommendationsArray.map(async (supplement: NutraceuticalRecommendation) => {
				// Get videos for this supplement
				const video = await getYoutubeVideo("benefits of " + supplement.nutraceutical_name);
				if (video) {
					educationalVideosArray.push(video);
				}

				// normalize the nutraceutical name
				const normalizedNutraceuticalName = normalizeProductName(supplement.nutraceutical_name);

				// loop through the popular_abbreviation array and normalize the name and add to a new array
				const normalizedAbbreviations: string[] = [];
				for (const abbreviation of supplement.popular_abbreviation) {
					const normalizedAbbreviation = normalizeProductName(abbreviation);
					normalizedAbbreviations.push(normalizedAbbreviation);
				}

				// console.log("normalizedAbbreviations==="+JSON.stringify(normalizedAbbreviations));
				// console.log("normalizedNutraceuticalName==="+normalizedNutraceuticalName);
				// console.log("supplement.user_gender_preference==="+supplement.user_gender_preference);

				// Get products for this supplement
				const product = await getProductsRecommendationsFromDatabase(
					normalizedNutraceuticalName,
					supplement.user_gender_preference,
					normalizedAbbreviations
				);
				if (product) {
					productRecommendationsArray.push(product);
				}
			})
		);
		const videoAndProductRecommendationsEndTime = Date.now();
		console.log(
			"Video and product recommendations time taken:",
			(videoAndProductRecommendationsEndTime - videoAndProductRecommendationsStartTime) / 1000,
			"seconds"
		);

		// educationalVideosArray.push(
		// 	{
		// 	  nutraceutical_name: "2025 NBA Playoffs Schedule",
		// 	  video_link: "https://www.youtube.com/watch?v=cF5iP-P67fg"
		// 	},
		// 	{
		// 	  nutraceutical_name: "2025 NBA Playoffs",
		// 	  video_link: "https://www.youtube.com/watch?v=cF5iP-P67fg"
		// 	},
		// 	{
		// 	  nutraceutical_name: "2025 NBA Playoffs Schedule",
		// 	  video_link: "https://www.youtube.com/watch?v=cF5iP-P67fg"
		// 	},
		// 	{
		// 	  nutraceutical_name: "2025 NBA Playoffs",
		// 	  video_link: "https://www.youtube.com/watch?v=cF5iP-P67fg"
		// 	},
		// 	{
		// 	  nutraceutical_name: "2025 NBA Playoffs Schedule",
		// 	  video_link: "https://www.youtube.com/watch?v=cF5iP-P67fg"
		// 	}
		// );

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

	function normalizeProductName(productName: string) {
		if (!productName || typeof productName !== "string") return "";

		return productName
			.toLowerCase()
			.trim()
			.replace(/[^a-z0-9 ]/gi, "") // remove all special characters
			.replace(/\s+/g, " "); // normalize multiple spaces to one
	}
}
