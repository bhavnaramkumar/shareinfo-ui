<script>
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import {
		getUser,
		getUserSkills,
		getUserExperience,
		getUserProjects,
		getUserEducation
	} from '$lib/api.js';
	import StatusMessage from '$lib/components/StatusMessage.svelte';

	const userId = $derived($page.params.id);
	const isShare = $derived($page.url.searchParams.get('share') === 'true');

	let user = $state(null);
	let skills = $state(null);
	let experience = $state([]);
	let projects = $state([]);
	let education = $state([]);
	let loading = $state(true);
	let error = $state(null);

	let copied = $state(false);

	function parseBadges(str) {
		if (!str) return [];
		return str
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);
	}

	function formatDate(d) {
		if (!d) return 'Present';
		return new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}

	function copyShareLink() {
		const url = `${window.location.origin}/resume/${userId}?share=true`;
		navigator.clipboard.writeText(url);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function downloadPDF() {
		window.print();
	}

	onMount(async () => {
		try {
			const [userRes, skillsRes, expRes, projRes, eduRes] = await Promise.allSettled([
				getUser(userId),
				getUserSkills(userId),
				getUserExperience(userId),
				getUserProjects(userId),
				getUserEducation(userId)
			]);

			if (userRes.status === 'rejected') throw new Error(userRes.reason.message);
			user = userRes.value;

			if (skillsRes.status === 'fulfilled') {
				const s = skillsRes.value;
				skills = Array.isArray(s) ? s[0] : s;
			}
			if (expRes.status === 'fulfilled') experience = expRes.value ?? [];
			if (projRes.status === 'fulfilled') projects = projRes.value ?? [];
			if (eduRes.status === 'fulfilled') education = eduRes.value ?? [];
		} catch (e) {
			error = e.message;
		} finally {
			loading = false;
		}
	});
</script>

<div class={isShare ? 'min-h-screen bg-slate-900 p-6 md:p-12' : ''}>
	<div class="max-w-3xl mx-auto">
		<StatusMessage {loading} {error} />

		{#if !loading && !error && user}
			<!-- Resume Container -->
			<div class="bg-slate-800 border border-slate-700 rounded-2xl p-7">
				<!-- Header -->
				<div class="flex items-start justify-between gap-4 mb-8">
					<div>
						<h1 class="text-2xl font-bold text-slate-100">
							{user.first_name}
							{user.last_name}
						</h1>
						<div class="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-slate-400">
							{#if user.email}
								<span>{user.email}</span>
							{/if}
							{#if user.phonenumber}
								<span>{user.phonenumber}</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-col items-end gap-1 no-print shrink-0">
						<div class="flex gap-2">
							{#if !isShare}
								<a
									href="/users/{userId}/edit"
									class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
								>
									Edit
								</a>
								<button
									onclick={copyShareLink}
									class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors"
								>
									{copied ? 'Copied!' : 'Share'}
								</button>
							{/if}
							<button
								onclick={downloadPDF}
								class="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium rounded-lg transition-colors"
							>
								Download PDF
							</button>
						</div>
					</div>
				</div>

				<!-- Skills -->
				{#if skills && (skills.technical_skills || skills.soft_skills)}
					<section class="mb-8">
						<h2 class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Skills</h2>
						{#if skills.technical_skills}
							<div class="mb-3">
								<p class="text-xs text-slate-500 mb-2">Technical</p>
								<div class="flex flex-wrap gap-2">
									{#each parseBadges(skills.technical_skills) as skill}
										<span class="px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs rounded-lg">{skill}</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if skills.soft_skills}
							<div>
								<p class="text-xs text-slate-500 mb-2">Soft Skills</p>
								<div class="flex flex-wrap gap-2">
									{#each parseBadges(skills.soft_skills) as skill}
										<span class="px-2.5 py-1 bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg">{skill}</span>
									{/each}
								</div>
							</div>
						{/if}
					</section>
				{/if}

				<!-- Divider after Skills -->
				{#if skills && (skills.technical_skills || skills.soft_skills)}
					<div class="border-t border-slate-700 mb-8"></div>
				{/if}

				<!-- Experience -->
				{#if experience.length > 0}
					<section class="mb-8">
						<h2 class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Experience</h2>
						<div class="space-y-5">
							{#each experience as job}
								<div class="relative pl-4 border-l border-slate-700">
									<div class="flex items-start justify-between gap-2 mb-1">
										<div>
											<p class="text-sm font-semibold text-slate-100">{job.job_title}</p>
											<p class="text-sm text-slate-400">
												{job.work_place}{job.location ? ` · ${job.location}` : ''}
											</p>
										</div>
										<span class="text-xs text-slate-500 shrink-0 pt-0.5">
											{formatDate(job.start_date)} – {formatDate(job.end_date)}
										</span>
									</div>
									{#if job.job_description}
										<p class="text-sm text-slate-400 mt-2 leading-relaxed">{job.job_description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Divider after Experience -->
				{#if experience.length > 0}
					<div class="border-t border-slate-700 mb-8"></div>
				{/if}

				<!-- Projects -->
				{#if projects.length > 0}
					<section class="mb-8">
						<h2 class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Projects</h2>
						<div class="space-y-4">
							{#each projects as proj}
								<div class="relative pl-4 border-l border-slate-700">
									<p class="text-sm font-semibold text-slate-100 mb-1">{proj.name}</p>
									{#if proj.description}
										<p class="text-sm text-slate-400 leading-relaxed">{proj.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Divider after Projects -->
				{#if projects.length > 0}
					<div class="border-t border-slate-700 mb-8"></div>
				{/if}

				<!-- Education -->
				{#if education.length > 0}
					<section class="mb-8">
						<h2 class="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-5">Education</h2>
						<div class="space-y-4">
							{#each education as edu}
								<div class="relative pl-4 border-l border-slate-700">
									<p class="text-sm font-semibold text-slate-100">{edu.name}</p>
									<p class="text-sm text-slate-400 mt-0.5">
										{#if edu.major}Major: {edu.major}{/if}
										{#if edu.minor} · Minor: {edu.minor}{/if}
										{#if edu.gpa} · GPA: {edu.gpa}{/if}
									</p>
								</div>
							{/each}
						</div>
					</section>
				{/if}

				{#if !skills && experience.length === 0 && projects.length === 0 && education.length === 0}
					<div class="text-center py-10 text-slate-500 text-sm">
						No portfolio details added yet.
						{#if !isShare}
							<a href="/users/add" class="text-indigo-400 hover:text-indigo-300 ml-1">Add some →</a>
						{/if}
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>

<style>
	@media print {
		:global(body) {
			background: white !important;
		}

		/* Hide sidebar, nav, and action buttons */
		:global(aside),
		:global(nav),
		.no-print {
			display: none !important;
		}

		/* Remove sidebar offset */
		:global(main) {
			margin-left: 0 !important;
			padding: 0 !important;
		}

		/* Resume card: white background, no shadow/border radius */
		:global(.bg-slate-800),
		:global(.bg-slate-900) {
			background: white !important;
			border: none !important;
			border-radius: 0 !important;
			box-shadow: none !important;
		}

		/* All text → black */
		:global(.text-slate-100),
		:global(.text-slate-300),
		:global(.text-slate-400),
		:global(.text-slate-500),
		:global(.text-indigo-300) {
			color: #111 !important;
		}

		/* Section headings */
		:global(h1), :global(h2) {
			color: #000 !important;
		}

		/* Skill badges: white bg, dark border, dark text */
		:global(.bg-indigo-950\/60),
		:global(.bg-slate-700) {
			background: white !important;
		}
		:global(.border-indigo-800\/60),
		:global(.border-slate-600) {
			border-color: #555 !important;
		}

		/* Timeline left-border lines */
		:global(.border-slate-700) {
			border-color: #bbb !important;
		}

		/* Section dividers */
		:global(.border-t) {
			border-color: #ddd !important;
		}

		/* Outer page wrapper */
		:global(.min-h-screen) {
			min-height: unset !important;
			background: white !important;
			padding: 0 !important;
		}
	}
</style>
