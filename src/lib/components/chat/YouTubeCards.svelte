<script lang="ts">
    interface EducationalVideo {
        nutraceutical_name: string;
        video_link: string;
        video_title: string;
    }

    interface Props {
        videos: EducationalVideo[];
    }

    let { videos }: Props = $props();

    // Function to extract YouTube video ID from URL
    function getYouTubeVideoId(url: string): string | null {
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const match = url.match(regex);
        return match ? match[1] : null;
    }
</script>

<div class="my-4 w-full">
    <div class="scrollbar-custom flex overflow-x-auto pb-4 space-x-4 snap-x">
        {#each videos as video}
            {@const videoId = video.video_link}
            {#if videoId}
                <div class="snap-start flex-shrink-0 w-72 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div class="w-full">
                        <iframe
                            width="100%"
                            height="200"
                            src="https://www.youtube.com/embed/{videoId}"
                            title={video.video_title}
                            frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen
                        ></iframe>
                    </div>
                    <div class="p-3">
                        <h3 class="font-bold text-gray-900 dark:text-gray-100 text-sm line-clamp-2">{video.nutraceutical_name}</h3>
                    </div>
                </div>
            {/if}
        {/each}
    </div>
</div> 