<script>
	import { createUser, addEducation, addSkill, addProject, addExperience } from '$lib/api.js';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	// Step 1: base user
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');
	let createdUserId = $state(null);
	let createLoading = $state(false);
	let createError = $state(null);

	// Active portfolio tab
	let activeTab = $state('education');

	// Education
	let edu = $state({ name: '', major: '', minor: '', gpa: '' });
	let eduLoading = $state(false);
	let eduMsg = $state({ error: null, success: null });

	// Skills
	let skills = $state({ technical_skills: '', soft_skills: '' });
	let skillsLoading = $state(false);
	let skillsMsg = $state({ error: null, success: null });

	// Projects
	let project = $state({ name: '', description: '' });
	let projectLoading = $state(false);
	let projectMsg = $state({ error: null, success: null });

	// Experience
	let exp = $state({
		work_place: '',
		location: '',
		job_title: '',
		start_date: '',
		end_date: '',
		job_description: ''
	});
	let expLoading = $state(false);
	let expMsg = $state({ error: null, success: null });

	function clean(obj) {
		return Object.fromEntries(
			Object.entries(obj).filter(([, v]) => v !== '' && v !== null && v !== undefined)
		);
	}

	async function handleCreateUser() {
		createLoading = true;
		createError = null;
		try {
			const data = clean({ first_name: firstName, last_name: lastName, email, phonenumber: phone });
			const result = await createUser(data);
			createdUserId = result.id;
		} catch (e) {
			createError = e.message;
		} finally {
			createLoading = false;
		}
	}

	async function handleAddEducation() {
		eduLoading = true;
		eduMsg = { error: null, success: null };
		try {
			await addEducation(clean({ user_id: createdUserId, ...edu }));
			eduMsg.success = 'Education added.';
			edu = { name: '', major: '', minor: '', gpa: '' };
		} catch (e) {
			eduMsg.error = e.message;
		} finally {
			eduLoading = false;
		}
	}

	async function handleAddSkills() {
		skillsLoading = true;
		skillsMsg = { error: null, success: null };
		try {
			await addSkill(clean({ user_id: createdUserId, ...skills }));
			skillsMsg.success = 'Skills added.';
			skills = { technical_skills: '', soft_skills: '' };
		} catch (e) {
			skillsMsg.error = e.message;
		} finally {
			skillsLoading = false;
		}
	}

	async function handleAddProject() {
		projectLoading = true;
		projectMsg = { error: null, success: null };
		try {
			await addProject(clean({ user_id: createdUserId, ...project }));
			projectMsg.success = 'Project added.';
			project = { name: '', description: '' };
		} catch (e) {
			projectMsg.error = e.message;
		} finally {
			projectLoading = false;
		}
	}

	async function handleAddExperience() {
		expLoading = true;
		expMsg = { error: null, success: null };
		try {
			await addExperience(clean({ user_id: createdUserId, ...exp }));
			expMsg.success = 'Experience added.';
			exp = { work_place: '', location: '', job_title: '', start_date: '', end_date: '', job_description: '' };
		} catch (e) {
			expMsg.error = e.message;
		} finally {
			expLoading = false;
		}
	}

	const tabs = ['education', 'skills', 'projects', 'experience'];
</script>

<div>
	<div class="mb-6">
		<h2 class="text-xl font-semibold text-slate-100">Add User</h2>
		<p class="text-slate-500 text-sm mt-0.5">Create a new user and optionally add portfolio details</p>
	</div>

	<!-- Step 1: Create User -->
	<div class="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6 max-w-lg">
		<div class="flex items-center gap-3 mb-5">
			<div class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">1</div>
			<h3 class="text-sm font-semibold text-slate-200">Basic Information</h3>
			{#if createdUserId}
				<span class="ml-auto text-xs bg-green-900/40 border border-green-700 text-green-400 px-2 py-0.5 rounded-full">
					ID: {createdUserId}
				</span>
			{/if}
		</div>

		{#if !createdUserId}
			<div class="grid grid-cols-2 gap-4 mb-4">
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">First Name</span>
					<input type="text" bind:value={firstName} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Last Name</span>
					<input type="text" bind:value={lastName} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Email</span>
					<input type="email" bind:value={email} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Phone</span>
					<input type="text" bind:value={phone} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
				</label>
			</div>

			<StatusMessage loading={createLoading} error={createError} />

			<button
				onclick={handleCreateUser}
				disabled={createLoading || !firstName || !lastName}
				class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors"
			>
				{createLoading ? 'Creating...' : 'Create User'}
			</button>
		{:else}
			<p class="text-sm text-slate-400">
				User created. Add portfolio details below, or
				<a href="/users/{createdUserId}/edit" class="text-indigo-400 hover:text-indigo-300">view their profile</a>.
			</p>
		{/if}
	</div>

	<!-- Step 2: Portfolio (shown after user created) -->
	{#if createdUserId}
		<div class="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden max-w-2xl">
			<div class="flex items-center gap-3 p-5 border-b border-slate-700">
				<div class="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">2</div>
				<h3 class="text-sm font-semibold text-slate-200">Portfolio Details</h3>
				<span class="text-xs text-slate-500">(optional — can add multiple)</span>
			</div>

			<!-- Tabs -->
			<div class="flex border-b border-slate-700">
				{#each tabs as tab}
					<button
						onclick={() => (activeTab = tab)}
						class="px-4 py-3 text-xs font-medium capitalize transition-colors {activeTab === tab
							? 'text-indigo-400 border-b-2 border-indigo-500 -mb-px'
							: 'text-slate-500 hover:text-slate-300'}"
					>
						{tab}
					</button>
				{/each}
			</div>

			<div class="p-6">
				{#if activeTab === 'education'}
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Institution</span>
								<input type="text" bind:value={edu.name} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Major</span>
								<input type="text" bind:value={edu.major} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Minor</span>
								<input type="text" bind:value={edu.minor} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">GPA</span>
								<input type="text" bind:value={edu.gpa} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
						</div>
						<StatusMessage loading={eduLoading} error={eduMsg.error} success={eduMsg.success} />
						<button onclick={handleAddEducation} disabled={eduLoading} class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors">
							{eduLoading ? 'Saving...' : 'Add Education'}
						</button>
					</div>

				{:else if activeTab === 'skills'}
					<div class="space-y-4">
						<label class="block">
							<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Technical Skills <span class="normal-case text-slate-600">(comma-separated)</span></span>
							<input type="text" bind:value={skills.technical_skills} placeholder="Python, React, SQL..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" />
						</label>
						<label class="block">
							<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Soft Skills <span class="normal-case text-slate-600">(comma-separated)</span></span>
							<input type="text" bind:value={skills.soft_skills} placeholder="Leadership, Communication..." class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600" />
						</label>
						<StatusMessage loading={skillsLoading} error={skillsMsg.error} success={skillsMsg.success} />
						<button onclick={handleAddSkills} disabled={skillsLoading} class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors">
							{skillsLoading ? 'Saving...' : 'Add Skills'}
						</button>
					</div>

				{:else if activeTab === 'projects'}
					<div class="space-y-4">
						<label class="block">
							<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Project Name</span>
							<input type="text" bind:value={project.name} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
						</label>
						<label class="block">
							<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Description</span>
							<textarea bind:value={project.description} rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
						</label>
						<StatusMessage loading={projectLoading} error={projectMsg.error} success={projectMsg.success} />
						<button onclick={handleAddProject} disabled={projectLoading} class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors">
							{projectLoading ? 'Saving...' : 'Add Project'}
						</button>
					</div>

				{:else if activeTab === 'experience'}
					<div class="space-y-4">
						<div class="grid grid-cols-2 gap-4">
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Workplace</span>
								<input type="text" bind:value={exp.work_place} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Job Title</span>
								<input type="text" bind:value={exp.job_title} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<label class="block">
								<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Location</span>
								<input type="text" bind:value={exp.location} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
							</label>
							<div class="grid grid-cols-2 gap-2">
								<label class="block">
									<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Start</span>
									<input type="date" bind:value={exp.start_date} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
								</label>
								<label class="block">
									<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">End</span>
									<input type="date" bind:value={exp.end_date} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors" />
								</label>
							</div>
						</div>
						<label class="block">
							<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Description</span>
							<textarea bind:value={exp.job_description} rows="3" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 transition-colors resize-none"></textarea>
						</label>
						<StatusMessage loading={expLoading} error={expMsg.error} success={expMsg.success} />
						<button onclick={handleAddExperience} disabled={expLoading} class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors">
							{expLoading ? 'Saving...' : 'Add Experience'}
						</button>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
