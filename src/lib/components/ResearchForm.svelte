<script lang="ts">
    import { createEventDispatcher } from "svelte";
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    function handleSubmit() {
        dispatch("message", "I'd like to talk about supplements.");
    }
</script>

<style>
    .section {
        transition: all 0.2s ease-in-out;
        border-radius: 8px;
        border: 1px solid rgba(156, 163, 175, 0.5);
    }
    
    /* Add custom scrollbar styling */
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
    }
</style>

<div class="flex h-screen">
    <div class="flex flex-col border-l dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden w-full">
        <div class="flex flex-col h-full p-4 gap-4">
            <!-- Section 1: Research (40%) -->
            <div class="section h-2/5 p-4 bg-white dark:bg-gray-800 overflow-y-auto custom-scrollbar">
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Research</h2>
                <!-- Research content will go here -->
            </div>

            <!-- Section 2: Videos (40%) -->
            <div class="section h-2/5 p-4 bg-white dark:bg-gray-800 overflow-y-auto custom-scrollbar">
                <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Videos</h2>
                <!-- Videos content will go here -->
            </div>

            <!-- Section 3: Talk to Agent Button (20%) -->
            <div class="section h-1/5 p-4 flex items-center justify-center bg-white dark:bg-gray-800">
                <button
                    on:click={handleSubmit}
                    class="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg font-medium"
                >
                    Talk to Agent
                </button>
            </div>
        </div>
    </div>
</div> 