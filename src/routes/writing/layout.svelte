<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { OutlineItem } from '@bcli/plugins';

	interface Props {
		children: Snippet;
		title: string;
		description: string;
		created: string;
		updated: string;
		readingTime: {
			text: string;
			minutes: number;
			time: number;
			words: number;
		};
		outline: OutlineItem[];
	}
	let { children, title, description, created, updated, readingTime, outline }: Props = $props();
</script>

<main>
	<header class="relative">
		<h1>{title}</h1>
		<aside class="absolute right-8 top-2.5 text-right font-mono leading-5 max-lg:hidden">
			{readingTime.text}
			<br />
			{readingTime.words} words
		</aside>
		<nav>
			{#each outline as item}
				item
			{/each}
		</nav>
	</header>

	{@render children()}
</main>
