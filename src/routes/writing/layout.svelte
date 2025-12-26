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
			if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
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
	<h1>{title}</h1>
	<p class="text-italic font-rounded font-semibold text-surface-600 !mt-0">
		{readingTime.text}
	</p>
	{@render children()}
</main>

