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
        transform: scale(1.15);
    }
    
    .image-container {
        overflow: hidden;
    }
</style>

<div class="my-4 w-full">
    <div class="scrollbar-custom flex overflow-x-auto pb-4 space-x-4 snap-x">
        {#each products as product}
            <div class="snap-start flex-shrink-0 w-64 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center justify-center h-48 bg-gray-100 dark:bg-gray-800 image-container">
                    <img 
                        src={product.image} 
                        alt={product.product_name}
                        class="max-w-full max-h-48 object-contain p-2 product-image"
                        onerror={handleImageError}
                    />
                </div>
                <div class="p-4">
                    <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1 line-clamp-2">{product.product_name}</h3>
                    <p class="italic text-gray-700 dark:text-gray-300 text-sm mb-2">{product.price}</p>
                    <p class="text-gray-600 dark:text-gray-400 text-xs line-clamp-3">{product.description}</p>
                    <a href={product.product_link} target="_blank" class="text-blue-500 dark:text-blue-400 text-xs mt-2 inline-block">Buy Now</a>
                </div>
            </div>
        {/each}
    </div>
</div> 