<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    
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

    // Add state for accordion sections
    let openSections = $state({
        basicInfo: true,
        weightInfo: false,
        preferences: false,
        medicalConditions: false
    });

    function toggleSection(section: keyof typeof openSections) {
        openSections[section] = !openSections[section];
    }

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

<style>
    /* Add smooth transition styles */
    .accordion-content {
        transition: all 0.2s ease-in-out;
    }

    .chevron {
        transition: transform 0.2s ease-in-out;
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
        <div class="flex-none p-4">
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Health Info</h2>
        </div>

        <form 
            onsubmit={handleSubmit} 
            class="flex flex-1 flex-col gap-4 overflow-y-auto custom-scrollbar p-4 pt-0"
        >
            <!-- Section 1: Basic Info -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('basicInfo')}
                >
                    <span class="font-medium">Basic Information</span>
                    <span class="chevron transform {openSections.basicInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.basicInfo ? '500px' : '0'}; opacity: {openSections.basicInfo ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
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
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2: Weight Info -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('weightInfo')}
                >
                    <span class="font-medium">Weight Information</span>
                    <span class="chevron transform {openSections.weightInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.weightInfo ? '500px' : '0'}; opacity: {openSections.weightInfo ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
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
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3: Preferences -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('preferences')}
                >
                    <span class="font-medium">Preferences</span>
                    <span class="chevron transform {openSections.preferences ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.preferences ? '500px' : '0'}; opacity: {openSections.preferences ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
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
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 4: Medical Conditions -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('medicalConditions')}
                >
                    <span class="font-medium">Medical Conditions</span>
                    <span class="chevron transform {openSections.medicalConditions ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.medicalConditions ? '500px' : '0'}; opacity: {openSections.medicalConditions ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="heartDisease"
                                    bind:checked={hasHeartDisease}
                                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label for="heartDisease" class="text-sm text-gray-600 dark:text-gray-400">Heart Disease</label>
                            </div>

                            <div class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="diabetes"
                                    bind:checked={hasDiabetes}
                                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label for="diabetes" class="text-sm text-gray-600 dark:text-gray-400">Diabetes</label>
                            </div>

                            <div class="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="kidneyDisease"
                                    bind:checked={hasKidneyDisease}
                                    class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label for="kidneyDisease" class="text-sm text-gray-600 dark:text-gray-400">Kidney Disease</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                class="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Generate Meal Plan
            </button>
        </form>
    </div>
</div> 