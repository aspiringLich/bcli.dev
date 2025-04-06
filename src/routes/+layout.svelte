<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<div class="flex flex-col justify-stretch items-center h-full grow">
	<main class="h-full prose grow my-4 max-w-2xl">
		{@render children()}
	</main>
</div>
