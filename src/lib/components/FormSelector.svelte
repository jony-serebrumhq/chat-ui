<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    import StatsForm from "./StatsForm.svelte";
    import SupplementForm from "./SupplementForm.svelte";
    import ResearchForm from "./ResearchForm.svelte";

    // Define model identifiers
    const SUPPLEMENT_MODEL_NAME = "Supplement Agent"; // This should match the model ID in your models configuration
    const DIETITIAN_MODEL_NAME = "Dietitian Agent"; // This should match your dietitian model ID
    const RESEARCH_MODEL_NAME = "Supplement Vector Search"; // The new model identifier

    const settings = useSettingsStore();
    
    const dispatch = createEventDispatcher<{
        message: string;
    }>();

    function handleMessage(event: CustomEvent<string>) {
        dispatch("message", event.detail);
    }
</script>

<div class="h-full">
    {#if $settings.activeModel === SUPPLEMENT_MODEL_NAME}
        <!-- Show Supplement form when the Supplement model is selected -->
        <SupplementForm on:message={handleMessage} />
    {:else if $settings.activeModel === DIETITIAN_MODEL_NAME}
        <!-- Show the StatsForm (Dietitian form) when the Dietitian model is selected -->
        <StatsForm on:message={handleMessage} />
    {:else if $settings.activeModel === RESEARCH_MODEL_NAME}
        <!-- Show the ResearchForm when the Research model is selected -->
        <ResearchForm on:message={handleMessage} />
    {:else}
        <!-- Default case for all other models -->
        <!-- <SupplementForm on:message={handleMessage} /> -->
    {/if}
</div> 