<script lang="ts">
	import { CalendarDays, ArrowRight } from '@lucide/svelte';
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
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
	class="group/card animate-fade-up border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
	style="animation-delay: {index * 80}ms"
>
	<a href={`/blog/${post.slug}`} class="no-underline">
		<CardHeader class="pb-3">
			<div class="flex items-center gap-3 text-xs text-muted-foreground">
				<CalendarDays class="!size-3.5" />
				{dateStr}
				<span>·</span>
				{readingTime} 分钟
			</div>
			<CardTitle class="pt-1 text-base font-semibold sm:text-lg">
				{post.title}
			</CardTitle>
			{#if post.description}
				<CardDescription class="text-muted-foreground/80 leading-relaxed">
					{post.description}
				</CardDescription>
			{/if}
		</CardHeader>

		{#if post.tags && post.tags.length > 0}
			<CardContent class="flex flex-wrap gap-1.5 pb-0">
				{#each post.tags as tag}
					<Badge variant="secondary" class="text-[11px]">{resolveTag(tag)}</Badge>
				{/each}
			</CardContent>
		{/if}

		<div class="px-5 pt-4">
			<Separator />
		</div>

		<div class="flex items-center gap-1 px-5 py-3 text-xs text-muted-foreground transition-colors duration-200 group-hover/card:text-foreground">
			阅读全文
			<ArrowRight class="!size-3 transition-transform duration-300 group-hover/card:translate-x-0.5" />
		</div>
	</a>
</Card>
