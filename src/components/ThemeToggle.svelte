<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	type Theme = 'system' | 'light' | 'dark';

	let theme = $state<Theme>('system');
	let mounted = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('theme') as Theme | null;
		theme = stored ?? 'system';
		mounted = true;
	});

	$effect(() => {
		if (!mounted) return;
		applyTheme(theme);
	});

	function resolve(t: Theme): boolean {
		if (typeof window === 'undefined') return false;
		if (t === 'dark') return true;
		if (t === 'light') return false;
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function applyTheme(t: Theme) {
		if (typeof document === 'undefined') return;
		document.documentElement.classList.toggle('dark', resolve(t));
	}

	function toggle() {
		const current = resolve(theme);
		if (theme === 'system') {
			theme = current ? 'light' : 'dark';
		} else if (theme === 'dark') {
			theme = 'light';
		} else {
			theme = 'system';
		}
		localStorage.setItem('theme', theme);
	}

	$effect(() => {
		if (typeof window === 'undefined') return;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		function onChange() {
			if (!localStorage.getItem('theme') || localStorage.getItem('theme') === 'system') {
				applyTheme('system');
			}
		}
		mq.addEventListener('change', onChange);
		return () => mq.removeEventListener('change', onChange);
	});

	const isDark = $derived(mounted ? resolve(theme) : false);
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={toggle}
	aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
	title={!mounted ? '' : theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色模式' : '亮色模式'}
	class="relative"
>
	{#if isDark}
		<Moon class="!size-4" />
	{:else}
		<Sun class="!size-4" />
	{/if}
</Button>
