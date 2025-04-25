<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    import { chatInputContent } from "$lib/stores/chatInput";
    import { tick } from "svelte";
    
    const settings = useSettingsStore();
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    // Section 1 - Health Goals
    let primaryHealthGoal = $state('Improved energy');
    let secondaryHealthGoal = $state('Better sleep');

    // Section 2 - General Information
    let gender = $state('Male');
    let age = $state(35);
    let height = $state("5'8\" (172.72 cm)");
    let weight = $state(170);
    let allergiesIntolerances = $state(['None']);

    // Section 3 - Medical and Health Conditions
    let healthConditions = $state(['None']);
    let symptoms = $state(['None']);
    let medications = $state('');

    // Section 4 - Lifestyle and Activity
    let exerciseFrequency = $state('3-4 times per week');
    let exerciseTypes = $state(['Cardio']);

    // Section 5 - Preferences
    let priceRange = $state('20$-40$');
    let ingredientPreference = $state('Minimal');
    let plantBasedPreference = $state('No preference');

    // Section 6 - Additional Information
    let additionalInfo = $state('');

    // Dropdown Options
    const healthGoalOptions = [
        'Weight loss', 
        'Muscle gain', 
        'Improved energy', 
        'Boosted immunity', 
        'Better sleep', 
        'Enhanced focus and mental clarity', 
        'Healthy aging'
    ];

    const genderOptions = [
        'Male',
        'Female',
        'Non-binary',
        'Prefer not to say'
    ];

    // Generate height options from 4'0" to 6'6"
    const heightOptions: string[] = [];
    for (let feet = 4; feet <= 6; feet++) {
        for (let inches = 0; inches <= (feet === 6 ? 6 : 11); inches++) {
            const totalInches = feet * 12 + inches;
            const cm = Math.round(totalInches * 2.54 * 100) / 100;
            heightOptions.push(`${feet}'${inches}" (${cm} cm)`);
        }
    }

    // const weightOptions = [
    //     '50-70', 
    //     '70-90', 
    //     '90-110', 
    //     '110-130', 
    //     '130-150', 
    //     '150-170', 
    //     '170-190', 
    //     '190-210', 
    //     '210+'
    // ];

    const allergyOptions = [
        'Dairy', 
        'Gluten', 
        'Nuts', 
        'Soy', 
        'Shellfish', 
        'None'
    ];

    const healthConditionOptions = [
        'High blood pressure', 
        'Diabetes', 
        'Thyroid issue', 
        'Arthritis', 
        'Heart disease', 
        'High cholesterol', 
        'None'
    ];

    const symptomOptions = [
        'Digestive issues', 
        'Joint pain', 
        'Fatigue', 
        'Frequent colds or infections', 
        'Poor sleep quality', 
        'None'
    ];

    const exerciseFrequencyOptions = [
        'Never', 
        '1-2 times per week', 
        '3-4 times per week', 
        '5+ times per week'
    ];

    const exerciseTypeOptions = [
        'Cardio', 
        'Yoga/Pilates', 
        'Weightlifting', 
        'Team sports', 
        'None'
    ];

    const priceRangeOptions = [
        '10$-20$', 
        '20$-40$', 
        '40$+', 
        'No limit'
    ];

    // const ingredientPreferenceOptions = [
    //     'Minimal', 
    //     'Extensive'
    // ];

    // const plantBasedOptions = [
    //     'Yes', 
    //     'No', 
    //     'No preference'
    // ];

    // Add state for accordion sections
    let openSections = $state({
        healthGoals: true,
        generalInfo: false,
        medicalConditions: false,
        lifestyleActivity: false,
        preferences: false,
        additionalInfo: false
    });

    function toggleSection(section: keyof typeof openSections) {
        openSections[section] = !openSections[section];
    }

    // Handle multi-select changes
    function handleMultiSelect(event: Event, options: string[], currentSelections: string[]): string[] {
        const target = event.target as HTMLSelectElement;
        const selectedOptions = Array.from(target.selectedOptions).map(option => option.value);
        
        // If "None" is selected, remove all other options
        if (selectedOptions.includes('None')) {
            return ['None'];
        }
        
        // If any other option is selected, remove "None"
        const newSelections = selectedOptions.filter(option => option !== 'None');
        return newSelections.length > 0 ? newSelections : ['None'];
    }

    // Handle checkbox changes for multi-select
    function handleCheckboxChange(value: string, currentSelections: string[]): string[] {
        // If selecting "None"
        if (value === 'None') {
            // If None was already selected, keep None selected
            if (currentSelections.includes('None')) {
                return ['None'];
            }
            // Otherwise, select only None and deselect others
            return ['None'];
        }
        
        // If selecting a non-None option
        if (currentSelections.includes(value)) {
            // If option was already selected, remove it
            const newSelections = currentSelections.filter(option => option !== value);
            // If no options left, default to None
            return newSelections.length > 0 ? newSelections.filter(option => option !== 'None') : ['None'];
        } else {
            // Add the new option and remove None if it was selected
            return [...currentSelections.filter(option => option !== 'None'), value];
        }
    }

    function generatePrompt() {
        // Format multi-select values for the prompt
        const allergiesStr = allergiesIntolerances.includes('None') ? 'None' : allergiesIntolerances.join(', ');
        const healthConditionsStr = healthConditions.includes('None') ? 'None' : healthConditions.join(', ');
        const symptomsStr = symptoms.includes('None') ? 'None' : symptoms.join(', ');
        const exerciseTypesStr = exerciseTypes.includes('None') ? 'None' : exerciseTypes.join(', ');

        return `Based on my profile below, recommend me supplements that might be beneficial:

Primary Health Goal: ${primaryHealthGoal}
Secondary Health Goal: ${secondaryHealthGoal}
Gender: ${gender}
Age: ${age}
Height: ${height}
Weight: ${weight} lb
Existing Health Conditions: ${healthConditionsStr}
Symptoms Experienced: ${symptomsStr}
Allergies/Intolerances: ${allergiesStr}
Current Medications: ${medications || 'None'}

ADDITIONAL INFORMATION:
${additionalInfo || 'None'}
`;
    }

    const handleSubmit = async (e: Event) => {
        // Stop the event from propagating
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        // Set the prompt content to the chatInputContent store
        const prompt = generatePrompt();
        chatInputContent.set(prompt);
        
        // Wait for the DOM to update
        await tick();
        
        // Find the chat input form and submit it
        const chatForm = document.querySelector('form[aria-label="file dropzone"]');
        if (chatForm) {
            // Create and dispatch a submit event
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            chatForm.dispatchEvent(submitEvent);
        }
    };
</script>

<style>
    /* Add smooth transition styles */
    .accordion-content {
        transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
        overflow: hidden;
    }
    
    .accordion-content.closed {
        max-height: 0;
        opacity: 0;
        padding: 0;
        border-top-width: 0;
    }
    
    .accordion-content.open {
        max-height: 2000px; /* Large enough to contain all content */
        opacity: 1;
    }

    .accordion-inner {
        padding: 1rem;
        border-top-width: 1px;
        border-color: inherit;
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
            <h2 class="text-lg font-semibold text-gray-700 dark:text-gray-300">Recommendation Form</h2>
        </div>

        <form 
            onsubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
                return false;
            }} 
            class="flex flex-1 flex-col gap-4 overflow-y-auto custom-scrollbar p-4 pt-0"
        >
            <!-- Section 1: Health Goals -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('healthGoals')}
                >
                    <span class="font-medium">Health Goals</span>
                    <span class="chevron transform {openSections.healthGoals ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div class="accordion-content {openSections.healthGoals ? 'open' : 'closed'}">
                    <div class="accordion-inner border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="primaryHealthGoal" class="text-sm text-gray-600 dark:text-gray-400">What is your primary health goal?</label>
                                <select
                                    id="primaryHealthGoal"
                                    bind:value={primaryHealthGoal}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each healthGoalOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="secondaryHealthGoal" class="text-sm text-gray-600 dark:text-gray-400">Do you have any secondary health goals?</label>
                                <select
                                    id="secondaryHealthGoal"
                                    bind:value={secondaryHealthGoal}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each healthGoalOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 2: General Information -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('generalInfo')}
                >
                    <span class="font-medium">General Information</span>
                    <span class="chevron transform {openSections.generalInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div class="accordion-content {openSections.generalInfo ? 'open' : 'closed'}">
                    <div class="accordion-inner border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="gender" class="text-sm text-gray-600 dark:text-gray-400">What is your gender?</label>
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

                            <div class="flex flex-col gap-2">
                                <label for="age" class="text-sm text-gray-600 dark:text-gray-400">What is your age (years)?</label>
                                <div class="flex items-center gap-2">
                                    <input
                                        id="age-range"
                                        type="range"
                                        bind:value={age}
                                        min="0"
                                        max="150"
                                        step="1"
                                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <input
                                        id="age-display"
                                        type="number"
                                        value={age}
                                        readonly
                                        class="w-16 text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm"
                                    />
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="height" class="text-sm text-gray-600 dark:text-gray-400">What is your height?</label>
                                <select
                                    id="height"
                                    bind:value={height}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each heightOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="weight" class="text-sm text-gray-600 dark:text-gray-400">What is your weight (lb)?</label>
                                <div class="flex items-center gap-2">
                                    <input
                                        id="weight-range"
                                        type="range"
                                        bind:value={weight}
                                        min="50"
                                        max="350"
                                        step="1"
                                        class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                                    />
                                    <input
                                        id="weight-display"
                                        type="number"
                                        value={weight}
                                        readonly
                                        class="w-16 text-center rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 py-1 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 3: Medical and Health Conditions -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    onclick={() => toggleSection('medicalConditions')}
                >
                    <span class="font-medium">Medical and Health Conditions</span>
                    <span class="chevron transform {openSections.medicalConditions ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div class="accordion-content {openSections.medicalConditions ? 'open' : 'closed'}">
                    <div class="accordion-inner border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label class="text-sm text-gray-600 dark:text-gray-400">Do you have any existing health conditions?</label>
                                <div class="flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                                    {#each healthConditionOptions as option}
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={option}
                                                checked={healthConditions.includes(option)}
                                                onchange={() => healthConditions = handleCheckboxChange(option, healthConditions)}
                                                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-500"
                                            />
                                            <span class="text-sm">{option}</span>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="symptoms" class="text-sm text-gray-600 dark:text-gray-400">Have you experienced any of the following?</label>
                                <div class="flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                                    {#each symptomOptions as option}
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={option}
                                                checked={symptoms.includes(option)}
                                                onchange={() => symptoms = handleCheckboxChange(option, symptoms)}
                                                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-500"
                                            />
                                            <span class="text-sm">{option}</span>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="allergies" class="text-sm text-gray-600 dark:text-gray-400">Do you have any known allergies or intolerances?</label>
                                <div class="flex flex-col gap-1 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-3">
                                    {#each allergyOptions as option}
                                        <label class="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={option}
                                                checked={allergiesIntolerances.includes(option)}
                                                onchange={() => allergiesIntolerances = handleCheckboxChange(option, allergiesIntolerances)}
                                                class="rounded border-gray-300 text-purple-600 focus:ring-purple-500 dark:border-gray-500"
                                            />
                                            <span class="text-sm">{option}</span>
                                        </label>
                                    {/each}
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="medications" class="text-sm text-gray-600 dark:text-gray-400">Are you currently taking any medications?</label>
                                <textarea
                                    id="medications"
                                    bind:value={medications}
                                    placeholder="Please list any medications you're currently taking seperated by comma"
                                    rows="3"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 4: Lifestyle and Activity -->
            <!-- <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('lifestyleActivity')}
                >
                    <span class="font-medium">Lifestyle and Activity</span>
                    <span class="chevron transform {openSections.lifestyleActivity ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.lifestyleActivity ? '500px' : '0'}; opacity: {openSections.lifestyleActivity ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="exerciseFrequency" class="text-sm text-gray-600 dark:text-gray-400">How often do you exercise?</label>
                                <select
                                    id="exerciseFrequency"
                                    bind:value={exerciseFrequency}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each exerciseFrequencyOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="exerciseTypes" class="text-sm text-gray-600 dark:text-gray-400">What type of exercise do you do most often?</label>
                                <select
                                    id="exerciseTypes"
                                    multiple
                                    size="4"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    on:change={(e) => exerciseTypes = handleMultiSelect(e, exerciseTypeOptions, exerciseTypes)}
                                >
                                    {#each exerciseTypeOptions as option}
                                        <option 
                                            value={option} 
                                            selected={exerciseTypes.includes(option)}
                                        >
                                            {option}
                                        </option>
                                    {/each}
                                </select>
                                <span class="text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- Section 5: Preferences -->
            <!-- <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('preferences')}
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
                                <label for="priceRange" class="text-sm text-gray-600 dark:text-gray-400">What's your preferred price range for supplements?</label>
                                <select
                                    id="priceRange"
                                    bind:value={priceRange}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each priceRangeOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="ingredientPreference" class="text-sm text-gray-600 dark:text-gray-400">Do you want supplements with minimal ingredients?</label>
                                <select
                                    id="ingredientPreference"
                                    bind:value={ingredientPreference}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each ingredientPreferenceOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="plantBasedPreference" class="text-sm text-gray-600 dark:text-gray-400">Do you prefer plant-based supplements?</label>
                                <select
                                    id="plantBasedPreference"
                                    bind:value={plantBasedPreference}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each plantBasedOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div> -->

            <!-- Section 6: Additional Information -->
            <div class="border rounded-lg dark:border-gray-700">
                
                <!-- <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('additionalInfo')}
                >
                    <span class="font-medium">Additional Information</span>
                    <span class="chevron transform {openSections.additionalInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.additionalInfo ? '500px' : '0'}; opacity: {openSections.additionalInfo ? '1' : '0'}"
                > -->
                    <div class="p-4 border-t dark:border-gray-700">
                    <div class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <label for="additionalInfo" class="text-sm text-gray-600 dark:text-gray-400">Is there anything else we should know to make the best recommendation?</label>
                            <textarea
                                id="additionalInfo"
                                bind:value={additionalInfo}
                                placeholder="Please provide any additional information that might help us make better recommendations"
                                rows="4"
                                class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- </div>  -->
            </div>

            <button
                type="button"
                class="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                onclick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSubmit();
                    return false;
                }}
            >
                Submit
            </button>
        </form>
    </div>
</div> 