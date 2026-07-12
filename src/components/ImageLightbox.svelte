<script lang="ts">
	let src = $state('');
	let type = $state<'image' | 'video'>('image');
	let visible = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		function handler(e: MouseEvent) {
			const target = e.target as HTMLElement;
			const prose = target.closest('.prose');
			if (!prose) return;

			// Image click
			if (target.tagName === 'IMG') {
				src = (target as HTMLImageElement).src;
				type = 'image';
				visible = true;
				document.body.style.overflow = 'hidden';
				return;
			}

			// Video click — open in lightbox
			const video = target.closest('video');
			if (video && video.dataset.lightbox !== 'false') {
				src = video.currentSrc || video.querySelector('source')?.src || video.src || '';
				if (src) {
					type = 'video';
					visible = true;
					document.body.style.overflow = 'hidden';
					video.pause();
				}
				return;
			}
		}
		document.addEventListener('click', handler);
		return () => document.removeEventListener('click', handler);
	});

	function close() {
		visible = false;
		document.body.style.overflow = '';
		src = '';
	}

	function onKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') close();
	}

	function onBackdrop(e: MouseEvent) {
		if (e.target === e.currentTarget) close();
	}
</script>

<svelte:window onkeydown={onKeydown} />

{#if visible}
	<div
		class="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
		role="dialog"
		aria-modal="true"
		onclick={onBackdrop}
	>
		{#if type === 'image'}
			<img
				src={src}
				alt=""
				class="max-h-[90vh] max-w-[90vw] rounded object-contain shadow-2xl"
			/>
		{:else}
			<video
				src={src}
				controls
				autoplay
				playsinline
				class="max-h-[90vh] max-w-[90vw] rounded shadow-2xl"
			>
				<p class="text-white/50">你的浏览器不支持视频播放</p>
			</video>
		{/if}

		<button
			onclick={close}
			aria-label="关闭"
			class="absolute right-4 top-4 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white/80 text-lg transition-colors hover:bg-white/20 hover:text-white"
		>
			✕
		</button>

		<div class="absolute inset-x-0 bottom-6 text-center text-xs text-white/50 pointer-events-none">
			点击背景或按 ESC 关闭
		</div>
	</div>
{/if}
