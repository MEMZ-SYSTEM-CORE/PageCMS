<script lang="ts">
	import { ArrowRight, PenLine, Sparkles, BookOpen } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { postCount = 0, pageCount = 0 }: { postCount?: number; pageCount?: number } = $props();
</script>

<section class="relative overflow-hidden pb-24 pt-20 sm:pb-32 sm:pt-24">
	<div
		class="bg-primary/[0.04] pointer-events-none absolute -top-48 right-0 h-96 w-96 rounded-full blur-3xl"
		aria-hidden="true"
	/>
	<div
		class="bg-chart-2/[0.03] pointer-events-none absolute -bottom-48 -left-48 h-80 w-80 rounded-full blur-3xl"
		aria-hidden="true"
	/>

	<div class="relative space-y-10">
		<div class="animate-fade-up space-y-6">
			<div class="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium">
				<Sparkles class="!size-3" />
				基于 PagesCMS 构建
			</div>
			<h1 class="font-heading text-foreground max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
				书写想法，<br />
				<span class="text-primary">分享知识</span>
			</h1>
			<p class="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
				一个基于 Astro + shadcn-svelte 构建的轻量级静态站点。
				内容通过 PagesCMS 管理，简洁、快速、版本可控。
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
					<BookOpen class="!size-4" />
					关于本站
				</Button>
			</a>
		</div>

		<div class="animate-fade-up-3 text-muted-foreground flex items-center gap-5 text-xs">
			{#if postCount > 0}
				<span class="inline-flex items-center gap-1.5">
					<span class="bg-primary/10 text-primary inline-flex size-5 items-center justify-center rounded-md text-[11px] font-bold">{postCount}</span>
					篇文章
				</span>
			{/if}
			{#if pageCount > 0}
				<Separator orientation="vertical" class="h-3" />
				<span>{pageCount} 个页面</span>
			{/if}
			<Separator orientation="vertical" class="h-3" />
			<span>✨ 纯静态站点</span>
		</div>
	</div>
</section>
