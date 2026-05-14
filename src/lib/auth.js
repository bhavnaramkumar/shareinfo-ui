import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createAuthStore() {
	const initial = browser ? sessionStorage.getItem('isLoggedIn') === 'true' : false;
	const { subscribe, set } = writable(initial);

	return {
		subscribe,
		login() {
			if (browser) sessionStorage.setItem('isLoggedIn', 'true');
			set(true);
		},
		logout() {
			if (browser) sessionStorage.removeItem('isLoggedIn');
			set(false);
		}
	};
}

export const auth = createAuthStore();
