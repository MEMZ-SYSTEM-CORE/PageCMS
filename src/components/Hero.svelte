<script lang="ts">
	import { ArrowRight, PenLine } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	let { postCount = 0, pageCount = 0 }: { postCount?: number; pageCount?: number } = $props();
</script>

<section class="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-20">
	<div
		class="bg-primary/3 pointer-events-none absolute -top-48 right-0 h-96 w-96 rounded-full blur-3xl"
		aria-hidden="true"
	/>
	<div
		class="bg-chart-2/3 pointer-events-none absolute -bottom-48 -left-48 h-96 w-96 rounded-full blur-3xl"
		aria-hidden="true"
	/>

	<div class="relative space-y-8">
		<div class="animate-fade-up space-y-4">
			<div class="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-medium">
				<PenLine class="!size-3" />
				PagesCMS 驱动
			</div>
			<h1 class="font-heading text-foreground text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
				欢迎来到
				<span class="text-primary">PageCMS</span>
			</h1>
			<p class="text-muted-foreground max-w-xl text-sm leading-relaxed sm:text-base">
				一个基于 <strong>Astro</strong> 构建、通过 <strong>Pages CMS</strong> 管理内容的静态站点模板。
				简洁、快速、版本可控。
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
				<Button variant="outline">关于本站</Button>
			</a>
		</div>

		<div class="animate-fade-up-3 text-muted-foreground flex items-center gap-4 text-xs">
			{#if postCount > 0}
				<span>{postCount} 篇文章</span>
				<Separator orientation="vertical" class="h-3" />
			{/if}
			{#if pageCount > 0}
				<span>{pageCount} 个页面</span>
				<Separator orientation="vertical" class="h-3" />
			{/if}
			{#if postCount === 0 && pageCount === 0}
				<span>开始你的内容之旅</span>
			{/if}
		</div>
	</div>
</section>
