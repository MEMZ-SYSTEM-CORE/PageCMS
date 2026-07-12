<script lang="ts">
	import { ArrowRight, PenLine, Sparkles, BookOpen, TrendingUp } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { postCount = 0, pageCount = 0 }: { postCount?: number; pageCount?: number } = $props();
</script>

<section class="relative overflow-hidden pb-24 pt-16 sm:pb-32 sm:pt-20">
	<!-- 装饰光晕 -->
	<div class="pointer-events-none absolute -top-48 right-0 h-96 w-96 rounded-full bg-primary/[0.04] blur-3xl" aria-hidden="true" />
	<div class="pointer-events-none absolute -bottom-48 -left-48 h-80 w-80 rounded-full bg-chart-2/[0.03] blur-3xl" aria-hidden="true" />

	<div class="relative space-y-10">
		<div class="animate-fade-up space-y-6">
			<div class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium text-primary">
				<Sparkles class="!size-3" />
				基于 PagesCMS 构建
			</div>
			<h1 class="font-heading max-w-3xl text-4xl font-bold tracking-tight leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
				用文字<br />
				<span class="text-primary">连接思想与世界</span>
			</h1>
			<p class="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
				一个轻量、优雅的静态站点。Astro 驱动，PagesCMS 管理内容，
				开箱即用，专注于写作与分享。
			</p>
		</div>

		<div class="animate-fade-up-2 flex flex-wrap items-center gap-3">
			<a href={postCount > 0 ? '#posts' : 'https://app.pagescms.org'}>
				<Button size="default" class="gap-1.5">
					{postCount > 0 ? '浏览文章' : '开始编辑'}
					<ArrowRight class="!size-4" />
				</Button>
			</a>
			<a href="/about">
				<Button variant="secondary" class="gap-1.5">
					<BookOpen class="!size-4" /> 关于本站
				</Button>
			</a>
		</div>

		<div class="animate-fade-up-3 flex items-center gap-5 text-xs text-muted-foreground">
			{#if postCount > 0}
				<span class="inline-flex items-center gap-1.5">
					<span class="inline-flex size-5 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">{postCount}</span>
					篇文章
				</span>
			{/if}
			{#if pageCount > 0}
				<Separator orientation="vertical" class="h-3" />
				<span class="inline-flex items-center gap-1.5"><TrendingUp class="!size-3.5" /> {pageCount} 个页面</span>
			{/if}
			<Separator orientation="vertical" class="h-3" />
			<span>Astro · shadcn-svelte</span>
		</div>
	</div>
</section>
