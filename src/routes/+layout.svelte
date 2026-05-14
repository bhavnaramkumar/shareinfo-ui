<script>
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/stores';

	let { children } = $props();

	const isLogin = $derived($page.url.pathname === '/login');
	const isShare = $derived($page.url.searchParams.get('share') === 'true');
	const showSidebar = $derived(!isLogin && !isShare);

	const navLinks = [
		{ href: '/', label: 'Lookup', icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' },
		{
			href: '/users',
			label: 'All Users',
			icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z'
		},
		{
			href: '/users/add',
			label: 'Add User',
			icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z'
		},
		{
			href: '/search',
			label: 'Search',
			icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
		}
	];

	function isActive(href) {
		if (href === '/') return $page.url.pathname === '/';
		return $page.url.pathname.startsWith(href);
	}
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if showSidebar}
	<div class="flex min-h-screen w-full">
		<!-- Sidebar -->
		<aside
			class="w-56 bg-slate-800/80 border-r border-slate-700/60 flex flex-col fixed top-0 left-0 h-full z-20 backdrop-blur"
		>
			<!-- Logo -->
			<div class="p-5 border-b border-slate-700/60">
				<div class="flex items-center gap-2.5">
					<div
						class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0"
					>
						<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
					</div>
					<div>
						<p class="text-sm font-semibold text-slate-100 leading-none">ShareInfo</p>
						<p class="text-xs text-slate-500 mt-0.5">Portfolio System</p>
					</div>
				</div>
			</div>

			<!-- Nav -->
			<nav class="flex-1 p-3 space-y-0.5 overflow-y-auto">
				{#each navLinks as link}
					<a
						href={link.href}
						class="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors {isActive(
							link.href
						)
							? 'bg-indigo-600 text-white font-medium'
							: 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/60'}"
					>
						<svg
							class="w-4 h-4 shrink-0"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d={link.icon}
							/>
						</svg>
						{link.label}
					</a>
				{/each}
			</nav>

			<!-- Sign out -->
			<div class="p-3 border-t border-slate-700/60">
				<a
					href="/logout"
					class="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-400 hover:text-red-400 hover:bg-slate-700/60 rounded-lg transition-colors"
				>
					<svg
						class="w-4 h-4 shrink-0"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						/>
					</svg>
					Sign out
				</a>
			</div>
		</aside>

		<!-- Main content -->
		<main class="ml-56 flex-1 min-h-screen p-8">
			{@render children()}
		</main>
	</div>
{:else}
	{@render children()}
{/if}
