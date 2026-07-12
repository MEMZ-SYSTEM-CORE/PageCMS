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
	import { Button } from '$lib/components/ui/button/index.js';

	interface Post {
		slug: string;
		title: string;
		pubDate: string;
		description?: string;
		tags?: (string | { tag: string })[];
	}

	let { post }: { post: Post } = $props();

	const dateStr = new Date(post.pubDate).toLocaleDateString('zh-CN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});

	const readingTime = Math.max(1, Math.ceil((post.description?.length ?? 100) / 300));

	function resolveTag(t: string | { tag: string }): string {
		return typeof t === 'string' ? t : t.tag;
	}
</script>

<Card
	size="sm"
	class="hover:bg-accent/50 group/card cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
>
	<a href={`/blog/${post.slug}`} class="no-underline">
		<CardHeader>
			<div class="text-muted-foreground flex items-center gap-3 text-xs">
				<span class="flex items-center gap-1">
					<CalendarDays class="!size-3" />
					{dateStr}
				</span>
				<span class="flex items-center gap-1">
					<Clock class="!size-3" />
					{readingTime} 分钟阅读
				</span>
			</div>
			<CardTitle class="group-hover/card:text-primary mt-2 text-base transition-colors">
				{post.title}
			</CardTitle>
			{#if post.description}
				<CardDescription>
					{post.description}
				</CardDescription>
			{/if}
		</CardHeader>

		{#if post.tags && post.tags.length > 0}
			<CardContent class="flex flex-wrap gap-1.5">
				{#each post.tags as tag}
					<Badge variant="secondary">{resolveTag(tag)}</Badge>
				{/each}
			</CardContent>
		{/if}

		<Separator class="mx-4 w-auto" />

		<div class="text-muted-foreground hover:text-primary flex items-center gap-1 px-4 py-2.5 text-xs font-medium transition-colors">
			阅读全文
			<ArrowRight class="!size-3 transition-transform group-hover/card:translate-x-0.5" />
		</div>
	</a>
</Card>
