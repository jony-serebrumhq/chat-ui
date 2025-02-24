<script lang="ts">
    interface Props {
        data: Record<string, any> | Record<string, any>[];
    }

    let { data }: Props = $props();

    interface TableData {
        headers: string[];
        rows: Record<string, any>[];
    }

    function isArrayOfObjects(value: unknown): value is Record<string, any>[] {
        return Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0] !== null;
    }

    function createTableData(data: Props['data']): TableData {
        if (isArrayOfObjects(data)) {
            return {
                headers: Object.keys(data[0]),
                rows: data
            };
        } else if (typeof data === 'object' && data !== null) {
            return {
                headers: ['Key', 'Value'],
                rows: Object.entries(data).map(([key, value]) => ({
                    Key: key,
                    Value: typeof value === 'object' ? JSON.stringify(value) : String(value)
                }))
            };
        }
        return { headers: [], rows: [] };
    }

    let tableData = $derived(createTableData(data));
</script>

<div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
    <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
                {#each tableData.headers as header}
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{header}</th>
                {/each}
            </tr>
        </thead>
        <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {#each tableData.rows as row}
                <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    {#each tableData.headers as header}
                        <td class="px-6 py-4 whitespace-pre-wrap text-sm text-gray-500 dark:text-gray-400">{row[header]}</td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div> 