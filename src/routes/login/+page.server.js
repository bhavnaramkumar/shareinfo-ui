import { fail, redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		console.log('got:', JSON.stringify(username), JSON.stringify(password));
		console.log('exp:', JSON.stringify(env.ADMIN_USERNAME), JSON.stringify(env.ADMIN_PASSWORD));

		if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
			return fail(500, { error: 'Server configuration error: Missing environment variables on Cloudflare.' });
		}

		if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
			return fail(401, { error: 'Invalid username or password.' });
		}

		cookies.set('session', env.SESSION_SECRET, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7
		});

		redirect(303, '/');
	}
};
