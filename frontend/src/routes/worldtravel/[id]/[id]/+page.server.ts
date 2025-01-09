const PUBLIC_SERVER_URL = process.env['PUBLIC_SERVER_URL'];
import type { City, Country, Region, VisitedRegion } from '$lib/types';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const endpoint = PUBLIC_SERVER_URL || 'http://localhost:8000';

export const load = (async (event) => {
	const id = event.params.id.toUpperCase();

	let cities: City[] = [];
	let region = {} as Region;

	let sessionId = event.cookies.get('sessionid');

	if (!sessionId) {
		return redirect(302, '/login');
	}

	let res = await fetch(`${endpoint}/api/regions/${id}/cities/`, {
		method: 'GET',
		headers: {
			Cookie: `sessionid=${sessionId}`
		}
	});
	if (!res.ok) {
		console.error('Failed to fetch regions');
		return redirect(302, '/404');
	} else {
		cities = (await res.json()) as City[];
	}

	// res = await fetch(`${endpoint}/api/${id}/visits/`, {
	// 	method: 'GET',
	// 	headers: {
	// 		Cookie: `sessionid=${sessionId}`
	// 	}
	// });
	// if (!res.ok) {
	// 	console.error('Failed to fetch visited regions');
	// 	return { status: 500 };
	// } else {
	// 	visitedRegions = (await res.json()) as VisitedRegion[];
	// }

	res = await fetch(`${endpoint}/api/regions/${id}/`, {
		method: 'GET',
		headers: {
			Cookie: `sessionid=${sessionId}`
		}
	});
	if (!res.ok) {
		console.error('Failed to fetch country');
		return { status: 500 };
	} else {
		region = (await res.json()) as Region;
	}

	return {
		props: {
			cities,
			region
		}
	};
}) satisfies PageServerLoad;
