<script lang="ts">
	import { ArrowUp } from '@lucide/svelte';

	let visible = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const f = () => { visible = window.scrollY > 400; };
		window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	});

	function top() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<button
	onclick={top}
	aria-label="回到顶端"
	class="fixed bottom-6 right-6 z-50 flex size-10 cursor-pointer items-center justify-center rounded-full border bg-background text-foreground shadow-lg transition-all duration-500 hover:shadow-xl"
	class:opacity-100={visible}
	class:opacity-0={!visible}
	class:translate-y-0={visible}
	class:translate-y-4={!visible}
	class:pointer-events-auto={visible}
	class:pointer-events-none={!visible}
>
	<ArrowUp class="!size-[18px]" />
</button>
