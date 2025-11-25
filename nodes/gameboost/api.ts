import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IRequestOptions,
	IDataObject,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

const BASE_URL = 'https://api.gameboost.com';
const API_VERSION = 'v2';

export interface GameBoostGame {
	id: number;
	name: string;
	slug: string;
	acronym: string | null;
	services: string[] | null;
	game_item_collections: Array<{
		name: string;
		slug: string;
		items_count: number | null;
	}> | null;
}

export interface GameBoostDeliveryTime {
	duration: number;
	unit: 'minutes' | 'hours' | 'days';
	format: string;
	format_long: string;
	seconds: number;
}

export interface GameBoostCredentials {
	login: string | null;
	password: string | null;
	email_login: string | null;
	email_password: string | null;
	email_provider: string | null;
}

export interface GameBoostAccountOffer {
	id: number;
	game: {
		id: number;
		name: string;
		slug: string;
	};
	account_order_ids: number[] | null;
	title: string;
	slug: string;
	description: string | null;
	parameters: IDataObject | null;
	dump: string | null;
	status: 'draft' | 'pending' | 'listed' | 'processing' | 'sold' | 'refunded' | 'archived';
	delivery_time: GameBoostDeliveryTime;
	is_manual_delivery: boolean;
	credentials: GameBoostCredentials;
	delivery_instructions: string | null;
	price: string;
	price_usd: string;
	views: number;
	image_urls: string[];
	created_at: number;
	updated_at: number;
	listed_at: number | null;
}

export interface GameBoostPaginationMeta {
	current_page: number;
	from: number;
	last_page: number;
	per_page: number;
	to: number;
	total: number;
}

export interface GameBoostPaginationLinks {
	first: string | null;
	last: string | null;
	prev: string | null;
	next: string | null;
}

export interface GameBoostListResponse<T> {
	data: T[];
	meta?: GameBoostPaginationMeta;
	links?: GameBoostPaginationLinks;
	message?: string;
}

export interface GameBoostSingleResponse<T> {
	data: T;
	message?: string;
	action?: string;
	previous_status?: string | null;
}

export interface GameBoostAccountOfferTemplate {
	account_data: Record<string, {
		condition: string;
		values?: string[];
	}>;
}

export async function gameBoostApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject> {
	const options: IRequestOptions = {
		method,
		url: `${BASE_URL}/${API_VERSION}${endpoint}`,
		qs: query,
		body,
		json: true,
	};

	if (method === 'GET' || method === 'DELETE') {
		delete options.body;
	}

	if (!query || Object.keys(query).length === 0) {
		delete options.qs;
	}

	try {
		const response = await this.helpers.requestWithAuthentication.call(
			this,
			'gameboostApi',
			options,
		);
		return response as IDataObject;
	} catch (error) {
		throw new NodeApiError(this.getNode(), error as JsonObject, {
			message: (error as Error).message,
		});
	}
}

export async function gameBoostApiRequestAllItems(
	this: IExecuteFunctions,
	method: IHttpRequestMethods,
	endpoint: string,
	body?: IDataObject,
	query?: IDataObject,
): Promise<IDataObject[]> {
	const returnData: IDataObject[] = [];
	let page = 1;
	const perPage = 50;

	query = query || {};
	query.per_page = perPage;

	let responseData: GameBoostListResponse<IDataObject>;

	do {
		query.page = page;

		responseData = await gameBoostApiRequest.call(
			this,
			method,
			endpoint,
			body,
			query,
		) as unknown as GameBoostListResponse<IDataObject>;

		if (responseData.data) {
			returnData.push(...responseData.data);
		}

		page++;

		if (responseData.meta && responseData.meta.to < responseData.meta.total) {
			await sleep(500);
		}
	} while (
		responseData.meta &&
		responseData.meta.to < responseData.meta.total
	);

	return returnData;
}

export function sleep(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function buildFilterQuery(filters: IDataObject): IDataObject {
	const query: IDataObject = {};

	for (const [key, value] of Object.entries(filters)) {
		if (value !== undefined && value !== '' && value !== null) {
			if (key.startsWith('filter[')) {
				query[key] = value;
			} else if (key === 'sort' || key === 'per_page' || key === 'page') {
				query[key] = value;
			} else {
				query[`filter[${key}]`] = value;
			}
		}
	}

	return query;
}
