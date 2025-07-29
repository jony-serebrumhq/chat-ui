<script lang="ts">
    interface Props {
        products: Array<{
            product_name: string;
            image: string;
            description: string;
            price: string;
            product_link: string;
        }>;
    }

    let { products }: Props = $props();
    
    function handleImageError(event: Event) {
        const imgElement = event.target as HTMLImageElement;
        imgElement.src = 'https://placehold.co/300x200/gray/white?text=No+Image';
    }
</script>

<style>
    .product-image {
        transition: transform 0.3s ease;
    }
    
    .product-image:hover {
        transform: scale(1.05);
    }
    
    .image-container {
        overflow: hidden;
    }
    
    .product-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }
    
    @media (max-width: 640px) {
        .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        }
    }
    
    @media (max-width: 480px) {
        .product-grid {
            grid-template-columns: 1fr;
        }
    }
    
    /* Custom scrollbar styling */
    .scrollbar-custom {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

    .scrollbar-custom::-webkit-scrollbar {
        width: 6px;
    }

    .scrollbar-custom::-webkit-scrollbar-track {
        background: transparent;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }

    .scrollbar-custom::-webkit-scrollbar-thumb:hover {
        background-color: rgba(156, 163, 175, 0.7);
    }
</style>

<div class="my-4 w-full">
    <div class="scrollbar-custom max-h-[500px] overflow-y-auto pr-2">
        <div class="product-grid">
            {#each products as product}
                <div class="flex flex-col rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full">
                    <div class="flex items-center justify-center h-40 bg-gray-100 dark:bg-gray-800 image-container flex-shrink-0">
                        <img 
                            src={product.image} 
                            alt={product.product_name}
                            class="max-w-full max-h-40 object-contain p-2 product-image"
                            onerror={handleImageError}
                        />
                    </div>
                    <div class="p-4 flex flex-col flex-grow">
                        <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">{product.product_name}</h3>
                        <p class="italic text-gray-700 dark:text-gray-300 text-sm mb-2">{product.price}</p>
                        <p class="text-gray-600 dark:text-gray-400 text-xs line-clamp-3 flex-grow">{product.description}</p>
                        <a href={product.product_link} target="_blank" class="text-blue-500 dark:text-blue-400 text-xs mt-3 inline-block hover:underline">View Details</a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div> 