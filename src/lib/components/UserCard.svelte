<script>
	let { user, showShareLink = false, showEdit = false } = $props();

	let copied = $state(false);

	function copyShareLink() {
		const url = `${window.location.origin}/resume/${user.id}?share=true`;
		navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}
</script>

<div
	class="bg-slate-800 border border-slate-700 rounded-xl p-5 hover:border-indigo-500/60 transition-colors duration-200 flex flex-col"
>
	<div class="flex items-start justify-between mb-3">
		<div>
			<h3 class="text-base font-semibold text-slate-100">
				{user.first_name}
				{user.last_name}
			</h3>
			<span class="text-xs text-slate-500">ID: {user.id}</span>
		</div>
	</div>

	<div class="space-y-1 text-sm text-slate-400 mb-4 flex-1">
		{#if user.email}
			<p class="truncate">{user.email}</p>
		{/if}
		{#if user.phonenumber}
			<p>{user.phonenumber}</p>
		{/if}
	</div>

	<div class="flex gap-2 flex-wrap">
		<a
			href="/resume/{user.id}"
			class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
		>
			View Resume
		</a>
		{#if showEdit}
			<a
				href="/users/{user.id}/edit"
				class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
			>
				Edit
			</a>
		{/if}
		{#if showShareLink}
			<button
				onclick={copyShareLink}
				class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
			>
				{copied ? 'Copied!' : 'Share'}
			</button>
		{/if}
	</div>
</div>
