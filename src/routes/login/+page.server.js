import { fail, redirect } from '@sveltejs/kit';
import { ADMIN_USERNAME, ADMIN_PASSWORD, SESSION_SECRET } from '$env/static/private';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		console.log('got:', JSON.stringify(username), JSON.stringify(password));
		console.log('exp:', JSON.stringify(ADMIN_USERNAME), JSON.stringify(ADMIN_PASSWORD));

		if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
			return fail(401, { error: 'Invalid username or password.' });
		}

		cookies.set('session', SESSION_SECRET, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		redirect(303, '/');
	}
};
