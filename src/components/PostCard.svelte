<script lang="ts">
	import { CalendarDays } from '@lucide/svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface Post {
		slug: string;
		title: string;
		pubDate: string;
		description?: string;
		image?: string;
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

<a
	href={`/blog/${post.slug}`}
	class="ring-foreground/10 bg-card text-card-foreground flex flex-col md:flex-row gap-6 overflow-hidden rounded-2xl text-sm ring-1 py-6 px-6 group transition-all hover:shadow-lg no-underline animate-fade-up"
	style="animation-delay: {index * 80}ms"
>
	<!-- Thumbnail -->
	{#if post.image}
		<div class="h-32 w-full md:w-48 md:flex-shrink-0 rounded-md overflow-hidden">
			<img
				src={post.image}
				alt={post.title}
				class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
		</div>
	{:else}
		<div class="h-32 w-full md:w-48 md:flex-shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
			<div class="text-3xl font-bold text-muted-foreground/20">
				{post.title.charAt(0)}
			</div>
		</div>
	{/if}

	<!-- Content -->
	<div class="flex-1 min-w-0">
		<div class="flex items-center gap-2 text-sm text-muted-foreground mb-1">
			<CalendarDays class="!size-3.5 shrink-0" />
			<span class="whitespace-nowrap">{dateStr}</span>
			<span class="text-muted-foreground/40 shrink-0">·</span>
			<span class="whitespace-nowrap">{readingTime} 分钟</span>
		</div>

		<h2 class="mb-2 text-2xl font-semibold group-hover:text-primary transition-colors">
			{post.title}
		</h2>

		{#if post.description}
			<p class="mt-2 text-sm text-muted-foreground line-clamp-2">
				{post.description}
			</p>
		{/if}

		{#if post.tags && post.tags.length > 0}
			<div class="mt-2 flex flex-wrap items-center gap-x-2 gap-y-0">
				{#each post.tags as tag}
					<Badge variant="secondary" class="text-xs">{resolveTag(tag)}</Badge>
				{/each}
			</div>
		{/if}
	</div>
</a>
