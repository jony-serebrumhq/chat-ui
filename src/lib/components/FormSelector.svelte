<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { useSettingsStore } from "$lib/stores/settings";
    import StatsForm from "./StatsForm.svelte";
    import SupplementForm from "./SupplementForm.svelte";

    // Define model identifiers
    const SUPPLEMENT_MODEL_NAME = "Supplement Agent"; // This should match the model ID in your models configuration
    const DIETITIAN_MODEL_NAME = "Dietitian Agent"; // This should match your dietitian model ID

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
        <!-- Default to the StatsForm (Dietitian form) for all other models -->
        <StatsForm on:message={handleMessage} />
    {:else}
        <!-- Default to the StatsForm (Dietitian form) for all other models -->
        <!-- <SupplementForm on:message={handleMessage} /> -->
    {/if}
</div> 