<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    
    const settings = useSettingsStore();
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    // Section 1 - Health Goals
    let primaryHealthGoal = $state('Improved Energy');
    let secondaryHealthGoal = $state('Better sleep');

    // Section 2 - General Information
    let gender = $state('Male');
    let age = $state(35);
    let height = $state("5'8\" (172.72 cm)");
    let weight = $state('150-170');
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
    let plantBasedPreference = $state('No Preference');

    // Section 6 - Additional Information
    let additionalInfo = $state('');

    // Dropdown Options
    const healthGoalOptions = [
        'Weight loss', 
        'Muscle Gain', 
        'Improved Energy', 
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

    const weightOptions = [
        '50-70', 
        '70-90', 
        '90-110', 
        '110-130', 
        '130-150', 
        '150-170', 
        '170-190', 
        '190-210', 
        '210+'
    ];

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
        'Team Sports', 
        'None'
    ];

    const priceRangeOptions = [
        '10$-20$', 
        '20$-40$', 
        '40$+', 
        'No limit'
    ];

    const ingredientPreferenceOptions = [
        'Minimal', 
        'Extensive'
    ];

    const plantBasedOptions = [
        'Yes', 
        'No', 
        'No Preference'
    ];

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

    function generatePrompt() {
        // Format multi-select values for the prompt
        const allergiesStr = allergiesIntolerances.includes('None') ? 'None' : allergiesIntolerances.join(', ');
        const healthConditionsStr = healthConditions.includes('None') ? 'None' : healthConditions.join(', ');
        const symptomsStr = symptoms.includes('None') ? 'None' : symptoms.join(', ');
        const exerciseTypesStr = exerciseTypes.includes('None') ? 'None' : exerciseTypes.join(', ');

        return `Based on my health information, please recommend supplements that might be beneficial:

HEALTH GOALS:
Primary Health Goal: ${primaryHealthGoal}
Secondary Health Goal: ${secondaryHealthGoal}

GENERAL INFORMATION:
Gender: ${gender}
Age: ${age}
Height: ${height}
Weight: ${weight} lb
Allergies/Intolerances: ${allergiesStr}

MEDICAL AND HEALTH CONDITIONS:
Existing Health Conditions: ${healthConditionsStr}
Symptoms Experienced: ${symptomsStr}
Current Medications: ${medications || 'None'}

LIFESTYLE AND ACTIVITY:
Exercise Frequency: ${exerciseFrequency}
Exercise Types: ${exerciseTypesStr}

PREFERENCES:
Price Range: ${priceRange}
Ingredient Preference: ${ingredientPreference}
Plant-Based Preference: ${plantBasedPreference}

ADDITIONAL INFORMATION:
${additionalInfo || 'None'}

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
            <!-- Section 1: Health Goals -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('healthGoals')}
                >
                    <span class="font-medium">Health Goals</span>
                    <span class="chevron transform {openSections.healthGoals ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.healthGoals ? '500px' : '0'}; opacity: {openSections.healthGoals ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
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
                    on:click={() => toggleSection('generalInfo')}
                >
                    <span class="font-medium">General Information</span>
                    <span class="chevron transform {openSections.generalInfo ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.generalInfo ? '800px' : '0'}; opacity: {openSections.generalInfo ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
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
                                <label for="age" class="text-sm text-gray-600 dark:text-gray-400">What is your age?</label>
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
                                <label for="weight" class="text-sm text-gray-600 dark:text-gray-400">What is your weight (Pounds/lb)?</label>
                                <select
                                    id="weight"
                                    bind:value={weight}
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                >
                                    {#each weightOptions as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="allergies" class="text-sm text-gray-600 dark:text-gray-400">Do you have any known allergies or intolerances?</label>
                                <select
                                    id="allergies"
                                    multiple
                                    size="4"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    on:change={(e) => allergiesIntolerances = handleMultiSelect(e, allergyOptions, allergiesIntolerances)}
                                >
                                    {#each allergyOptions as option}
                                        <option 
                                            value={option} 
                                            selected={allergiesIntolerances.includes(option)}
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
            </div>

            <!-- Section 3: Medical and Health Conditions -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
                    type="button"
                    class="w-full px-4 py-2 text-left flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    on:click={() => toggleSection('medicalConditions')}
                >
                    <span class="font-medium">Medical and Health Conditions</span>
                    <span class="chevron transform {openSections.medicalConditions ? 'rotate-180' : ''}">▼</span>
                </button>
                
                <div 
                    class="accordion-content overflow-hidden"
                    style="max-height: {openSections.medicalConditions ? '800px' : '0'}; opacity: {openSections.medicalConditions ? '1' : '0'}"
                >
                    <div class="p-4 border-t dark:border-gray-700">
                        <div class="flex flex-col gap-4">
                            <div class="flex flex-col gap-2">
                                <label for="healthConditions" class="text-sm text-gray-600 dark:text-gray-400">Do you have any existing health conditions?</label>
                                <select
                                    id="healthConditions"
                                    multiple
                                    size="4"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    on:change={(e) => healthConditions = handleMultiSelect(e, healthConditionOptions, healthConditions)}
                                >
                                    {#each healthConditionOptions as option}
                                        <option 
                                            value={option} 
                                            selected={healthConditions.includes(option)}
                                        >
                                            {option}
                                        </option>
                                    {/each}
                                </select>
                                <span class="text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</span>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="symptoms" class="text-sm text-gray-600 dark:text-gray-400">Have you experienced any of the following?</label>
                                <select
                                    id="symptoms"
                                    multiple
                                    size="4"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                    on:change={(e) => symptoms = handleMultiSelect(e, symptomOptions, symptoms)}
                                >
                                    {#each symptomOptions as option}
                                        <option 
                                            value={option} 
                                            selected={symptoms.includes(option)}
                                        >
                                            {option}
                                        </option>
                                    {/each}
                                </select>
                                <span class="text-xs text-gray-500">Hold Ctrl (or Cmd) to select multiple options</span>
                            </div>

                            <div class="flex flex-col gap-2">
                                <label for="medications" class="text-sm text-gray-600 dark:text-gray-400">Are you currently taking any medications?</label>
                                <textarea
                                    id="medications"
                                    bind:value={medications}
                                    placeholder="Please list any medications you're currently taking"
                                    rows="3"
                                    class="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 text-sm"
                                ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Section 4: Lifestyle and Activity -->
            <div class="border rounded-lg dark:border-gray-700">
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
            </div>

            <!-- Section 5: Preferences -->
            <div class="border rounded-lg dark:border-gray-700">
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
            </div>

            <!-- Section 6: Additional Information -->
            <div class="border rounded-lg dark:border-gray-700">
                <button
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
                >
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