<script lang="ts">
	import { ArrowUp } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let visible = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const onScroll = () => { visible = window.scrollY > 400; };
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});

	function scrollTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div
	class="fixed bottom-6 right-6 z-50 transition-all duration-500 {visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}"
>
	<Button
		variant="outline"
		size="icon"
		onclick={scrollTop}
		aria-label="回到顶端"
		class="shadow-lg transition-shadow duration-300 hover:shadow-xl"
	>
		<ArrowUp class="!size-[18px]" />
	</Button>
</div>
