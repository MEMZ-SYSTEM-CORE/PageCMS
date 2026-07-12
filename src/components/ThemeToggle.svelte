<script lang="ts">
import { Moon, Sun } from '@lucide/svelte';

	let dark = $state(false);
	let ok = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const d = localStorage.getItem('theme') === 'dark'
			|| (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', d);
		dark = d;
		ok = true;
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const h = () => {
			if (!localStorage.getItem('theme')) {
				const v = mq.matches;
				document.documentElement.classList.toggle('dark', v);
				dark = v;
			}
		};
		mq.addEventListener('change', h);
		return () => mq.removeEventListener('change', h);
	});

	function toggle() {
		const v = !document.documentElement.classList.contains('dark');
		document.documentElement.classList.toggle('dark', v);
		localStorage.setItem('theme', v ? 'dark' : 'light');
		dark = v;
	}
</script>

{#if ok}
	<button
		onclick={toggle}
		aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}
		class="shrink-0 hover:opacity-80 transition-opacity text-sm text-muted-foreground"
	>
		{#if dark}
			<Moon class="!size-[18px]" />
		{:else}
			<Sun class="!size-[18px]" />
		{/if}
	</button>
{/if}
