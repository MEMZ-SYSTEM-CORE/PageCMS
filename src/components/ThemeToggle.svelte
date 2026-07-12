<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	type Theme = 'system' | 'light' | 'dark';

	let theme = $state<Theme>('system');
	let mounted = $state(false);

	function resolve(t: Theme): boolean {
		if (t === 'dark') return true;
		if (t === 'light') return false;
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}

	function apply() {
		document.documentElement.classList.toggle('dark', resolve(theme));
	}

	function toggle() {
		// cycle: system → dark → light → system
		if (theme === 'system') theme = 'dark';
		else if (theme === 'dark') theme = 'light';
		else theme = 'system';
		localStorage.setItem('theme', theme);
	}

	function handleSystemChange() {
		const stored = localStorage.getItem('theme');
		if (!stored || stored === 'system') {
			document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
		}
	}

	// ---- Client-only initialization ----
	$effect(() => {
		if (typeof window === 'undefined') return;

		// Read saved preference
		const stored = localStorage.getItem('theme') as Theme | null;
		theme = stored ?? 'system';
		mounted = true;

		// Listen for system scheme changes
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		mq.addEventListener('change', handleSystemChange);
		return () => mq.removeEventListener('change', handleSystemChange);
	});

	// Apply theme whenever it changes (client only)
	$effect(() => {
		if (!mounted) return;
		apply();
	});

	const isDark = $derived(mounted ? resolve(theme) : false);
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={toggle}
	aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
	title={mounted ? (theme === 'system' ? '跟随系统' : theme === 'dark' ? '暗色模式' : '亮色模式') : ''}
>
	{#if isDark}
		<Moon class="!size-4" />
	{:else}
		<Sun class="!size-4" />
	{/if}
</Button>
