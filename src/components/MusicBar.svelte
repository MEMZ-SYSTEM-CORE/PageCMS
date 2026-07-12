<script lang="ts">
	import { Play, Pause, SkipForward, SkipBack, ListMusic, X } from '@lucide/svelte';

	let tracks = $state<{ title: string; artist: string; file: string; cover?: string }[]>([]);
	let currentIndex = $state(0);
	let playing = $state(false);
	let currentTime = $state(0);
	let duration = $state(0);
	let showPlaylist = $state(false);
	let audioEl = $state<HTMLAudioElement | null>(null);
	let mounted = $state(false);
	let initDone = $state(false);

	// Inject global API + read initial data
	$effect(() => {
		if (typeof window === 'undefined') return;
		mounted = true;

		(window as any).__musicPlayer = {
			playTrack: (tl: any[], idx: number) => {
				tracks = tl;
				currentIndex = idx;
				showPlaylist = false;
				if (audioEl && tl[idx]) {
					audioEl.src = tl[idx].file;
					audioEl.load();
					audioEl.play().then(() => { playing = true; }).catch(() => {});
				}
			},
		};

		// Load from injected data
		var w = window as any;
		if (w.__MUSIC_TRACKS && w.__MUSIC_TRACKS.length > 0) {
			tracks = w.__MUSIC_TRACKS;
			currentIndex = 0;
		}
		initDone = true;
	});

	const current = $derived(tracks[currentIndex] || null);

	function play() {
		if (!audioEl || !tracks[currentIndex]) return;
		if (!audioEl.src) audioEl.src = tracks[currentIndex].file;
		audioEl.play().then(() => { playing = true; }).catch(() => {});
	}

	function pause() {
		if (!audioEl) return;
		audioEl.pause();
		playing = false;
	}

	function toggle() {
		if (playing) pause();
		else play();
	}

	function changeTrack(delta: number) {
		if (tracks.length === 0) return;
		currentIndex = (currentIndex + delta + tracks.length) % tracks.length;
		playing = false;
		currentTime = 0;
		duration = 0;
		if (audioEl) {
			audioEl.src = tracks[currentIndex].file;
			audioEl.load();
			audioEl.play().then(() => { playing = true; }).catch(() => {});
		}
	}

	function pickTrack(i: number) {
		if (i === currentIndex && playing) { pause(); return; }
		if (i !== currentIndex) {
			currentIndex = i;
			if (audioEl) {
				audioEl.src = tracks[i].file;
				audioEl.load();
				audioEl.play().then(() => { playing = true; }).catch(() => {});
			}
		} else {
			play();
		}
		showPlaylist = false;
	}

	function seek(e: MouseEvent) {
		if (!audioEl || !duration) return;
		var r = (e.currentTarget as HTMLElement).getBoundingClientRect();
		audioEl.currentTime = ((e.clientX - r.left) / r.width) * duration;
	}

	const progressPct = $derived(duration > 0 ? (currentTime / duration) * 100 : 0);

	function fmt(t: number) {
		if (!t || !isFinite(t)) return '0:00';
		var m = Math.floor(t / 60);
		var s = Math.floor(t % 60);
		return m + ':' + (s < 10 ? '0' : '') + s;
	}
</script>

<svelte:window onkeydown={(e) => {
	if (e.key === ' ' && e.target === document.body) { e.preventDefault(); toggle(); }
}} />

<audio
	bind:this={audioEl}
	preload="metadata"
	onloadedmetadata={() => { if (audioEl) duration = audioEl.duration || 0; }}
	ontimeupdate={() => { if (audioEl) currentTime = audioEl.currentTime || 0; }}
	onended={() => changeTrack(1)}
	class="hidden"
/>

{#if mounted && tracks.length > 0 && initDone}
	<div class="fixed bottom-0 inset-x-0 z-50 border-t bg-background/95 backdrop-blur-lg">
		<!-- Progress -->
		<div class="h-1 bg-border cursor-pointer" onclick={seek} role="progressbar">
			<div class="h-full bg-foreground transition-all duration-200" style="width: {progressPct}%" />
		</div>

		<div class="mx-auto flex h-16 max-w-4xl items-center gap-3 px-4">
			<!-- Info -->
			<div class="flex items-center gap-3 flex-1 min-w-0">
				<div class="size-10 shrink-0 rounded-md bg-muted flex items-center justify-center overflow-hidden">
					{#if current?.cover}
						<img src={current.cover} alt="" class="size-full object-cover" />
					{/if}
				</div>
				<div class="min-w-0">
					<div class="text-sm font-medium truncate">{current?.title || '未选择'}</div>
					<div class="text-xs text-muted-foreground truncate">{current?.artist || ''}</div>
				</div>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-2">
				<button onclick={() => changeTrack(-1)} class="shrink-0 text-muted-foreground hover:text-foreground p-1" aria-label="上一首">
					<SkipBack class="!size-4" />
				</button>
				<button onclick={toggle} class="shrink-0 flex size-8 items-center justify-center rounded-full bg-foreground text-background hover:opacity-90" aria-label={playing ? '暂停' : '播放'}>
					{#if playing}
						<Pause class="!size-4" />
					{:else}
						<Play class="!size-4 ml-0.5" />
					{/if}
				</button>
				<button onclick={() => changeTrack(1)} class="shrink-0 text-muted-foreground hover:text-foreground p-1" aria-label="下一首">
					<SkipForward class="!size-4" />
				</button>
			</div>

			<div class="text-xs text-muted-foreground hidden sm:block w-20 text-right tabular-nums shrink-0">
				{fmt(currentTime)} / {fmt(duration)}
			</div>

			<button onclick={() => { showPlaylist = !showPlaylist; }} class="shrink-0 text-muted-foreground hover:text-foreground p-1" aria-label="播放列表">
				<ListMusic class="!size-4" />
			</button>
		</div>

		<!-- Playlist -->
		{#if showPlaylist}
			<div class="border-t max-h-64 overflow-y-auto bg-background">
				<div class="mx-auto max-w-4xl px-4 py-3 space-y-1">
					<div class="flex items-center justify-between mb-2">
						<span class="text-xs font-medium text-muted-foreground">播放列表 · {tracks.length} 首</span>
						<button onclick={() => { showPlaylist = false; }} class="text-muted-foreground hover:text-foreground"><X class="!size-3.5" /></button>
					</div>
					{#each tracks as track, i}
						<button onclick={() => { pickTrack(i); }} class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted {i === currentIndex ? 'bg-muted font-medium' : ''}">
							<span class="text-xs text-muted-foreground w-4 shrink-0">{i + 1}</span>
							<div class="flex-1 min-w-0">
								<div class="truncate">{track.title}</div>
								<div class="truncate text-xs text-muted-foreground">{track.artist}</div>
							</div>
							{#if i === currentIndex && playing}
								<span class="text-xs shrink-0">▶</span>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{/if}
	</div>

	<div class="h-16" />
{/if}
