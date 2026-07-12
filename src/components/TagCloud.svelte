<script lang="ts">
	let { tags = [] }: { tags?: string[] } = $props();
</script>

{#if tags.length > 0}
	<div class="flex flex-wrap gap-2">
		{#each tags as tag}
			<a
				href="/"
				class="inline-flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
			>
				{tag}
			</a>
		{/each}
	</div>
{/if}
