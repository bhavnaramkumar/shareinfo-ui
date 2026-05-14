<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { 
		getAllUserInfo, updateUser,
		addEducation, updateEducation, deleteEducation,
		addExperience, updateExperience, deleteExperience,
		addProject, updateProject, deleteProject,
		addSkill, updateSkill, deleteSkill
	} from '$lib/api.js';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	const userId = $derived($page.params.id);

	let current = $state(null);
	let fetchLoading = $state(true);
	let fetchError = $state(null);

	// User fields
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let phone = $state('');

	let saveLoading = $state(false);
	let saveError = $state(null);
	let saveSuccess = $state(null);

	// Nested entities lists
	let educations = $state([]);
	let experiences = $state([]);
	let projects = $state([]);
	let skills = $state([]);

	// Form states
	let eduForm = $state({ id: null, name: '', major: '', minor: '', gpa: 0 });
	let expForm = $state({ id: null, work_place: '', location: '', job_title: '', start_date: '', end_date: '', job_description: '' });
	let projForm = $state({ id: null, name: '', description: '' });
	let skillForm = $state({ id: null, technical_skills: '', soft_skills: '' });

	async function loadData() {
		try {
			fetchLoading = true;
			const data = await getAllUserInfo(userId);
			current = data.user;
			firstName = current.first_name ?? '';
			lastName = current.last_name ?? '';
			email = current.email ?? '';
			phone = current.phonenumber ?? '';

			educations = data.education ?? [];
			experiences = data.experience ?? [];
			projects = data.project ?? [];
			skills = data.skill ?? [];
		} catch (e) {
			fetchError = e.message;
		} finally {
			fetchLoading = false;
		}
	}

	onMount(loadData);

	async function handleSaveUser() {
		saveLoading = true;
		saveError = null;
		saveSuccess = null;

		const updates = {};
		if (firstName !== current.first_name) updates.first_name = firstName;
		if (lastName !== current.last_name) updates.last_name = lastName;
		if (email !== current.email) updates.email = email;
		if (phone !== current.phonenumber) updates.phonenumber = phone;

		if (Object.keys(updates).length === 0) {
			saveError = 'No changes to save.';
			saveLoading = false;
			return;
		}

		try {
			const updated = await updateUser(userId, updates);
			current = updated;
			saveSuccess = 'User updated successfully.';
		} catch (e) {
			saveError = e.message;
		} finally {
			saveLoading = false;
		}
	}

	// Helpers for generic save/delete
	async function saveEntity(formState, resetForm, createApi, updateApi, listState) {
		try {
			const isUpdate = !!formState.id;
			const payload = { ...formState, user_id: parseInt(userId) };
			delete payload.id;
			
			if (isUpdate) {
				await updateApi(formState.id, payload);
			} else {
				await createApi(payload);
			}
			await loadData();
			resetForm();
		} catch (e) {
			alert('Error saving: ' + e.message);
		}
	}

	async function deleteEntity(id, deleteApi) {
		if (!confirm('Are you sure you want to delete this item?')) return;
		try {
			await deleteApi(id);
			await loadData();
		} catch (e) {
			alert('Error deleting: ' + e.message);
		}
	}

</script>

<div class="pb-12">
	<div class="mb-6 flex items-center gap-3">
		<a href="/" class="text-slate-500 hover:text-slate-300 transition-colors">
			<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</a>
		<div>
			<h2 class="text-xl font-semibold text-slate-100">Edit User</h2>
			<p class="text-slate-500 text-sm mt-0.5">ID: {userId}</p>
		</div>
	</div>

	<StatusMessage loading={fetchLoading} error={fetchError} />

	{#if !fetchLoading && !fetchError && current}
		<!-- Basic Info -->
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
			<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Basic Details</h3>
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">First Name</span>
					<input type="text" bind:value={firstName} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Last Name</span>
					<input type="text" bind:value={lastName} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Email</span>
					<input type="email" bind:value={email} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm" />
				</label>
				<label class="block">
					<span class="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wide">Phone</span>
					<input type="text" bind:value={phone} class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-100 text-sm" />
				</label>
			</div>
			<StatusMessage loading={saveLoading} error={saveError} success={saveSuccess} />
			<button onclick={handleSaveUser} disabled={saveLoading} class="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-medium rounded-lg transition-colors">
				{saveLoading ? 'Saving...' : 'Save User Details'}
			</button>
			<a href="/resume/{userId}" class="ml-2 px-5 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-medium rounded-lg transition-colors">View Resume</a>
		</div>

		<!-- Education -->
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
			<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Education</h3>
			{#if educations.length > 0}
				<ul class="space-y-3 mb-6">
					{#each educations as edu}
						<li class="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center border border-slate-700/50">
							<div>
								<div class="font-medium text-slate-200">{edu.name}</div>
								<div class="text-sm text-slate-400">{edu.major} (Minor: {edu.minor}) - GPA: {edu.gpa}</div>
							</div>
							<div class="flex gap-2">
								<button onclick={() => eduForm = { ...edu }} class="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
								<button onclick={() => deleteEntity(edu.id, deleteEducation)} class="text-red-400 hover:text-red-300 text-sm">Delete</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="bg-slate-900 p-4 rounded-lg border border-slate-700">
				<h4 class="text-sm font-medium text-slate-300 mb-3">{eduForm.id ? 'Edit' : 'Add'} Education</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<input type="text" placeholder="Institution Name" bind:value={eduForm.name} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Major" bind:value={eduForm.major} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Minor" bind:value={eduForm.minor} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="number" step="0.1" placeholder="GPA" bind:value={eduForm.gpa} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
				</div>
				<div class="flex gap-2">
					<button onclick={() => saveEntity(eduForm, () => eduForm = { id: null, name: '', major: '', minor: '', gpa: 0 }, addEducation, updateEducation, educations)} class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded">Save</button>
					{#if eduForm.id}
						<button onclick={() => eduForm = { id: null, name: '', major: '', minor: '', gpa: 0 }} class="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded">Cancel</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Experience -->
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
			<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Experience</h3>
			{#if experiences.length > 0}
				<ul class="space-y-3 mb-6">
					{#each experiences as exp}
						<li class="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center border border-slate-700/50">
							<div>
								<div class="font-medium text-slate-200">{exp.job_title} at {exp.work_place}</div>
								<div class="text-sm text-slate-400">{exp.start_date} - {exp.end_date} | {exp.location}</div>
							</div>
							<div class="flex gap-2">
								<button onclick={() => expForm = { ...exp }} class="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
								<button onclick={() => deleteEntity(exp.id, deleteExperience)} class="text-red-400 hover:text-red-300 text-sm">Delete</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="bg-slate-900 p-4 rounded-lg border border-slate-700">
				<h4 class="text-sm font-medium text-slate-300 mb-3">{expForm.id ? 'Edit' : 'Add'} Experience</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<input type="text" placeholder="Workplace" bind:value={expForm.work_place} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Location" bind:value={expForm.location} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Job Title" bind:value={expForm.job_title} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Start Date" bind:value={expForm.start_date} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="End Date" bind:value={expForm.end_date} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Description" bind:value={expForm.job_description} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200 sm:col-span-2" />
				</div>
				<div class="flex gap-2">
					<button onclick={() => saveEntity(expForm, () => expForm = { id: null, work_place: '', location: '', job_title: '', start_date: '', end_date: '', job_description: '' }, addExperience, updateExperience, experiences)} class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded">Save</button>
					{#if expForm.id}
						<button onclick={() => expForm = { id: null, work_place: '', location: '', job_title: '', start_date: '', end_date: '', job_description: '' }} class="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded">Cancel</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Skills -->
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
			<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Skills</h3>
			{#if skills.length > 0}
				<ul class="space-y-3 mb-6">
					{#each skills as skill}
						<li class="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center border border-slate-700/50">
							<div>
								<div class="font-medium text-slate-200">Tech: {skill.technical_skills}</div>
								<div class="text-sm text-slate-400">Soft: {skill.soft_skills}</div>
							</div>
							<div class="flex gap-2">
								<button onclick={() => skillForm = { ...skill }} class="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
								<button onclick={() => deleteEntity(skill.id, deleteSkill)} class="text-red-400 hover:text-red-300 text-sm">Delete</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="bg-slate-900 p-4 rounded-lg border border-slate-700">
				<h4 class="text-sm font-medium text-slate-300 mb-3">{skillForm.id ? 'Edit' : 'Add'} Skills</h4>
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
					<input type="text" placeholder="Technical Skills (comma separated)" bind:value={skillForm.technical_skills} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<input type="text" placeholder="Soft Skills (comma separated)" bind:value={skillForm.soft_skills} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
				</div>
				<div class="flex gap-2">
					<button onclick={() => saveEntity(skillForm, () => skillForm = { id: null, technical_skills: '', soft_skills: '' }, addSkill, updateSkill, skills)} class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded">Save</button>
					{#if skillForm.id}
						<button onclick={() => skillForm = { id: null, technical_skills: '', soft_skills: '' }} class="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded">Cancel</button>
					{/if}
				</div>
			</div>
		</div>

		<!-- Projects -->
		<div class="bg-slate-800 border border-slate-700 rounded-xl p-5 mb-8">
			<h3 class="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Projects</h3>
			{#if projects.length > 0}
				<ul class="space-y-3 mb-6">
					{#each projects as project}
						<li class="bg-slate-900/50 rounded-lg p-3 flex justify-between items-center border border-slate-700/50">
							<div>
								<div class="font-medium text-slate-200">{project.name}</div>
								<div class="text-sm text-slate-400">{project.description}</div>
							</div>
							<div class="flex gap-2">
								<button onclick={() => projForm = { ...project }} class="text-indigo-400 hover:text-indigo-300 text-sm">Edit</button>
								<button onclick={() => deleteEntity(project.id, deleteProject)} class="text-red-400 hover:text-red-300 text-sm">Delete</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
			<div class="bg-slate-900 p-4 rounded-lg border border-slate-700">
				<h4 class="text-sm font-medium text-slate-300 mb-3">{projForm.id ? 'Edit' : 'Add'} Project</h4>
				<div class="grid grid-cols-1 gap-3 mb-3">
					<input type="text" placeholder="Project Name" bind:value={projForm.name} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" />
					<textarea placeholder="Description" bind:value={projForm.description} class="w-full bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-sm text-slate-200" rows="3"></textarea>
				</div>
				<div class="flex gap-2">
					<button onclick={() => saveEntity(projForm, () => projForm = { id: null, name: '', description: '' }, addProject, updateProject, projects)} class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded">Save</button>
					{#if projForm.id}
						<button onclick={() => projForm = { id: null, name: '', description: '' }} class="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded">Cancel</button>
					{/if}
				</div>
			</div>
		</div>

	{/if}
</div>
