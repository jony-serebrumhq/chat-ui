import { env } from "$env/dynamic/private";
import { google } from "googleapis";

// Initialize the YouTube client
const youtube = google.youtube({
	version: "v3",
	auth: env.YOUTUBE_API_KEY,
});

interface RetryOptions {
	maxRetries?: number;
	baseDelay?: number;
	maxDelay?: number;
}

interface YouTubeSearchError extends Error {
	code?: number;
	status?: string;
}

/**
 * Search for YouTube videos based on a fitness goal.
 * @param {string} query - The search query (e.g., "leg day workout").
 * @param {RetryOptions} retryOptions - Retry configuration options.
 * @returns {Promise<string | null>} - YouTube video ID or null if not found.
 */
async function searchYouTubeVideo(
	query: string,
	retryOptions: RetryOptions = {}
): Promise<{ videoId: string; videoTitle: string | null } | null> {
	const { maxRetries = 3, baseDelay = 1000, maxDelay = 10000 } = retryOptions;

	if (!query || query.trim() === "") {
		console.warn("Empty query provided to YouTube search");
		return null;
	}

	if (!env.YOUTUBE_API_KEY) {
		console.error("YouTube API key is not configured");
		return null;
	}

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			// console.info(`YouTube search attempt ${attempt}/${maxRetries} for query: "${query}"`);

			const response = await youtube.search.list({
				q: query.trim(),
				part: ["id", "snippet"],
				type: ["video"],
				maxResults: 1,
				safeSearch: "moderate",
				videoDuration: "short",
			});

			const videos = response?.data?.items;

			if (!videos || videos.length === 0) {
				console.warn(`No YouTube videos found for query: "${query}"`);
				return null;
			}

			const videoId = videos[0]?.id?.videoId;
			const videoTitle = videos[0]?.snippet?.title;

			if (!videoId) {
				console.warn("Video found but no videoId available");
				return null;
			}

			return { videoId, videoTitle };
		} catch (error: unknown) {
			const youtubeError = error as YouTubeSearchError;

			// Check if error is retryable
			const isRetryableError =
				(youtubeError.code && youtubeError.code >= 500) ||
				youtubeError.code === 429 || // Rate limit
				!youtubeError.code; // Network errors

			if (!isRetryableError) {
				console.error(`Non-retryable error on attempt ${attempt}:`, youtubeError.message);
				break;
			}

			console.error(`Retryable error on attempt ${attempt}:`, youtubeError.message);

			if (attempt < maxRetries) {
				const waitTime = Math.min(Math.pow(2, attempt - 1) * baseDelay, maxDelay);
				console.info(`Waiting ${waitTime}ms before retry...`);
				await new Promise((resolve) => setTimeout(resolve, waitTime));
			}
		}
	}

	console.error(`YouTube search failed after ${maxRetries} attempts for query: "${query}"`);
	return null;
}

export { searchYouTubeVideo };
