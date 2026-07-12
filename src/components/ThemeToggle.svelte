<script lang="ts">
	import { Moon, Sun, Monitor } from '@lucide/svelte';

	let dark = $state(false);
	let ok = $state(false);
	let modeText = $state('跟随系统');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const stored = localStorage.getItem('theme');
		const d = stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
		document.documentElement.classList.toggle('dark', d);
		dark = d;
		modeText = stored === 'dark' ? '深色' : stored === 'light' ? '浅色' : '跟随系统';
		ok = true;

		const mq = window.matchMedia('(prefers-color-scheme: dark)');
		const h = () => {
			if (!localStorage.getItem('theme')) {
				const v = mq.matches;
				document.documentElement.classList.toggle('dark', v);
				dark = v;
				modeText = '跟随系统';
			}
		};
		mq.addEventListener('change', h);
		return () => mq.removeEventListener('change', h);
	});

	function toggle() {
		const stored = localStorage.getItem('theme');
		if (!stored || stored === 'system') {
			localStorage.setItem('theme', 'dark');
			dark = true;
			modeText = '深色';
		} else if (stored === 'dark') {
			localStorage.setItem('theme', 'light');
			dark = false;
			modeText = '浅色';
		} else {
			localStorage.removeItem('theme');
			const sys = window.matchMedia('(prefers-color-scheme: dark)').matches;
			dark = sys;
			modeText = '跟随系统';
		}
		document.documentElement.classList.toggle('dark', dark);
	}
</script>

{#if ok}
	<button
		onclick={toggle}
		class="ring-foreground/10 inline-flex items-center gap-2 rounded-full ring-1 px-3 py-1.5 text-xs font-medium transition-all hover:shadow-sm cursor-pointer"
		aria-label="切换主题"
	>
		{#if modeText === '深色'}
			<Moon class="!size-3.5" />
		{:else if modeText === '浅色'}
			<Sun class="!size-3.5" />
		{:else}
			<Monitor class="!size-3.5" />
		{/if}
		<span class="hidden sm:inline">{modeText}</span>
	</button>
{/if}
