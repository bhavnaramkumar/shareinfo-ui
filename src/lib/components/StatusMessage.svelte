<script>
	let { loading = false, error = null, success = null } = $props();
</script>

{#if loading}
	<div class="flex items-center gap-3 text-slate-400 py-12 justify-center">
		<div
			class="w-5 h-5 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin"
		></div>
		<span class="text-sm">Loading...</span>
	</div>
{:else if error}
	<div class="bg-red-950/50 border border-red-800 text-red-300 px-4 py-3 rounded-lg text-sm">
		{error}
	</div>
{:else if success}
	<div
		class="bg-green-950/50 border border-green-800 text-green-300 px-4 py-3 rounded-lg text-sm"
	>
		{success}
	</div>
{/if}
