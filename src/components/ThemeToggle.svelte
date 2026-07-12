<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let dark = $state(false);
	let mounted = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('theme');
		dark = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', dark);
		mounted = true;

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const handler = () => {
			if (!localStorage.getItem('theme')) {
				const now = mq.matches;
				document.documentElement.classList.toggle('dark', now);
				dark = now;
			}
		};
		mq.addEventListener('change', handler);
		return () => mq.removeEventListener('change', handler);
	});

	function toggle() {
		const isDark = !document.documentElement.classList.contains('dark');
		document.documentElement.classList.toggle('dark', isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');
		dark = isDark;
	}
</script>

{#if mounted}
	<Button
		variant="ghost"
		size="icon-sm"
		onclick={toggle}
		aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
	>
		{#if dark}
			<Moon class="!size-[15px]" />
		{:else}
			<Sun class="!size-[15px]" />
		{/if}
	</Button>
{/if}
