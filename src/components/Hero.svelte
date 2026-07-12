<script lang="ts">
	let {
		postCount = 0,
		siteName = 'MEMZ-SYSTEM-CORE',
		tagline = '分享技术、想法和经验',
		footerText = '基于 Astro · PagesCMS',
	}: {
		postCount?: number;
		siteName?: string;
		tagline?: string;
		footerText?: string;
	} = $props();
</script>

<section class="mb-8 text-center">
	<div class="animate-fade-up space-y-3">
		<h1 class="text-3xl font-bold sm:text-4xl">
			{siteName}
		</h1>
		<p class="text-sm text-muted-foreground max-w-md mx-auto">
			{tagline}
		</p>
		<p class="text-xs text-muted-foreground/60">
			{postCount} 篇文章 · {footerText}
		</p>
	</div>
</section>
