<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
	} from '$lib/components/ui/sheet/index.js';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	let scrolled = $state(false);
	let headerClass = $state('');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const f = () => {
			scrolled = window.scrollY > 20;
			headerClass = scrolled
				? 'fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-background/80 backdrop-blur-lg border-b'
				: 'fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-background';
		};
		f();
		window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	});
</script>

<header class={headerClass}>
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 sm:px-6">
		<a href="/" class="mr-6 text-sm font-bold tracking-tight uppercase">
			MEMZ-SYSTEM-CORE
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			<a href="/"><Button variant="ghost" size="sm">文章</Button></a>
			<a href="/about"><Button variant="ghost" size="sm">关于</Button></a>
		</nav>

		<div class="flex-1" />

		<ThemeToggle />

		<div class="sm:hidden">
			<Sheet bind:open={open}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon-sm">
						<Menu class="!size-[18px]" />
					</Button>
				</SheetTrigger>
				<SheetContent side="right" class="w-56 border-l">
					<SheetHeader class="mb-6 pt-2">
						<SheetTitle class="text-left text-xs font-bold uppercase tracking-tight">
							MEMZ-SYSTEM-CORE
						</SheetTitle>
					</SheetHeader>
					<div class="flex flex-col gap-1">
						<a href="/" onclick={() => { open = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm transition-colors">文章</a>
						<a href="/about" onclick={() => { open = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm transition-colors">关于</a>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	</div>
</header>

<div class="h-14" />
