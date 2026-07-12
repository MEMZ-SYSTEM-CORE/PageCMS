<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let isDark = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		apply();
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', onSystemChange);
		return () => mq.removeEventListener('change', onSystemChange);
	});

	function resolve() {
		const stored = localStorage.getItem('theme');
		if (stored === 'dark') return true;
		if (stored === 'light') return false;
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function apply() {
		const dark = resolve();
		document.documentElement.classList.toggle('dark', dark);
		isDark = dark;
	}

	function toggle() {
		const stored = localStorage.getItem('theme');
		if (!stored || stored === 'system') {
			localStorage.setItem('theme', 'dark');
		} else if (stored === 'dark') {
			localStorage.setItem('theme', 'light');
		} else {
			localStorage.setItem('theme', 'system');
		}
		apply();
	}

	function onSystemChange() {
		const stored = localStorage.getItem('theme');
		if (!stored || stored === 'system') apply();
	}
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={toggle}
	aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
>
	{#if isDark}
		<Moon class="!size-[15px]" />
	{:else}
		<Sun class="!size-[15px]" />
	{/if}
</Button>
