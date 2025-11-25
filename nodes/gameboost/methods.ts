import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	IDataObject,
} from 'n8n-workflow';
import {
	gameBoostApiRequest,
	gameBoostApiRequestAllItems,
	buildFilterQuery,
	type GameBoostListResponse,
	type GameBoostSingleResponse,
	type GameBoostAccountOffer,
	type GameBoostGame,
} from './api';

export async function getGames(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		'/games',
	) as unknown as GameBoostListResponse<GameBoostGame>;

	if (!response.data) {
		return [];
	}

	return response.data.map((game) => ({
		name: game.name,
		value: game.slug,
		description: game.acronym ? `(${game.acronym})` : undefined,
	}));
}

export async function getAccountOffers(
	this: ILoadOptionsFunctions,
): Promise<INodePropertyOptions[]> {
	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		'/account-offers',
		undefined,
		{ per_page: 50 },
	) as unknown as GameBoostListResponse<GameBoostAccountOffer>;

	if (!response.data) {
		return [];
	}

	return response.data.map((offer) => ({
		name: `#${offer.id} - ${offer.title}`,
		value: offer.id.toString(),
		description: `${offer.game.name} | ${offer.status} | ${offer.price} EUR`,
	}));
}

export async function getAccountOffer(
	this: IExecuteFunctions,
	accountOfferId: string,
): Promise<GameBoostAccountOffer> {
	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		`/account-offers/${accountOfferId}`,
	) as unknown as GameBoostSingleResponse<GameBoostAccountOffer>;

	return response.data;
}

export async function getAccountOffers_Execute(
	this: IExecuteFunctions,
	returnAll: boolean,
	limit: number,
	filters: IDataObject,
): Promise<GameBoostAccountOffer[]> {
	const query = buildFilterQuery(filters);

	if (returnAll) {
		const offers = await gameBoostApiRequestAllItems.call(
			this,
			'GET',
			'/account-offers',
			undefined,
			query,
		);
		return offers as unknown as GameBoostAccountOffer[];
	}

	query.per_page = limit;
	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		'/account-offers',
		undefined,
		query,
	) as unknown as GameBoostListResponse<GameBoostAccountOffer>;

	return response.data || [];
}

export async function createAccountOffer(
	this: IExecuteFunctions,
	data: {
		game: string;
		title: string;
		description: string;
		price: number;
		imageUrls: string[];
		isManual: boolean;
		accountData: IDataObject;
		deliveryTime?: { duration: number; unit: string };
		login?: string;
		password?: string;
		emailLogin?: string;
		emailPassword?: string;
		emailProvider?: string;
		deliveryInstructions?: string;
		dump?: string;
		privateNote?: string;
		slug?: string;
	},
): Promise<GameBoostAccountOffer> {
	const body: IDataObject = {
		game: data.game,
		title: data.title,
		description: data.description,
		price: data.price,
		image_urls: data.imageUrls,
		is_manual: data.isManual,
		account_data: data.accountData,
	};

	if (data.isManual && data.deliveryTime) {
		body.delivery_time = data.deliveryTime;
	}

	if (!data.isManual) {
		if (data.login) body.login = data.login;
		if (data.password) body.password = data.password;
		if (data.emailLogin) body.email_login = data.emailLogin;
		if (data.emailPassword) body.email_password = data.emailPassword;
		if (data.emailProvider) body.email_provider = data.emailProvider;
	}

	if (data.deliveryInstructions) body.delivery_instructions = data.deliveryInstructions;
	if (data.dump) body.dump = data.dump;
	if (data.privateNote) body.private_note = data.privateNote;
	if (data.slug) body.slug = data.slug;

	const response = await gameBoostApiRequest.call(
		this,
		'POST',
		'/account-offers',
		body,
	) as unknown as GameBoostSingleResponse<GameBoostAccountOffer>;

	return response.data;
}

// Uses v1 endpoint as template is not available in v2
export async function getAccountOfferTemplate(
	this: IExecuteFunctions,
	gameSlug: string,
): Promise<IDataObject> {
	const credentials = await this.getCredentials('gameboostApi');
	const apiToken = credentials?.apiToken as string;

	const response = await this.helpers.httpRequest({
		method: 'GET',
		url: `https://api.gameboost.com/v1/accounts/template/${gameSlug}`,
		headers: {
			'Authorization': `Bearer ${apiToken}`,
			'Content-Type': 'application/json',
		},
		json: true,
	});

	return response as IDataObject;
}

export async function deleteAccountOffer(
	this: IExecuteFunctions,
	accountOfferId: string,
): Promise<IDataObject> {
	await gameBoostApiRequest.call(
		this,
		'DELETE',
		`/account-offers/${accountOfferId}`,
	);

	return { success: true, deleted: accountOfferId };
}

export async function listAccountOffer(
	this: IExecuteFunctions,
	accountOfferId: string,
): Promise<GameBoostAccountOffer> {
	const response = await gameBoostApiRequest.call(
		this,
		'POST',
		`/account-offers/${accountOfferId}/list`,
	) as unknown as GameBoostSingleResponse<GameBoostAccountOffer>;

	return response.data;
}

export async function unlistAccountOffer(
	this: IExecuteFunctions,
	accountOfferId: string,
): Promise<GameBoostAccountOffer> {
	const response = await gameBoostApiRequest.call(
		this,
		'POST',
		`/account-offers/${accountOfferId}/draft`,
	) as unknown as GameBoostSingleResponse<GameBoostAccountOffer>;

	return response.data;
}

export async function duplicateAccountOffer(
	this: IExecuteFunctions,
	accountOfferId: string,
): Promise<GameBoostAccountOffer> {
	const response = await gameBoostApiRequest.call(
		this,
		'POST',
		`/account-offers/${accountOfferId}/duplicate`,
	) as unknown as GameBoostSingleResponse<GameBoostAccountOffer>;

	return response.data;
}

export async function getGame(
	this: IExecuteFunctions,
	gameSlug: string,
): Promise<GameBoostGame> {
	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		`/games/${gameSlug}`,
	) as unknown as GameBoostSingleResponse<GameBoostGame>;

	return response.data;
}

export async function getGamesExecute(
	this: IExecuteFunctions,
	returnAll: boolean,
	filters: IDataObject,
): Promise<GameBoostGame[]> {
	const query = buildFilterQuery(filters);

	const response = await gameBoostApiRequest.call(
		this,
		'GET',
		'/games',
		undefined,
		query,
	) as unknown as GameBoostListResponse<GameBoostGame>;

	return response.data || [];
}
