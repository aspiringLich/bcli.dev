<script lang="ts">
	import { onMount } from 'svelte';
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

	let activeId = $state<string | null>(null);
	let pastIds = $state<Set<string>>(new Set());

	onMount(() => {
		const updateActiveSection = () => {
			const sections = outline.map((item) => document.getElementById(item.id)).filter(Boolean);
			const scrollPosition = window.scrollY + window.innerHeight / 3;
			
			// if were at the bottom, set all sections as past
			if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
				activeId = null;
				pastIds = new Set(sections.map((sec) => sec!.id));
				return;
			}

			let currentId: string | null = null;
			const newPastIds = new Set<string>();

			for (let i = sections.length - 1; i >= 0; i--) {
				const section = sections[i];
				if (section && section.offsetTop <= scrollPosition) {
					currentId = section.id;
					// Mark all previous sections as past
					for (let j = 0; j < i; j++) {
						const sec = sections[j];
						if (sec !== null) {
							newPastIds.add(sec.id);
						}
					}
					break;
				}
			}

			activeId = currentId;
			pastIds = newPastIds;
		};

		window.addEventListener('scroll', updateActiveSection);
		updateActiveSection();

		return () => {
			window.removeEventListener('scroll', updateActiveSection);
		};
	});
</script>

<main class="relative">
	<header class="flex items-center pt-20 gap-4">
		<hr class="grow border-2 !border-surface-400"/>
		<h1 class="!m-0">{title}</h1>
		<hr class="grow border-2 !border-surface-400"/>
	</header>
	<aside class="select-none">
		<div class="py-2 pl-6 rounded-l-full bg-surface-200 italic text-nowrap">
			{readingTime.text}
			<br />
			{readingTime.words} words
		</div>
		{#if outline.length > 0}
			<nav class="mt-4 sticky top-8">
				<span class="font-semibold">Outline</span>
				<ul class="!m-0 !mt-2 !pl-0">
					{#each outline as item}
						<li class:past={pastIds.has(item.id)} class:reading={activeId === item.id}>
							<a href={'#' + item.id} class="text-primary hover:underline">{@html item.html}</a>
						</li>
					{/each}
				</ul>
			</nav>
		{/if}
	</aside>
	{@render children()}
</main>

<style lang="postcss">
	@import 'tailwindcss';
	
	aside {
		@apply xl:!-right-10 z-20;
	}

	nav li {
		@apply list-none border-l-4 !m-0 !p-0;
		border-color: var(--color-surface-400);
		transition:
			border-color,
			color,
			background-color 0.3s;
		color: var(--color-surface-400);
		background-color: var(--color-surface-200);

		a {
			@apply block py-1 pl-2  xl:border-r-2;
			border-color: var(--color-surface-400);
			color: inherit !important;
		}

		&:first-of-type {
			@apply rounded-tl-sm xl:rounded-tr-sm;
			a {
				@apply rounded-tr-sm;
			}
		}
		&:last-of-type {
			@apply rounded-bl-sm xl:rounded-br-sm;
			a {
				@apply rounded-br-sm;
			}
		}

		&:hover {
			border-color: var(--color-accent-500) !important;
			color: var(--color-accent-500) !important;
		}

		&.past {
			border-color: var(--color-accent-500);
			color: var(--color-surface-500);
		}

		&.reading {
			border-color: var(--color-accent-500);
			color: var(--color-accent-500);
			background-color: var(--color-accent-200);
		}
	}
</style>
