<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    
    const settings = useSettingsStore();
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    let age = $state(35);
    let gender = $state('Male');
    let currentMedications = $state('');
    let healthConcerns = $state('');
    let allergies = $state('');
    let dietaryRestrictions = $state('None');

    const genderOptions = [
        'Male',
        'Female',
        'Other'
    ];

    const dietaryRestrictionOptions = [
        'None',
        'Vegetarian',
        'Vegan',
        'Gluten-free',
        'Dairy-free',
        'Nut-free',
        'Kosher',
        'Halal'
    ];

    // Add state for accordion sections
    let openSections = $state({
        basicInfo: true,
        healthInfo: false,
        dietaryRestrictions: false
    });

    function toggleSection(section: keyof typeof openSections) {
        openSections[section] = !openSections[section];
    }

    function generatePrompt() {
        return `Based on my health information, please recommend supplements that might be beneficial:

Age: ${age}
Gender: ${gender}
Current Medications: ${currentMedications || 'None'}
Health Concerns: ${healthConcerns || 'General wellness'}
Allergies: ${allergies || 'None'}
Dietary Restrictions: ${dietaryRestrictions}

Please provide detailed information about each recommended supplement, including potential interactions with my medications and any relevant educational resources.`;
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
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Supplement Information</h2>
        </div>

        <form 
            on:submit={handleSubmit} 
            class="flex flex-1 flex-col gap-4 overflow-y-auto custom-scrollbar p-4 pt-0"
        >
            <!-- Section 1: Basic Info -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('basicInfo')}
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
                                <label for="gender" class="text-sm text-gray-600 dark:text-gray-400">Gender</label>
                                <select
                                    id="gender"
                                    bind:value={gender}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each genderOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2: Health Information -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('healthInfo')}
                >
                    <span class="font-medium">Health Information</span>
                    <span class="chevron transform {openSections.healthInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.healthInfo ? '800px' : '0'}; opacity: {openSections.healthInfo ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="currentMedications" class="text-sm text-gray-600 dark:text-gray-400">Current Medications</label>
                                <textarea
                                    id="currentMedications"
                                    bind:value={currentMedications}
                                    placeholder="List any medications you're currently taking"
                                    rows="3"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                ></textarea>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="healthConcerns" class="text-sm text-gray-600 dark:text-gray-400">Health Concerns</label>
                                <textarea
                                    id="healthConcerns"
                                    bind:value={healthConcerns}
                                    placeholder="Describe any health issues or concerns you have"
                                    rows="3"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                ></textarea>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="allergies" class="text-sm text-gray-600 dark:text-gray-400">Allergies</label>
                                <textarea
                                    id="allergies"
                                    bind:value={allergies}
                                    placeholder="List any allergies or sensitivities"
                                    rows="2"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3: Dietary Restrictions -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('dietaryRestrictions')}
                >
                    <span class="font-medium">Dietary Preferences</span>
                    <span class="chevron transform {openSections.dietaryRestrictions ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.dietaryRestrictions ? '500px' : '0'}; opacity: {openSections.dietaryRestrictions ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="dietaryRestrictions" class="text-sm text-gray-600 dark:text-gray-400">Dietary Restrictions</label>
                                <select
                                    id="dietaryRestrictions"
                                    bind:value={dietaryRestrictions}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each dietaryRestrictionOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                class="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
                Get Supplement Recommendations
            </button>
        </form>
    </div>
</div> 