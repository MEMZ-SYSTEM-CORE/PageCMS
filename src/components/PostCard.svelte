<script lang="ts">
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';

	interface Tag {
		tag: string;
	}

	interface Post {
		slug: string;
		title: string;
		pubDate: string;
		description?: string;
		tags?: Tag[];
	}

	let {
		post,
	}: {
		post: Post;
	} = $props();

	const dateStr = new Date(post.pubDate).toLocaleDateString('zh-CN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
</script>

<a href={`/blog/${post.slug}`} class="no-underline">
	<Card size="sm" class="hover:bg-muted/50 transition-colors">
		<CardHeader>
			<div class="text-muted-foreground mb-1 text-xs">{dateStr}</div>
			<CardTitle class="text-base">{post.title}</CardTitle>
			{#if post.description}
				<CardDescription>{post.description}</CardDescription>
			{/if}
		</CardHeader>
		{#if post.tags && post.tags.length > 0}
			<CardContent class="flex flex-wrap gap-1.5">
				{#each post.tags as tag}
					<Badge variant="secondary">{tag.tag}</Badge>
				{/each}
			</CardContent>
		{/if}
	</Card>
</a>
