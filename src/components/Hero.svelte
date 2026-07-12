<script lang="ts">
	let { postCount = 0 }: { postCount?: number } = $props();
	const totalWords = postCount * 500;
</script>

<section class="mb-12 text-center">
	<div class="animate-fade-up space-y-4">
		<h1 class="mb-4 text-4xl font-bold">
			MEMZ-SYSTEM-CORE<br />
			<span class="text-muted-foreground">的博客</span>
		</h1>
		<p class="text-sm text-muted-foreground">
			分享技术、想法和经验
		</p>
		<div class="text-xs text-muted-foreground/60 mb-8">
			共 {postCount} 篇文章 · 总计 {totalWords.toLocaleString()} 字
		</div>
	</div>
</section>
