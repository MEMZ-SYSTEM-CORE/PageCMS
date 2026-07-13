<script lang="ts">
  import { fly } from 'svelte/transition';
  import { Button } from '$lib/components/ui/button/index.js';

  let scrollY = $state(0);
  let showButton = $derived(scrollY > 100);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
</script>

<svelte:window bind:scrollY />

<div class="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
  {#if showButton}
    <div transition:fly={{ y: 20, duration: 300 }}>
      <Button
        size="icon-lg"
        onclick={scrollToTop}
        aria-label="回到顶部"
        class="size-12 shadow-lg hover:shadow-xl bg-white text-black dark:bg-black dark:text-white border-2 border-border"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="size-5"><path d="m18 15-6-6-6 6"/></svg>
      </Button>
    </div>
  {/if}
</div>
