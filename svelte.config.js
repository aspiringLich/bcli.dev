import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sectionize from 'remark-sectionize';
import readingTime from 'mdsvex-reading-time';
import { outline } from '@bcli/plugins';

const config = {
	preprocess: [
		vitePreprocess(),
		mdsvex({
			remarkPlugins: [sectionize, readingTime, outline],
			rehypePlugins: [],
			layout: './src/routes/writing/layout.svelte'
		})
	],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;
