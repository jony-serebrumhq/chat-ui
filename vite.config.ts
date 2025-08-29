import { sveltekit } from "@sveltejs/kit/vite";
import Icons from "unplugin-icons/vite";
import { promises } from "fs";
import { defineConfig } from "vitest/config";

// used to load fonts server side for thumbnail generation
function loadTTFAsArrayBuffer() {
	return {
		name: "load-ttf-as-array-buffer",
		async transform(_src, id) {
			if (id.endsWith(".ttf")) {
				return `export default new Uint8Array([
			${new Uint8Array(await promises.readFile(id))}
		  ]).buffer`;
			}
		},
	};
}

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: "svelte",
		}),
		loadTTFAsArrayBuffer(),
	],
	optimizeDeps: {
		include: ["uuid", "@huggingface/transformers", "@gradio/client"],
		exclude: ["sharp"],
	},
	server: {
		open: "/",
	},
	test: {
		setupFiles: ["./scripts/setupTest.ts"],
		deps: { inline: ["@sveltejs/kit"] },
		globals: true,
		testTimeout: 10000,
	},
	preview: {
		host: "0.0.0.0",
		port: Number(process.env.PORT) || 3000,
		allowedHosts: ["chat-ui-nb8z.onrender.com"], // Add your Render-provided domain here
	},
});
