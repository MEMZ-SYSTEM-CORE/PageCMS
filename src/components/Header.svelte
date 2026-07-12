<script lang="ts">
	import { Menu } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import {
		Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle,
	} from '$lib/components/ui/sheet/index.js';
	import ThemeToggle from './ThemeToggle.svelte';

	let open = $state(false);
	let scrolled = $state(false);
	let cls = $state('');

	$effect(() => {
		if (typeof window === 'undefined') return;
		const f = () => {
			scrolled = window.scrollY > 20;
			cls = scrolled
				? 'fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-background/80 backdrop-blur-lg border-b'
				: 'fixed inset-x-0 top-0 z-50 transition-all duration-500 bg-background';
		};
		f();
		window.addEventListener('scroll', f, { passive: true });
		return () => window.removeEventListener('scroll', f);
	});
</script>

<header class={cls}>
	<div class="mx-auto flex h-14 max-w-5xl items-center gap-2 px-4 sm:px-6">
		<a href="/" class="mr-6 text-sm font-bold tracking-tight uppercase">
			MEMZ-SYSTEM-CORE
		</a>

		<nav class="hidden items-center gap-1 sm:flex">
			<a href="/"><Button variant="ghost" size="sm">文章</Button></a>
			<a href="/about"><Button variant="ghost" size="sm">关于</Button></a>
		</nav>

		<div class="flex-1" />

		<div class="flex items-center gap-2">
			<!-- B站 button -->
			<a
				href="https://space.bilibili.com/3494379408853453"
				target="_blank"
				class="hover:bg-muted inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
				class:bg-transparent={!scrolled}
				class:border-border={!scrolled}
			>
				<svg viewBox="0 0 24 24" fill="currentColor" class="!size-[17px]"><path d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.92.453.267.302.4.622.4.96 0 .338-.133.658-.4.96l-1.147 1.12v-.16zm-8.546 5.707a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693zm5.333 0a.7.7 0 0 0-.693.693v4.267c0 .373.32.693.693.693.373 0 .693-.32.693-.693v-4.267a.7.7 0 0 0-.693-.693z"/></svg>
				B站
			</a>

			<ThemeToggle />

			<div class="sm:hidden">
				<Sheet bind:open={open}>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon-sm">
							<Menu class="!size-[18px]" />
						</Button>
					</SheetTrigger>
					<SheetContent side="right" class="w-64 border-l">
						<SheetHeader class="mb-6 pt-2">
							<SheetTitle class="text-left text-xs font-bold uppercase">MEMZ-SYSTEM-CORE</SheetTitle>
						</SheetHeader>
						<div class="flex flex-col gap-1">
							<a href="/" onclick={() => { open = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm transition-colors">文章</a>
							<a href="/about" onclick={() => { open = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm transition-colors">关于</a>
							<a href="https://space.bilibili.com/3494379408853453" target="_blank" onclick={() => { open = false; }} class="hover:bg-muted rounded-lg px-3 py-2.5 text-sm transition-colors">B站</a>
						</div>
						<div class="mt-6 px-3">
							<ThemeToggle />
						</div>
					</SheetContent>
				</Sheet>
			</div>
		</div>
	</div>
</header>

<div class="h-14" />
