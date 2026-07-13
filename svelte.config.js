import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		runes: ({ filename }) => (filename.split(/[/\\]/).includes('node_modules') ? undefined : true)
	},
	onwarn: (warning, handler) => {
		if (warning.code.startsWith('a11y_')) return;
		handler(warning);
	},
	kit: {
		adapter: adapter({
			fallback: '404.html',
			strict: false
		}),
		prerender: {
			entries: ['*'],
			handleMissingId: 'warn',
			handleHttpError: ({ path, message }) => {
				console.warn(`[prerender] ${path}: ${message}`);
			}
		},
		alias: {
			$lib: './src/lib'
		}
	}
};

export default config;
