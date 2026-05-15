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

	const theme = $derived({
		pageBg: isShare ? 'min-h-screen bg-slate-100 p-4 sm:p-6 md:py-12' : 'min-h-screen bg-slate-900 p-4 sm:p-6 md:p-12',
		wrapper: isShare ? 'max-w-4xl mx-auto' : 'max-w-3xl mx-auto',
		container: isShare 
			? 'bg-white shadow-2xl border border-slate-200 p-6 sm:p-10 md:p-16 text-slate-900 overflow-hidden' 
			: 'bg-slate-800 border border-slate-700 rounded-2xl p-5 sm:p-7 text-slate-100 overflow-hidden',
		nameHeading: isShare ? 'text-3xl sm:text-4xl md:text-5xl font-serif text-slate-900 tracking-tight break-words' : 'text-2xl sm:text-3xl font-bold text-slate-100 break-words',
		headerDetails: isShare ? 'flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2 mt-4 text-sm text-slate-600 font-medium' : 'flex flex-col sm:flex-row flex-wrap gap-x-4 gap-y-2 mt-2 text-sm text-slate-400',
		sectionTitle: isShare 
			? 'text-base sm:text-lg font-serif font-bold text-slate-900 uppercase tracking-widest mb-5 sm:mb-6 border-b border-slate-200 pb-2' 
			: 'text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4',
		itemTitle: isShare ? 'text-base font-bold text-slate-900 leading-snug' : 'text-sm font-semibold text-slate-100',
		itemSubtitle: isShare ? 'text-sm font-medium text-slate-700 mt-0.5' : 'text-sm text-slate-400 mt-0.5',
		itemDate: isShare ? 'text-sm font-medium text-slate-500 shrink-0 sm:text-right pt-1 sm:pt-0.5' : 'text-xs text-slate-500 shrink-0 sm:text-right pt-1 sm:pt-0.5',
		itemDescription: isShare ? 'text-sm text-slate-600 mt-2 leading-relaxed' : 'text-sm text-slate-400 mt-2 leading-relaxed',
		timelineBorder: isShare ? 'border-slate-300' : 'border-slate-700',
		sectionDivider: isShare ? 'border-slate-300' : 'border-slate-700',
		techBadge: isShare 
			? 'px-3 py-1 bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs rounded' 
			: 'px-2.5 py-1 bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs rounded-lg',
		softBadge: isShare 
			? 'px-3 py-1 bg-white border border-slate-200 text-slate-600 font-medium text-xs rounded' 
			: 'px-2.5 py-1 bg-slate-700 border border-slate-600 text-slate-300 text-xs rounded-lg',
		badgeHeader: isShare ? 'text-sm font-serif font-semibold text-slate-800 mb-2' : 'text-xs text-slate-500 mb-2',
	});

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

<div class={isShare ? theme.pageBg : ''}>
	<div class={theme.wrapper}>
		<StatusMessage {loading} {error} />

		{#if !loading && !error && user}
			<!-- Action Toolbar (Outside Resume) -->
			<div class="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 mb-6 no-print">
				{#if !isShare}
					<a
						href="/users/{userId}/edit"
						class="px-3 py-2 sm:px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 sm:gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
						<span class="hidden sm:inline">Edit Profile</span>
						<span class="sm:hidden">Edit</span>
					</a>
					<button
						onclick={copyShareLink}
						class="px-3 py-2 sm:px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors shadow-lg shadow-indigo-900/20 flex items-center gap-1.5 sm:gap-2"
					>
						<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
						{#if copied}
							Copied!
						{:else}
							<span class="hidden sm:inline">Share Resume</span>
							<span class="sm:hidden">Share</span>
						{/if}
					</button>
				{/if}
				<button
					onclick={downloadPDF}
					class={isShare 
						? "px-3 py-2 sm:px-4 bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-medium rounded-xl transition-colors border border-slate-200 shadow-sm flex items-center justify-center gap-1.5 sm:gap-2 w-full sm:w-auto mt-2 sm:mt-0"
						: "px-3 py-2 sm:px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-medium rounded-xl transition-colors border border-slate-700 flex items-center gap-1.5 sm:gap-2"}
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
					Download PDF
				</button>
			</div>

			<!-- Resume Container -->
			<div class={theme.container}>
				<!-- Header -->
				<div class="mb-8">
					<h1 class={theme.nameHeading}>
						{user.first_name}
						{user.last_name}
					</h1>
					<div class={theme.headerDetails}>
						{#if user.email}
							<span>{user.email}</span>
						{/if}
						{#if user.phonenumber}
							<span>{user.phonenumber}</span>
						{/if}
					</div>
				</div>

				<!-- Skills -->
				{#if skills && (skills.technical_skills || skills.soft_skills)}
					<section class="mb-8">
						<h2 class={theme.sectionTitle}>Skills</h2>
						{#if skills.technical_skills}
							<div class="mb-3">
								<p class={theme.badgeHeader}>Technical</p>
								<div class="flex flex-wrap gap-2">
									{#each parseBadges(skills.technical_skills) as skill}
										<span class={theme.techBadge}>{skill}</span>
									{/each}
								</div>
							</div>
						{/if}
						{#if skills.soft_skills}
							<div>
								<p class={theme.badgeHeader}>Soft Skills</p>
								<div class="flex flex-wrap gap-2">
									{#each parseBadges(skills.soft_skills) as skill}
										<span class={theme.softBadge}>{skill}</span>
									{/each}
								</div>
							</div>
						{/if}
					</section>
				{/if}

				<!-- Divider after Skills -->
				{#if skills && (skills.technical_skills || skills.soft_skills) && !isShare}
					<div class={`border-t mb-8 ${theme.sectionDivider}`}></div>
				{/if}

				<!-- Experience -->
				{#if experience.length > 0}
					<section class="mb-8">
						<h2 class={theme.sectionTitle}>Experience</h2>
						<div class="space-y-5">
							{#each experience as job}
								<div class={`relative pl-4 border-l ${theme.timelineBorder}`}>
									<div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-1">
										<div>
											<p class={theme.itemTitle}>{job.job_title}</p>
											<p class={theme.itemSubtitle}>
												{job.work_place}{job.location ? ` · ${job.location}` : ''}
											</p>
										</div>
										<span class={theme.itemDate}>
											{formatDate(job.start_date)} – {formatDate(job.end_date)}
										</span>
									</div>
									{#if job.job_description}
										<p class={theme.itemDescription}>{job.job_description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Divider after Experience -->
				{#if experience.length > 0 && !isShare}
					<div class={`border-t mb-8 ${theme.sectionDivider}`}></div>
				{/if}

				<!-- Projects -->
				{#if projects.length > 0}
					<section class="mb-8">
						<h2 class={theme.sectionTitle}>Projects</h2>
						<div class="space-y-4">
							{#each projects as proj}
								<div class={`relative pl-4 border-l ${theme.timelineBorder}`}>
									<p class={theme.itemTitle}>{proj.name}</p>
									{#if proj.description}
										<p class={theme.itemDescription}>{proj.description}</p>
									{/if}
								</div>
							{/each}
						</div>
					</section>
				{/if}

				<!-- Divider after Projects -->
				{#if projects.length > 0 && !isShare}
					<div class={`border-t mb-8 ${theme.sectionDivider}`}></div>
				{/if}

				<!-- Education -->
				{#if education.length > 0}
					<section class="mb-8">
						<h2 class={theme.sectionTitle}>Education</h2>
						<div class="space-y-4">
							{#each education as edu}
								<div class={`relative pl-4 border-l ${theme.timelineBorder}`}>
									<p class={theme.itemTitle}>{edu.name}</p>
									<p class={theme.itemDescription}>
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
		:global(.bg-slate-900),
		:global(.bg-slate-100) {
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
		:global(.text-slate-600),
		:global(.text-slate-700),
		:global(.text-slate-800),
		:global(.text-slate-900),
		:global(.text-indigo-300) {
			color: #111 !important;
		}

		/* Section headings */
		:global(h1), :global(h2) {
			color: #000 !important;
		}

		/* Skill badges: white bg, dark border, dark text */
		:global(.bg-indigo-950\/60),
		:global(.bg-slate-700),
		:global(.bg-slate-50) {
			background: white !important;
		}
		:global(.border-indigo-800\/60),
		:global(.border-slate-600),
		:global(.border-slate-200) {
			border-color: #555 !important;
		}

		/* Timeline left-border lines */
		:global(.border-slate-700),
		:global(.border-slate-300) {
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
