<script lang="ts">
    export let videoId: string;
    export let title: string = "YouTube video";
</script>

<div class="w-72 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
    <iframe
        width="100%"
        height="200"
        src="https://www.youtube.com/embed/{videoId}"
        title={title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
    ></iframe>
</div> 