<script lang="ts">
  import { themeMode, isDark, type ThemeMode } from '$lib/stores/theme';

  const modes: ThemeMode[] = ['light', 'dark', 'system'];

  function cycle() {
    themeMode.update((cur) => {
      const idx = modes.indexOf(cur);
      return modes[(idx + 1) % modes.length];
    });
  }

  const icon = $derived.by(() => {
    switch ($themeMode) {
      case 'light': return 'mdi:weather-sunny';
      case 'dark': return 'mdi:weather-night';
      case 'system': return 'mdi:monitor';
    }
  });
</script>

<button
  onclick={cycle}
  class="inline-flex items-center justify-center rounded-md w-8 h-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
  aria-label="切换主题"
>
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="w-5 h-5">
    {#if $themeMode === 'light'}
      <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    {:else if $themeMode === 'dark'}
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    {:else}
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="12" cy="12" r="3" />
    {/if}
  </svg>
</button>
