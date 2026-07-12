<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		title?: string;
	}

	let { title = 'PageCMS' }: Props = $props();
</script>

<header
	class="bg-background border-border/40 sticky top-0 z-50 flex h-14 items-center gap-4 border-b px-4 sm:px-6"
>
	<div class="mx-auto flex w-full max-w-5xl items-center gap-6">
		<a href="/" class="font-heading text-foreground text-lg font-semibold tracking-tight">
			PageCMS
		</a>
		<nav class="hidden items-center gap-1 sm:flex">
			<a href="/">
				<Button variant="ghost" size="sm">首页</Button>
			</a>
			<a href="/about">
				<Button variant="ghost" size="sm">关于</Button>
			</a>
		</nav>
		<div class="ml-auto flex items-center gap-2">
			<a href="https://pagescms.org" target="_blank">
				<Button variant="outline" size="sm">PagesCMS</Button>
			</a>
		</div>
	</div>
</header>
