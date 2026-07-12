<script lang="ts">
	import { ArrowRight, BookOpen } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { postCount = 0, pageCount = 0 }: { postCount?: number; pageCount?: number } = $props();
</script>

<section class="pb-20 pt-16 sm:pb-28 sm:pt-20">
	<div class="animate-fade-up space-y-6">
		<h1 class="max-w-3xl text-4xl font-bold tracking-tight leading-[1.1] sm:text-5xl lg:text-6xl">
			MEMZ-SYSTEM-CORE<br />
			<span class="text-muted-foreground">的博客</span>
		</h1>
		<p class="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
			基于 Astro 构建，PagesCMS 管理内容的黑白风格静态站点。
		</p>
	</div>

	<div class="animate-fade-up-1 mt-8 flex flex-wrap items-center gap-3">
		<a href={postCount > 0 ? '#posts' : 'https://app.pagescms.org'}>
			<Button class="gap-1.5">
				{postCount > 0 ? '浏览文章' : '开始编辑'}
				<ArrowRight class="!size-4" />
			</Button>
		</a>
		<a href="/about">
			<Button variant="secondary" class="gap-1.5">
				<BookOpen class="!size-4" /> 关于
			</Button>
		</a>
	</div>

	<div class="animate-fade-up-2 mt-6 flex items-center gap-4 text-xs text-muted-foreground">
		{#if postCount > 0}
			<span>{postCount} 篇文章</span>
		{/if}
		{#if pageCount > 0}
			<Separator orientation="vertical" class="h-3" />
			<span>{pageCount} 个页面</span>
		{/if}
	</div>
</section>
