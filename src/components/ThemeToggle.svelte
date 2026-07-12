<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

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
	<Button variant="ghost" size="icon-sm" onclick={toggle}>
		{#if dark}
			<Moon class="!size-[15px]" />
		{:else}
			<Sun class="!size-[15px]" />
		{/if}
	</Button>
{/if}
