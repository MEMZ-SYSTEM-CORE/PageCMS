<script lang="ts">
	interface MediaInfo {
		type: 'audio' | 'video' | 'unknown';
		src: string;
	}

	let { src = '' }: { src?: string } = $props();
	let media = $state<MediaInfo | null>(null);
	let expanded = $state(false);
	let mounted = $state(false);

	$effect(() => {
		if (!src) { media = null; return; }
		if (src.match(/\.(mp4|webm|ogg|mov|avi|mkv)($|\?)/i)) {
			media = { type: 'video', src };
		} else if (src.match(/\.(mp3|wav|ogg|flac|aac|m4a|wma)($|\?)/i)) {
			media = { type: 'audio', src };
		} else {
			media = null;
		}
	});

	$effect(() => {
		if (typeof window !== 'undefined') mounted = true;
	});
</script>

{#if media}
	<div
		class="ring-foreground/10 bg-card text-card-foreground my-6 overflow-hidden rounded-2xl text-sm ring-1 transition-all"
		class:shadow-lg={expanded}
	>
		{#if media.type === 'video'}
			<div class="relative">
				<video
					src={media.src}
					controls
					playsinline
					preload="metadata"
					class="w-full max-h-[70vh] bg-black"
					onloadedmetadata={() => { expanded = true; }}
				>
					<p class="p-4 text-muted-foreground">你的浏览器不支持视频播放</p>
				</video>
			</div>
		{:else}
			<div class="flex items-center gap-4 p-5">
				<div class="flex size-12 shrink-0 items-center justify-center rounded-full bg-muted">
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="!size-6 text-muted-foreground">
						<path d="M9 18V5l12-2v13" />
						<circle cx="6" cy="18" r="3" />
						<circle cx="18" cy="16" r="3" />
					</svg>
				</div>
				<div class="flex-1 min-w-0">
					<div class="text-xs font-medium text-muted-foreground truncate">
						{media.src.split('/').pop() || '音频文件'}
					</div>
					<audio
						src={media.src}
						controls
						preload="none"
						class="mt-2 w-full h-10"
					>
						<p class="text-muted-foreground">你的浏览器不支持音频播放</p>
					</audio>
				</div>
			</div>
		{/if}
	</div>
{/if}
