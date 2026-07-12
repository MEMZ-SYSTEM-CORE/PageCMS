<script lang="ts">
	import { Menu, X } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import {
		Sheet,
		SheetTrigger,
		SheetContent,
		SheetHeader,
		SheetTitle,
		SheetClose,
	} from '$lib/components/ui/sheet/index.js';
	import ThemeToggle from './ThemeToggle.svelte';

	let mobileOpen = $state(false);
	let scrolled = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		const onScroll = () => { scrolled = window.scrollY > 20; };
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class="fixed inset-x-0 top-0 z-50 transition-all duration-500 {scrolled ? 'bg-background/70 backdrop-blur-lg shadow-[0_1px_0_rgba(0,0,0,0.05)] dark:shadow-[0_1px_0_rgba(255,255,255,0.05)]' : ''}"
>
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 sm:px-6">
		<a
			href="/"
			class="font-heading mr-8 inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight transition-opacity hover:opacity-70"
		>
			<span class="flex size-7 items-center justify-center rounded-lg bg-[oklch(0.45_0.10_240)] text-[11px] text-white">P</span>
			<span class="text-foreground">PageCMS</span>
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			<a href="/"><Button variant="ghost" size="sm">首页</Button></a>
			<a href="/about"><Button variant="ghost" size="sm">关于</Button></a>
		</nav>

		<div class="flex-1" />

		<div class="flex items-center gap-0.5">
			<ThemeToggle />

			<div class="sm:hidden">
				<Sheet bind:open={mobileOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon-sm" aria-label="菜单">
							<Menu class="!size-[18px]" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-64 border-l">
						<SheetHeader class="mb-6 pt-2">
							<SheetTitle class="flex items-center gap-2 text-left text-base font-semibold tracking-tight">
								<span class="flex size-7 items-center justify-center rounded-lg bg-[oklch(0.45_0.10_240)] text-[11px] text-white">P</span>
								PageCMS
							</SheetTitle>
						</SheetHeader>
						<div class="flex flex-col gap-1">
							<a href="/" onclick={() => { mobileOpen = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">首页</a>
							<a href="/about" onclick={() => { mobileOpen = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm font-medium transition-colors">关于</a>
						</div>
						<Separator class="my-6" />
						<div class="absolute inset-x-6 bottom-8">
							<SheetClose asChild>
								<Button variant="ghost" size="sm" class="w-full justify-start gap-2">
									<X class="!size-4" /> 关闭
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>

<div class="h-14" />
