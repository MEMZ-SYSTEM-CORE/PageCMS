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

	const navLinks = [
		{ href: '/', label: '首页' },
		{ href: '/about', label: '关于' },
	];

	let scrolled = $state(false);

	$effect(() => {
		if (typeof window === 'undefined') return;
		function onScroll() {
			scrolled = window.scrollY > 20;
		}
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300"
	class:shadow-sm={scrolled}
	class:bg-transparent={!scrolled}
>
	<div
		class="absolute inset-0 transition-all duration-300 {scrolled ? 'bg-background/80 backdrop-blur-xl opacity-100' : 'opacity-0'}"
		aria-hidden="true"
	/>
	<div class="relative mx-auto flex h-16 max-w-5xl items-center gap-2 px-4 sm:px-6">
		<a href="/" class="font-heading text-foreground mr-6 text-base font-semibold tracking-tight">
			<span class="text-primary">✦</span> PageCMS
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			{#each navLinks as link}
				<a href={link.href}>
					<Button variant="ghost" size="sm">{link.label}</Button>
				</a>
			{/each}
		</nav>

		<div class="flex-1" />

		<div class="flex items-center gap-1">
			<ThemeToggle />

			<div class="sm:hidden">
				<Sheet bind:open={mobileOpen}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon-sm" aria-label="打开菜单">
							<Menu class="!size-[18px]" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-64">
						<SheetHeader class="mb-6">
							<SheetTitle class="font-heading text-left text-lg tracking-tight">
								<span class="text-primary">✦</span> PageCMS
							</SheetTitle>
						</SheetHeader>

						<div class="flex flex-col gap-1">
							{#each navLinks as link}
								<a
									href={link.href}
									class="hover:bg-muted rounded-md px-3 py-2.5 text-sm font-medium transition-colors"
									onclick={() => { mobileOpen = false; }}
								>
									{link.label}
								</a>
							{/each}
						</div>

						<Separator class="my-6" />

						<div class="absolute bottom-8 left-6 right-6">
							<SheetClose asChild>
								<Button variant="ghost" size="sm" class="w-full justify-start gap-2">
									<X class="!size-4" />
									关闭
								</Button>
							</SheetClose>
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>

<div class="h-16" />
