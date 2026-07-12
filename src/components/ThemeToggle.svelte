<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';

	let dark = $state(false);
	let ok = $state(false);
	let btnCls = $state('');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const d = localStorage.getItem('theme') === 'dark'
			|| (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', d);
		dark = d;
		ok = true;
		btnCls = d
			? 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-secondary border-border'
			: 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-muted border-border';
		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const h = () => {
			if (!localStorage.getItem('theme')) {
				const v = mq.matches;
				document.documentElement.classList.toggle('dark', v);
				dark = v;
				btnCls = v
					? 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-secondary border-border'
					: 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-muted border-border';
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
		btnCls = v
			? 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-secondary border-border'
			: 'inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:opacity-80 bg-muted border-border';
	}
</script>

{#if ok}
	<button onclick={toggle} class={btnCls} aria-label={dark ? '切换到亮色模式' : '切换到暗色模式'}>
		{#if dark}
			<Moon class="!size-3.5" />
			<span>深色</span>
		{:else}
			<Sun class="!size-3.5" />
			<span>浅色</span>
		{/if}
	</button>
{/if}
