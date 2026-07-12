<script lang="ts">
	import { ArrowRight, BookOpen } from '@lucide/svelte';

	let { postCount = 0 }: { postCount?: number } = $props();
</script>

<section class="mb-8 text-center">
	<div class="animate-fade-up space-y-3">
		<h1 class="text-3xl font-bold sm:text-4xl">
			MEMZ-SYSTEM-CORE
		</h1>
		<p class="text-sm text-muted-foreground max-w-md mx-auto">
			分享技术、想法和经验
		</p>
		<p class="text-xs text-muted-foreground/60">
			{postCount} 篇文章 · 基于 Astro · PagesCMS
		</p>
	</div>
</section>
