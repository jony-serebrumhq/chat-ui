<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { goto } from "$app/navigation";
    import { base } from "$app/paths";
    import { page } from "$app/stores";
    import { pendingMessage } from "$lib/stores/pendingMessage";
    import { error } from "$lib/stores/errors";
    import { ERROR_MESSAGES } from "$lib/stores/errors";
    import { useSettingsStore } from "$lib/stores/settings";
    import { v4 as uuidv4 } from 'uuid';
    import { chatInputContent } from "$lib/stores/chatInput";
    import { loginModalOpen } from "$lib/stores/loginModal";

    const settings = useSettingsStore();
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    let age = $state(35);
    let height = $state(65);
    let currentWeight = $state(150);
    let targetWeight = $state(130);
    let healthGoal = $state('Weight loss');
    let dietPreference = $state('No preference');
    let hasHeartDisease = $state(false);
    let hasDiabetes = $state(false);
    let hasKidneyDisease = $state(false);

    const healthGoals = [
        'Weight loss',
        'Weight gain',
        'Build muscle',
        'Maintain weight',
        'Improve fitness',
        'Better nutrition'
    ];

    const dietPreferences = [
        'No preference',
        'Vegetarian',
        'Vegan',
        'Pescatarian',
        'Keto',
        'Paleo',
        'Mediterranean'
    ];

    function generatePrompt() {
        return `Generate a 7-day meal plan for me with the following details:
Age: ${age}
Height: ${height} inches
Current Weight: ${currentWeight} lb
Target Weight: ${targetWeight} lb
Heart Disease: ${hasHeartDisease ? 'Yes' : 'No'}
Diabetic: ${hasDiabetes ? 'Yes' : 'No'}
Kidney Disease: ${hasKidneyDisease ? 'Yes' : 'No'}
Health Goal: ${healthGoal}
Diet Preference: ${dietPreference}`;
    }

    function handleSubmit(e: Event) {
        e.preventDefault();
        
        dispatch("message", generatePrompt());
    }
</script>

<div class="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 border-l dark:border-gray-700">
    <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Health Info</h2>
    
    <form 
        onsubmit={handleSubmit} 
        class="flex flex-col gap-4"
    >
        <div class="flex flex-col gap-2">
            <label for="age" class="text-sm text-gray-600 dark:text-gray-400">Age</label>
            <input
                id="age"
                type="number"
                bind:value={age}
                min="0"
                max="150"
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="height" class="text-sm text-gray-600 dark:text-gray-400">Height (inches)</label>
            <input
                id="height"
                type="number"
                bind:value={height}
                min="0"
                max="120"
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="currentWeight" class="text-sm text-gray-600 dark:text-gray-400">Current Weight (lb)</label>
            <input
                id="currentWeight"
                type="number"
                bind:value={currentWeight}
                min="0"
                max="1000"
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="targetWeight" class="text-sm text-gray-600 dark:text-gray-400">Target Weight (lb)</label>
            <input
                id="targetWeight"
                type="number"
                bind:value={targetWeight}
                min="0"
                max="1000"
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            />
        </div>

        <div class="flex flex-col gap-2">
            <label for="healthGoal" class="text-sm text-gray-600 dark:text-gray-400">Health Goal</label>
            <select
                id="healthGoal"
                bind:value={healthGoal}
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            >
                {#each healthGoals as goal}
                    <option value={goal}>{goal}</option>
                {/each}
            </select>
        </div>

        <div class="flex flex-col gap-2">
            <label for="dietPreference" class="text-sm text-gray-600 dark:text-gray-400">Diet Preference</label>
            <select
                id="dietPreference"
                bind:value={dietPreference}
                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
            >
                {#each dietPreferences as diet}
                    <option value={diet}>{diet}</option>
                {/each}
            </select>
        </div>

        <div class="flex flex-col gap-2">
            <fieldset class="flex flex-col gap-3 mt-2">
                <legend class="text-sm text-gray-600 dark:text-gray-400">Medical Conditions</legend>
                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="heartDisease"
                        bind:checked={hasHeartDisease}
                        class="rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
                    />
                    <label for="heartDisease" class="text-sm text-gray-600 dark:text-gray-400">Heart Disease</label>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="diabetes"
                        bind:checked={hasDiabetes}
                        class="rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
                    />
                    <label for="diabetes" class="text-sm text-gray-600 dark:text-gray-400">Diabetic</label>
                </div>
                <div class="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="kidneyDisease"
                        bind:checked={hasKidneyDisease}
                        class="rounded border-gray-300 text-blue-500 focus:ring-blue-500 dark:border-gray-600"
                    />
                    <label for="kidneyDisease" class="text-sm text-gray-600 dark:text-gray-400">Kidney Disease</label>
                </div>
            </fieldset>
        </div>

        <button
            type="submit"
            class="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
            Start New Chat
        </button>
    </form>
</div> 