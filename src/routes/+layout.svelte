<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex flex-col justify-stretch items-center h-full grow">
	<main class="h-full prose grow my-4 max-w-96 sm:max-w-lg md:max-w-xl lg:max-w-2xl 2xl:max-w-3xl mx-8">
		{@render children()}
	</main>
</div>
