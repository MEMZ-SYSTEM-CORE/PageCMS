<script lang="ts">
	import { CalendarDays, Clock, ArrowRight } from '@lucide/svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';

	interface Post {
		slug: string;
		title: string;
		pubDate: string;
		description?: string;
		tags?: (string | { tag: string })[];
	}

	let { post, index = 0 }: { post: Post; index?: number } = $props();

	const dateStr = new Date(post.pubDate).toLocaleDateString('zh-CN', {
		year: 'numeric', month: 'long', day: 'numeric',
	});
	const readingTime = Math.max(1, Math.ceil((post.description?.length ?? 100) / 300));

	function resolveTag(t: string | { tag: string }): string {
		return typeof t === 'string' ? t : t.tag;
	}
</script>

<Card
	class="group/card animate-fade-up overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
	style="--card-spacing: var(--spacing-6); animation-delay: {index * 80}ms"
>
	<a href={`/blog/${post.slug}`} class="no-underline">
		<!-- 顶部装饰线 -->
		<div class="h-[3px] w-0 bg-primary transition-all duration-500 group-hover/card:w-full" />

		<CardHeader class="space-y-3 pb-3">
			<div class="flex items-center gap-4 text-xs text-muted-foreground">
				<span class="inline-flex items-center gap-1.5">
					<CalendarDays class="!size-3.5" />
					{dateStr}
				</span>
				<span class="inline-flex items-center gap-1.5">
					<Clock class="!size-3.5" />
					{readingTime} 分钟
				</span>
			</div>
			<CardTitle class="text-base font-semibold text-foreground transition-colors duration-200 group-hover/card:text-primary sm:text-lg">
				{post.title}
			</CardTitle>
			{#if post.description}
				<CardDescription class="text-muted-foreground/80 leading-relaxed">
					{post.description}
				</CardDescription>
			{/if}
		</CardHeader>

		{#if post.tags && post.tags.length > 0}
			<CardContent class="flex flex-wrap gap-2 pb-0">
				{#each post.tags as tag}
					<Badge variant="secondary" class="text-[11px]">{resolveTag(tag)}</Badge>
				{/each}
			</CardContent>
		{/if}

		<div class="px-6 pt-4">
			<Separator />
		</div>

		<div class="flex items-center gap-1.5 px-6 py-3.5 text-xs font-medium text-muted-foreground transition-colors duration-200 hover:text-primary">
			阅读全文
			<ArrowRight class="!size-3.5 transition-transform duration-300 group-hover/card:translate-x-1" />
		</div>
	</a>
</Card>
