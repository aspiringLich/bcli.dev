import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import sectionize from 'remark-sectionize';

const config = {
	preprocess: [vitePreprocess(), mdsvex({ remarkPlugins: [sectionize] })],
	kit: { adapter: adapter() },
	extensions: ['.svelte', '.svx']
};

export default config;
