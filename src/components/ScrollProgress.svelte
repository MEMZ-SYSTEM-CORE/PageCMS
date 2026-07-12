<script lang="ts">
	let progress = $state(0);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const f = () => {
			const h = document.documentElement.scrollHeight - window.innerHeight;
			progress = h > 0 ? Math.min((window.scrollY / h) * 100, 100) : 0;
		};
		window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	});
</script>

<div class="fixed inset-x-0 top-0 z-[60] h-[3px] bg-border" aria-hidden="true">
	<div
		class="h-full bg-foreground transition-all duration-150 ease-out"
		style="width: {progress}%"
	/>
</div>
