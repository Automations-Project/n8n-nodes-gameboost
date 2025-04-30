import { ILoadOptionsFunctions, INodePropertyOptions, NodeApiError } from 'n8n-workflow';

import { IExecuteFunctions } from 'n8n-workflow';
import { genericHttpRequest, GameBoostResponse, FieldConfig, sleep } from './GenericFunctions';

//Handle Execute Functions
export async function handleGetAllAccounts(this: IExecuteFunctions) {
	let gameslug = '';
	const getAllPages = this.getNodeParameter('getAllPages', 0) as boolean;
	const getAllData = this.getNodeParameter('getAllData', 0) as boolean;
	const accountStatus = this.getNodeParameter('accountStatus', 0) as string;
	const AllGames = this.getNodeParameter('AllGames', 0) as boolean;
	if (!AllGames) {
		gameslug = this.getNodeParameter('gameslug', 0) as string;
	}

	// console.log('Starting pagination process with parameters:', {
	// 	getAllPages,
	// 	getAllData,
	// 	accountStatus,
	// 	gameslug,
	// 	AllGames,
	// });

	let allAccounts: any[] = [];
	let currentPage = 1;
	let total = 0;
	let to = 0;

	do {
		// console.log(`Fetching page ${currentPage}...`);
		const response = (await genericHttpRequest.call(this, 'GET', '/accounts', {
			params: {
				with_data: getAllData ? '1' : '0',
				per_page: getAllPages ? '100' : '10',
				page: currentPage.toString(),
			},
		})) as GameBoostResponse;

		const accounts = response.data || [];
		total = response.meta?.total || 0;
		to = response.meta?.to || 0;

		// console.log('Page stats:', {
		// 	currentPage,
		// 	recordsInPage: accounts.length,
		// 	to,
		// 	total,
		// 	remainingRecords: total - to,
		// });

		allAccounts = [...allAccounts, ...accounts];
		currentPage++;
		await sleep(3000);
	} while (to < total && getAllPages);

	// console.log('Pagination complete:', {
	// 	totalPagesProcessed: currentPage - 1,
	// 	totalRecordsCollected: allAccounts.length,
	// });

	const filteredAccounts = allAccounts
		.filter((account) => {
			const matchesGameslug = !gameslug || account.attributes.game_slug === gameslug;
			const matchesStatus = !accountStatus || account.attributes.status === accountStatus;
			return matchesGameslug && matchesStatus;
		})
		.map((account) => ({
			json: {
				...account.attributes,
				id: account.id,
				type: account.type,
			},
		}));

	// console.log('Filtering complete:', {
	// 	totalRecordsAfterFilter: filteredAccounts.length,
	// 	appliedFilters: {
	// 		gameslug: gameslug || 'none',
	// 		accountStatus: accountStatus || 'none',
	// 	},
	// });

	return filteredAccounts;
}

export async function handleCreateAccount(this: IExecuteFunctions) {
	// Get all required fields from node parameters
	const title = this.getNodeParameter('title', 0) as string;
	const slug = this.getNodeParameter('slug', 0) as string;
	const gameslug = this.getNodeParameter('gameNameSchema', 0) as string;
	const isManual = this.getNodeParameter('is_manual', 0) as boolean;
	const deliveryTime = this.getNodeParameter('delivery_time', 0) as number;
	const server = this.getNodeParameter('server', 0) as string;
	const levelUpMethod = this.getNodeParameter('level_up_method', 0) as string;
	const description = this.getNodeParameter('description', 0) as string;
	const dump = this.getNodeParameter('dump', 0) as string;
	const deliveryInstructions = this.getNodeParameter('delivery_instructions', 0) as string;
	const imageUrls = this.getNodeParameter('image_urls', 0) as string;
	let price = this.getNodeParameter('price', 0) as number;
	const manualPayload = this.getNodeParameter('manualPayload', 0, false) as boolean;
	const accountDataManually = this.getNodeParameter('accountData', 0, false) as boolean;
	const accountDataFields = this.getNodeParameter('accountDataField.fields', 0, []) as Array<{
		field: string;
		value: string;
	}>;
	let ign = '',
		login = '',
		has_2fa = false,
		password = '',
		email_login = '',
		email_password = '';
	// Get optional fields that are only required when is_manual is true

	if (!isManual) {
		ign = this.getNodeParameter('ign', 0) as string;
		login = this.getNodeParameter('login', 0) as string;
		has_2fa = this.getNodeParameter('has_2fa', 0) as boolean;
		password = this.getNodeParameter('password', 0) as string;
		email_login = this.getNodeParameter('email_login', 0) as string;
		email_password = this.getNodeParameter('email_password', 0) as string;
	}

	// Process account data with expression resolution
	let accountData: { [key: string]: any } = {};
	if (!manualPayload) {
		const accountData: { [key: string]: any } = {};
		for (const field of accountDataFields) {
			if (!field.field || !field.value) continue;
			// Keep original value, only try to resolve expressions
			let resolvedValue = field.value;
			try {
				if (typeof field.value === 'string' && field.value.includes('{{')) {
					resolvedValue = this.evaluateExpression(field.value, 0) as string;
				}
			} catch (error) {
				const errorMessage = `Error resolving expression for ${field.field}: ${error}`;
				throw new NodeApiError(this.getNode(), { message: errorMessage });
			}

			accountData[field.field] = resolvedValue;
		}
	}
	// Price handling
	let fraction = price - Math.floor(price);
	if (fraction > 0.5) price = Math.floor(price) + 0.99;
	else price = Math.floor(price) - 0.01;

	const url = `/accounts`;
	const body = {
		game: gameslug,
		title,
		price,
		ign,
		login,
		has_2fa,
		password,
		slug,
		is_manual: isManual,
		email_login,
		email_password,
		delivery_time: {
			duration: deliveryTime,
			unit: 'minutes',
		},
		server,
		level_up_method: levelUpMethod,
		description,
		dump,
		delivery_instructions: deliveryInstructions,
		image_urls: imageUrls
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url),
		account_data: !manualPayload ? accountData : accountDataManually,
		game_items: {},
	};

	// Debug logging
	// console.log('Debug - Create Account Request:');
	// console.log('URL:', url);
	// console.log('Game Slug:', gameslug);
	// console.log('Request Body:', JSON.stringify(body, null, 2));
	// console.log('Raw Account Data Fields:', JSON.stringify(accountDataFields, null, 2));

	const response = await genericHttpRequest.call(this, 'POST', url, {
		body,
	});
	// console.log('Debug - Create Account Response:', JSON.stringify(response, null, 2));
	return response;
}

export async function handleGetGameSchema(this: IExecuteFunctions) {
	const gameslug = this.getNodeParameter('gameNameSchema', 0) as string;
	const url = `/accounts/template/${gameslug}`;
	const response = await genericHttpRequest.call(this, 'GET', url);
	return response;
}

export async function handleGetAccountById(this: IExecuteFunctions) {
	const accountId = this.getNodeParameter('accountId', 0) as string;

	// Check if accountId is a number
	if (!isNaN(Number(accountId))) {
		const url = `/accounts/${accountId}`;
		const response = await genericHttpRequest.call(this, 'GET', url);
		console.log(`accountId NUMBER: ${accountId}`);
		return response;
	} else {
		const response = await genericHttpRequest.call(this, 'GET', `/accounts/by-login/${accountId}`);
		console.log(`accountId STRING: ${accountId}`);
		return response;
	}
}

export async function handleDeleteAccount(this: IExecuteFunctions) {
	const accountId = this.getNodeParameter('accountId', 0) as string;
	const url = `/accounts/${accountId}`;
	const response = await genericHttpRequest.call(this, 'DELETE', url);
	return response;
}

export async function handleBulkUpdateAccountStatus(this: IExecuteFunctions) {
	const targetGame = this.getNodeParameter('targetGame', 0) as string;
	const from = this.getNodeParameter('from', 0) as string;
	const to = this.getNodeParameter('to', 0) as string;

	const allAccountsID = (await genericHttpRequest.call(this, 'GET', '/accounts', {
		params: {
			per_page: '1000',
		},
	})) as GameBoostResponse;

	const filteredAccounts = allAccountsID.data!.filter((account) => account.attributes.status === from && account.attributes.game_slug === targetGame).map((account) => account.id);

	// console.log('Request body:', {
	// 	accounts: [...filteredAccounts],
	// 	status: to,
	// });

	if (filteredAccounts.length === 0) {
		throw new NodeApiError(this.getNode(), { message: `No accounts found with status "${from}" for game "${targetGame}"` });
	}

	const response = await genericHttpRequest.call(this, 'PATCH', '/accounts/status/bulk', {
		body: {
			accounts: [...filteredAccounts],
			status: to.charAt(0).toLowerCase() + to.slice(1),
		},
	});
	return response;
}
//

export async function getAllAccountsID(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		const response = (await genericHttpRequest.call(this, 'GET', '/accounts', {
			params: {
				per_page: '200',
			},
		})) as GameBoostResponse;
		if (response) {
			// Map each ID to an option object
			const options = (response!.data || []).map((account: any) => ({
				name: String(`Account ID: ${account.id}`),
				value: String(account.id),
				description: String(account.attributes.title),
			}));
			return options;
		}

		return [];
	} catch (error) {
		console.error('Error fetching accountsId:', error);
		return [];
	}
}

export async function getGameSlugs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	try {
		// Remove the base URL since genericHttpRequest adds it
		//@ts-ignore
		const response = await this.helpers.httpRequest({
			method: 'GET',
			url: 'https://api.gameboost.com/v1/accounts/template/all',
			json: true,
		});
		return [];
	} catch (error: any) {
		// The games list is in the error response
		if (error.response?.data?.games) {
			const games = error.response.data.games;
			return Object.entries(games).map(([key, value]) => ({
				name: String(value),
				value: String(key),
			}));
		}

		// If no games found in error response, return empty array
		return [];
	}
}
export async function getAccountDataFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
	// Check what operation is being used to determine the correct parameter name
	const operation = this.getNodeParameter('operation') as string;
	let gameslug = '';

	try {
		if (operation === 'createAccount') {
			gameslug = this.getNodeParameter('gameNameSchema') as string;
		} else {
			gameslug = this.getNodeParameter('gameslug') as string;
		}

		if (!gameslug) return [];

		const response = (await genericHttpRequest.call(this, 'GET', `/accounts/template/${gameslug}`)) as GameBoostResponse;

		const accountData = response?.template?.account_data as Record<string, FieldConfig>;

		if (!accountData) return [];

		return Object.entries(accountData).flatMap(([key, config]) => {
			if (!config.condition) return [];

			const description = getConditionDescription(config);

			return [
				{
					name: key,
					value: key,
					description,
				},
			];
		});
	} catch (error) {
		console.error('Error fetching account data fields:', error);
		return [];
	}
}

function getConditionDescription(config: FieldConfig): string {
	switch (config.condition) {
		case 'boolean':
			return 'Boolean value (true/false)';
		case 'number':
			return `Minimum value: ${config.condition.split(':')[1]}`;
		case 'string':
			return `Allowed values: ${config.values?.join(', ')}`;
		default:
			return `Condition: ${config.condition}`;
	}
}

export async function HandleUpdateAccountStatus(this: IExecuteFunctions) {
	const targetAccount = this.getNodeParameter('targetAccount', 0) as string;
	const status = this.getNodeParameter('status', 0) as string;
	const response = await genericHttpRequest.call(this, 'PATCH', `/accounts/${targetAccount}/status`, { body: { status: status.charAt(0).toLowerCase() + status.slice(1) } });
	return response;
}
