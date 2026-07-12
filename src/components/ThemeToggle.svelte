<script lang="ts">
	import { Moon, Sun } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	let isDark = $state(false);

	$effect(() => {
		isDark = document.documentElement.classList.contains('dark');
	});

	function toggle() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<Button
	variant="ghost"
	size="icon-sm"
	onclick={toggle}
	aria-label={isDark ? '切换到亮色模式' : '切换到暗色模式'}
>
	<Sun class="!size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
	<Moon class="!size-4 absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
</Button>
