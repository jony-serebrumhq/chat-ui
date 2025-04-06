<script lang="ts">
    interface NutraceuticalRecommendation {
        nutraceutical_name: string;
        reason_for_recommendation: string;
        benefits: string;
        interactions_with_users_medications: string;
        best_time_to_take: string;
    }

    interface Props {
        recommendations: NutraceuticalRecommendation[];
    }

    let { recommendations }: Props = $props();
</script>

<div class="my-6 w-full">
    <div class="space-y-4">
        {#each recommendations as recommendation}
            <div class="rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white dark:bg-gray-900">
                <div class="p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-transparent dark:from-purple-900/20 dark:to-transparent">
                    <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100">{recommendation.nutraceutical_name}</h3>
                </div>
                <div class="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="space-y-2">
                        <h4 class="font-medium text-sm text-purple-700 dark:text-purple-400">Reason for recommendation</h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">{recommendation.reason_for_recommendation}</p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-sm text-green-700 dark:text-green-400">Benefits</h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">{recommendation.benefits}</p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-sm text-orange-700 dark:text-orange-400">Potential interactions</h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">{recommendation.interactions_with_users_medications}</p>
                    </div>
                    <div class="space-y-2">
                        <h4 class="font-medium text-sm text-blue-700 dark:text-blue-400">Best time to take</h4>
                        <p class="text-gray-700 dark:text-gray-300 text-sm">{recommendation.best_time_to_take}</p>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div> 