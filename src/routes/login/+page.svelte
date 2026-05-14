<script>
	let { form } = $props();
</script>

<div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
	<div class="w-full max-w-sm">
		<div class="text-center mb-8">
			<div
				class="inline-flex items-center justify-center w-12 h-12 bg-indigo-600 rounded-xl mb-4"
			>
				<svg
					class="w-6 h-6 text-white"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
					/>
				</svg>
			</div>
			<h1 class="text-2xl font-bold text-slate-100">ShareInfo</h1>
			<p class="text-slate-500 text-sm mt-1">User Portfolio System</p>
		</div>

		<form method="POST" class="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
			{#if form?.error}
				<div class="bg-red-950/50 border border-red-800 text-red-300 px-3 py-2.5 rounded-lg text-sm">
					{form.error}
				</div>
			{/if}

			<label class="block">
				<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Username</span>
				<input
					type="text"
					name="username"
					class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-600"
					placeholder="Username"
				/>
			</label>

			<label class="block">
				<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Password</span>
				<input
					type="password"
					name="password"
					class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2.5 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-colors placeholder:text-slate-600"
					placeholder="••••••••"
				/>
			</label>

			<button
				type="submit"
				class="w-full bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
			>
				Sign in
			</button>
		</form>
	</div>
</div>
