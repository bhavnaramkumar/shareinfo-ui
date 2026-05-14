<script>
	import { getUser, deleteUser } from '$lib/api.js';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	let userId = $state('');
	let user = $state(null);
	let loading = $state(false);
	let error = $state(null);
	let deleteLoading = $state(false);
	let deleteSuccess = $state(null);
	let deleteError = $state(null);

	async function lookup() {
		if (!userId.trim()) return;
		loading = true;
		error = null;
		user = null;
		deleteSuccess = null;
		try {
			user = await getUser(userId.trim());
		} catch (e) {
			error = `User not found: ${e.message}`;
		} finally {
			loading = false;
		}
	}

	async function handleDelete() {
		if (!confirm(`Delete user ${user.first_name} ${user.last_name}? This cannot be undone.`)) return;
		deleteLoading = true;
		deleteError = null;
		try {
			await deleteUser(user.id);
			deleteSuccess = `User ${user.first_name} ${user.last_name} deleted successfully.`;
			user = null;
			userId = '';
		} catch (e) {
			deleteError = `Failed to delete: ${e.message}`;
		} finally {
			deleteLoading = false;
		}
	}
</script>

<div>
	<div class="mb-6">
		<h2 class="text-xl font-semibold text-slate-100">User Lookup</h2>
		<p class="text-slate-500 text-sm mt-0.5">Fetch a user's details by their ID</p>
	</div>

	<div class="flex gap-3 mb-6">
		<input
			type="text"
			bind:value={userId}
			onkeydown={(e) => e.key === 'Enter' && lookup()}
			placeholder="Enter user ID..."
			class="flex-1 max-w-xs bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-600"
		/>
		<button
			onclick={lookup}
			disabled={loading}
			class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
		>
			Lookup
		</button>
	</div>

	<StatusMessage {loading} {error} success={deleteSuccess} />

	{#if !loading && !deleteSuccess && !error && user}
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-lg">
			<div class="flex items-start justify-between mb-5">
				<div>
					<h3 class="text-lg font-semibold text-slate-100">
						{user.first_name}
						{user.last_name}
					</h3>
					<span class="text-xs text-slate-500">ID: {user.id}</span>
				</div>
			</div>

			<dl class="space-y-3 mb-6">
				{#each Object.entries(user).filter(([k]) => !['id', 'first_name', 'last_name'].includes(k)) as [key, value] (key)}
					{#if value !== null && value !== undefined && value !== ''}
						<div class="flex gap-4">
							<dt class="text-xs font-medium text-slate-500 uppercase tracking-wide w-28 shrink-0 pt-0.5">
								{key.replace(/_/g, ' ')}
							</dt>
							<dd class="text-sm text-slate-300 break-all">{value}</dd>
						</div>
					{/if}
				{/each}
			</dl>

			<div class="flex gap-2 flex-wrap">
				<a
					href="/resume/{user.id}"
					class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
				>
					View Resume
				</a>
				<a
					href="/users/{user.id}/edit"
					class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors"
				>
					Edit
				</a>
				<button
					onclick={handleDelete}
					disabled={deleteLoading}
					class="px-4 py-2 bg-red-900/40 hover:bg-red-900/70 border border-red-800 text-red-400 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
				>
					{deleteLoading ? 'Deleting...' : 'Delete'}
				</button>
			</div>

			{#if deleteError}
				<div class="mt-4">
					<StatusMessage error={deleteError} />
				</div>
			{/if}
		</div>
	{/if}
</div>
