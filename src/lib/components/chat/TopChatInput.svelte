<script lang="ts">
	import { browser } from "$app/environment";
	import { createEventDispatcher, onMount } from "svelte";

	import { useSettingsStore } from "$lib/stores/settings";
	import { page } from "$app/state";
	import { loginModalOpen } from "$lib/stores/loginModal";

	interface Props {
		value?: string;
		placeholder?: string;
		loading?: boolean;
		disabled?: boolean;
		onPaste?: (e: ClipboardEvent) => void;
	}

	let {
		value = $bindable(""),
		placeholder = "Search for supplements...",
		loading = false,
		disabled = false,
		onPaste,
	}: Props = $props();

	let textareaElement: HTMLTextAreaElement | undefined = $state();
	let isCompositionOn = $state(false);

	const dispatch = createEventDispatcher<{ submit: void }>();

	onMount(() => {
		if (!isVirtualKeyboard()) {
			textareaElement?.focus();
		}
		function onFormSubmit() {
			adjustTextareaHeight();
		}

		const formEl = textareaElement?.closest("form");
		formEl?.addEventListener("submit", onFormSubmit);
		return () => {
			formEl?.removeEventListener("submit", onFormSubmit);
		};
	});

	function isVirtualKeyboard(): boolean {
		if (!browser) return false;

		// Check for touch capability
		if (navigator.maxTouchPoints > 0) return true;

		// Check for touch events
		if ("ontouchstart" in window) return true;

		// Fallback to user agent string check
		const userAgent = navigator.userAgent.toLowerCase();

		return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
	}

	function adjustTextareaHeight() {
		if (!textareaElement) {
			return;
		}

		textareaElement.style.height = "auto";
		textareaElement.style.height = `${textareaElement.scrollHeight}px`;

		if (textareaElement.selectionStart === textareaElement.value.length) {
			textareaElement.scrollTop = textareaElement.scrollHeight;
		}
	}

	function handleKeydown(event: KeyboardEvent) {
		if (
			event.key === "Enter" &&
			!event.shiftKey &&
			!isCompositionOn &&
			!isVirtualKeyboard() &&
			value.trim() !== ""
		) {
			event.preventDefault();
			dispatch("submit");
		}
	}

	const settings = useSettingsStore();
</script>

<div class="bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
    <div class="container mx-auto px-4 py-3">
        <div class="flex min-h-full flex-1 flex-col" onpaste={onPaste}>
            <div class="flex items-center">
                <div class="flex-grow relative">
                    <textarea
                        rows="1"
                        tabindex="0"
                        inputmode="text"
                        class="scrollbar-custom max-h-[2.5lh] w-full resize-none overflow-y-auto overflow-x-hidden border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 max-sm:text-[16px]"
                        class:text-gray-400={disabled}
                        bind:value
                        bind:this={textareaElement}
                        onkeydown={handleKeydown}
                        oncompositionstart={() => (isCompositionOn = true)}
                        oncompositionend={() => (isCompositionOn = false)}
                        oninput={adjustTextareaHeight}
                        onbeforeinput={(ev) => {
                            if (page.data.loginRequired) {
                                ev.preventDefault();
                                $loginModalOpen = true;
                            }
                        }}
                        {placeholder}
                        {disabled}
                    ></textarea>
                </div>
                <button
                    type="button"
                    class="ml-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || !value.trim()}
                    onclick={() => dispatch("submit")}
                >
                    Search
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
	:global(pre),
	:global(textarea) {
		font-family: inherit;
		box-sizing: border-box;
		line-height: 1.5;
	}

    .scrollbar-custom {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

    .scrollbar-custom::-webkit-scrollbar {
        width: 6px;
    }

    .scrollbar-custom::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
    }
</style> 