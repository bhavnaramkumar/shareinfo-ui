import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export async function load({ cookies, url }) {
	const isShare = url.searchParams.get('share') === 'true';
	const isLogin = url.pathname === '/login';

	if (!isLogin && !isShare) {
		const session = cookies.get('session');
		if (session !== env.SESSION_SECRET) {
			redirect(303, '/login');
		}
	}

	return {};
}
