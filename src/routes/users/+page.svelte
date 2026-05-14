<script>
	import { onMount } from 'svelte';
	import { getUsers } from '$lib/api.js';
	import UserCard from '$lib/components/UserCard.svelte';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	let users = $state([]);
	let loading = $state(true);
	let error = $state(null);

	onMount(async () => {
		try {
			users = await getUsers();
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<div>
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h2 class="text-xl font-semibold text-slate-100">All Users</h2>
			{#if !loading && !error}
				<p class="text-slate-500 text-sm mt-0.5">{users.length} users</p>
			{/if}
		</div>
		<a
			href="/users/add"
			class="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
		>
			+ Add User
		</a>
	</div>

	<StatusMessage {loading} {error} />

	{#if !loading && !error}
		{#if users.length === 0}
			<div class="text-center py-16 text-slate-500 text-sm">No users found.</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{#each users as user}
					<UserCard {user} showShareLink showEdit />
				{/each}
			</div>
		{/if}
	{/if}
</div>
