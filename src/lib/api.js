const BASE_URL = 'https://shareinfo-backend-926695450073.us-central1.run.app';

async function request(path, options = {}) {
	const res = await fetch(`${BASE_URL}${path}`, options);
	if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
	return res.json();
}

function json(method, data) {
	return {
		method,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data)
	};
}

// Users
export const getUsers = () => request('/users/');
export const getUser = (id) => request(`/users/${id}`);
export const getAllUserInfo = (id) => request(`/users/${id}/all`);
export const createUser = (data) => request('/users/', json('POST', data));
export const updateUser = (id, data) => request(`/users/${id}`, json('PUT', data));
export const deleteUser = (id) => request(`/users/${id}`, { method: 'DELETE' });

// Search
export const searchUsers = (q) => request(`/search/?q=${encodeURIComponent(q)}`);

// Resume data
export const getUserSkills = (id) => request(`/users/${id}/skill`);
export const getUserExperience = (id) => request(`/users/${id}/experience`);
export const getUserProjects = (id) => request(`/users/${id}/project`);
export const getUserEducation = (id) => request(`/users/${id}/education`);

// Portfolio creation
export const addEducation = (data) => request('/education/', json('POST', data));
export const updateEducation = (id, data) => request(`/education/${id}`, json('PUT', data));
export const deleteEducation = (id) => request(`/education/${id}`, { method: 'DELETE' });

export const addSkill = (data) => request('/skill/', json('POST', data));
export const updateSkill = (id, data) => request(`/skill/${id}`, json('PUT', data));
export const deleteSkill = (id) => request(`/skill/${id}`, { method: 'DELETE' });

export const addProject = (data) => request('/project/', json('POST', data));
export const updateProject = (id, data) => request(`/project/${id}`, json('PUT', data));
export const deleteProject = (id) => request(`/project/${id}`, { method: 'DELETE' });

export const addExperience = (data) => request('/experience/', json('POST', data));
export const updateExperience = (id, data) => request(`/experience/${id}`, json('PUT', data));
export const deleteExperience = (id) => request(`/experience/${id}`, { method: 'DELETE' });
