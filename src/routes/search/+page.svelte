<script>
	import { searchUsers } from '$lib/api.js';
	import UserCard from '$lib/components/UserCard.svelte';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	let query = $state('');
	let results = $state([]);
	let loading = $state(false);
	let error = $state(null);
	let searched = $state(false);

	async function search() {
		if (!query.trim()) return;
		loading = true;
		error = null;
		searched = true;
		try {
			const data = await searchUsers(query.trim());
			results = data.map((item) => item.user ?? item);
		} catch (e) {
			error = e.message;
			results = [];
		} finally {
			loading = false;
		}
	}
</script>

<div>
	<div class="mb-6">
		<h2 class="text-xl font-semibold text-slate-100">Search</h2>
		<p class="text-slate-500 text-sm mt-0.5">Find users by name, email, or other fields</p>
	</div>

	<div class="flex gap-3 mb-6">
		<input
			type="text"
			bind:value={query}
			onkeydown={(e) => e.key === 'Enter' && search()}
			placeholder="Search users..."
			class="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-600"
		/>
		<button
			onclick={search}
			disabled={loading}
			class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
		>
			Search
		</button>
	</div>

	<StatusMessage {loading} {error} />

	{#if !loading && searched && !error}
		{#if results.length === 0}
			<div class="text-center py-12 text-slate-500 text-sm">
				No results found for "{query}".
			</div>
		{:else}
			<p class="text-slate-500 text-sm mb-4">{results.length} result{results.length !== 1 ? 's' : ''}</p>
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each results as user}
					<UserCard {user} showShareLink showEdit />
				{/each}
			</div>
		{/if}
	{/if}
</div>
