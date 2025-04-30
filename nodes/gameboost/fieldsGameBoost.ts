/* eslint-disable n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options */
import { INodeProperties } from 'n8n-workflow';

export const publicFields: INodeProperties[] = [
	{
		displayName: 'Account Login or ID',
		name: 'accountId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getAllAccountsID',
		},
		displayOptions: {
			show: {
				operation: ['deleteAccount', 'getAccountById'],
			},
		},
		default: '',
		description: 'The ID of the account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Game Name or ID',
		name: 'gameslug',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getGameSlugs',
		},
		displayOptions: {
			show: {
				operation: ['bulkUpdateAccountStatus', 'getAllAccounts'],
				AllGames: [false],
			},
		},
		default: '',
		description: 'The Game name on the platform, Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'Game Name or ID',
		name: 'gameNameSchema',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getGameSlugs',
		},
		displayOptions: {
			show: {
				operation: ['getGameSchema', 'createAccount'],
			},
		},
		default: '',
		description: 'The Game name on the platform, Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

export const createAccountFields: INodeProperties[] = [
	// Not Needed because we get the gameslug from the gameslug parameter
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		default: '',
		description: 'The title of the account',
		placeholder: 'New Rust Accounts [Steam] 🚫 Zero Hours 🔑 Full Access 🚀 Instant Delivery',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Slug',
		name: 'slug',
		type: 'string',
		default: '',
		description: 'A URL-friendly identifier',
		placeholder: 'rust-account-with-full-access',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Price [Euro]',
		name: 'price',
		type: 'number',
		default: 39.99,
		description: 'The price of the account in Euros Only',
		placeholder: '100',
		required: true,
		typeOptions: {
			minValue: 1,
			maxValue: 9999,
			numberStepSize: 2,
			numberPrecision: 2,
		},
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'IGN',
		name: 'ign',
		type: 'string',
		default: '',
		description: 'In-game name',
		placeholder: 'Miracle-A',
		// eslint-disable-next-line n8n-nodes-base/node-param-required-false
		required: false,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Login',
		name: 'login',
		type: 'string',
		default: '',
		description: 'The login username',
		placeholder: 'Miracle-A-2001',
		// eslint-disable-next-line n8n-nodes-base/node-param-required-false
		required: false,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'The account password',
		placeholder: 'D93jADms@12okasCAwwqw',
		// eslint-disable-next-line n8n-nodes-base/node-param-required-false
		required: false,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Email Login',
		name: 'email_login',
		type: 'string',
		default: '',
		description: 'The email used to log in',
		placeholder: 'etc@gmail.com',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Email Password',
		name: 'email_password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		description: 'The password for the email',
		placeholder: 'D93jADms@12okasCAwwqw',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Is Manual',
		name: 'is_manual',
		type: 'boolean',
		default: false,
		description: 'Whether the delivery is manual',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Delivery Time in Minutes',
		name: 'delivery_time',
		type: 'number',
		default: 0,
		placeholder: '10',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Has 2FA',
		name: 'has_2fa',
		type: 'boolean',
		default: false,
		description: 'Whether the account has 2FA',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
				is_manual: [false],
			},
		},
	},
	{
		displayName: 'Server',
		name: 'server',
		type: 'options',
		default: 'Global',
		description: 'The server the account is on',
		placeholder: 'Global',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
		options: [
			{
				name: 'Europe',
				value: 'Europe',
			},
			{
				name: 'Europe Nordic & East',
				value: 'Europe Nordic & East',
			},
			{
				name: 'Europe West',
				value: 'Europe West',
			},
			{
				name: 'Africa',
				value: 'Africa',
			},
			{
				name: 'America',
				value: 'America',
			},
			{
				name: 'Asia',
				value: 'Asia',
			},
			{
				name: 'Asia Pacific',
				value: 'Asia Pacific',
			},
			{
				name: 'Bangladesh',
				value: 'Bangladesh',
			},
			{
				name: 'Brazil',
				value: 'Brazil',
			},
			{
				name: 'China',
				value: 'China',
			},
			{
				name: 'Garena SEA',
				value: 'Garena SEA',
			},
			{
				name: 'Global',
				value: 'Global',
			},
			{
				name: 'India',
				value: 'India',
			},
			{
				name: 'Indonesia',
				value: 'Indonesia',
			},
			{
				name: 'Japan',
				value: 'Japan',
			},
			{
				name: 'Korea',
				value: 'Korea',
			},
			{
				name: 'Latin America',
				value: 'Latin America',
			},
			{
				name: 'Latin America North',
				value: 'Latin America North',
			},
			{
				name: 'Latin America South',
				value: 'Latin America South',
			},
			{
				name: 'Malaysia',
				value: 'Malaysia',
			},
			{
				name: 'Mexico',
				value: 'Mexico',
			},
			{
				name: 'Middle East',
				value: 'Middle East',
			},
			{
				name: 'Middle East & North Africa',
				value: 'Middle East & North Africa',
			},
			{
				name: 'North America',
				value: 'North America',
			},
			{
				name: 'North America United States',
				value: 'North America United States',
			},
			{
				name: 'Oceania',
				value: 'Oceania',
			},
			{
				name: 'Pakistan',
				value: 'Pakistan',
			},
			{
				name: 'Philippines',
				value: 'Philippines',
			},
			{
				name: 'Public Beta Environment',
				value: 'Public Beta Environment',
			},
			{
				name: 'Russia',
				value: 'Russia',
			},
			{
				name: 'Singapore',
				value: 'Singapore',
			},
			{
				name: 'South America',
				value: 'South America',
			},
			{
				name: 'South East Asia',
				value: 'South East Asia',
			},
			{
				name: 'Taiwan/HK/MO',
				value: 'Taiwan/HK/MO',
			},
			{
				name: 'Thailand',
				value: 'Thailand',
			},
			{
				name: 'Turkey',
				value: 'Turkey',
			},
			{
				name: 'Vietnam',
				value: 'Vietnam',
			},
		],
	},
	{
		displayName: 'Level Up Method',
		name: 'level_up_method',
		type: 'options',
		default: 'by_hand',
		description: 'The method used to level up',
		placeholder: 'By Hand',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
		options: [
			{ name: 'By Hand', value: 'by_hand', description: 'The account is manually leveled up' },
			{ name: 'By Bot', value: 'by_bot', description: 'The account is leveled up by a bot' },
		],
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		default: '',
		description: 'A description of the account',
		placeholder: 'New Rust Accounts [Steam] 🚫 Zero Hours 🔑 Full Access 🚀 Instant Delivery',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Dump',
		name: 'dump',
		type: 'string',
		default: '',
		description: 'Any additional dump data',
		placeholder: 'Fresh Rust Account with Full Access',
		// eslint-disable-next-line n8n-nodes-base/node-param-required-false
		required: false,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Delivery Instructions',
		name: 'delivery_instructions',
		type: 'string',
		default: '',
		description: 'Instructions for delivery',
		placeholder: 'The code will be provided instantly if I am online.',
		required: true,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Image URLs',
		name: 'image_urls',
		type: 'string',
		default: '',
		description: 'Enter image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)',
		noDataExpression: false,
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Manual In-Game-Data (JSON Payload)',
		name: 'manualPayload',
		type: 'boolean',
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Enter the In-Game-Data manually',
		displayOptions: {
			show: {
				operation: ['createAccount'],
			},
		},
	},
	{
		displayName: 'Account In-Game Data',
		name: 'accountData',
		type: 'json',
		default: '',
		description: 'Enter the account data manually',
		displayOptions: {
			show: {
				operation: ['createAccount'],
				manualPayload: [true],
			},
		},
	},
	{
		displayName: 'Account In-Game Data Field',
		name: 'accountDataField',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				operation: ['createAccount'],
				manualPayload: [false],
			},
		},
		default: {},
		options: [
			{
				name: 'fields',
				displayName: 'Fields',
				values: [
					{
						// eslint-disable-next-line n8n-nodes-base/node-param-display-name-wrong-for-dynamic-options
						displayName: 'Field Name',
						name: 'field',
						type: 'options',
						description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
						typeOptions: {
							loadOptionsMethod: 'getAccountDataFields',
							loadOptionsDependsOn: ['gameslug'],
						},
						default: '',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Enter value according to field requirements',
					},
				],
			},
		],
		description: 'Select fields from the account_data schema and their values',
	},
];

export const getAllAccountsFields: INodeProperties[] = [
	{
		displayName: '⚠️ Notice: Enabling "Get All Accounts" may take some time as the data retrieval process uses pagination to fetch all records efficiently.',
		name: 'warningGettingData',
		type: 'notice',
		default: '',
		displayOptions: {
			show: {
				operation: ['getAllAccounts'],
				AllGames: [true],
			},
		},
	},
	{
		displayName: 'All Games',
		name: 'AllGames',
		type: 'boolean',
		default: false,
		description: 'Whether to get all games',
		displayOptions: {
			show: {
				operation: ['getAllAccounts'],
			},
		},
	},
	{
		displayName: 'Get All Accounts',
		name: 'getAllPages',
		type: 'boolean',
		default: false,
		description: 'Whether to get all accounts or just the first 10 accounts',
		displayOptions: {
			show: {
				operation: ['getAllAccounts'],
			},
		},
	},
	{
		displayName: 'With Account In-Game Data',
		name: 'getAllData',
		type: 'boolean',
		default: false,
		// eslint-disable-next-line n8n-nodes-base/node-param-description-boolean-without-whether
		description: 'Game Data Like Skins/Gems/achievements/Levels etc',
		displayOptions: {
			show: {
				operation: ['getAllAccounts'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'accountStatus',
		type: 'options',
		default: '',
		options: [
			{ name: 'All', value: '' },
			{ name: 'Draft', value: 'Draft' },
			{ name: 'Listed', value: 'Listed' },
			{ name: 'Pending', value: 'Pending' },
			{ name: 'Processing', value: 'Processing' },
			{ name: 'Refunded', value: 'Refunded' },
			{ name: 'Sold', value: 'Sold' },
		],

		description: 'Whether to include all account data in the response',
		displayOptions: {
			show: {
				operation: ['getAllAccounts'],
			},
		},
	},
];

export const bulkUpdateAccountStatusFields: INodeProperties[] = [
	{
		displayName: 'Target Game Name or ID',
		name: 'targetGame',
		type: 'options',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'getGameSlugs',
		},
		displayOptions: {
			show: {
				operation: ['bulkUpdateAccountStatus'],
			},
		},
		default: '',
		description: 'The Game name on the platform, Choose from the list. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},

	{
		displayName: 'From',
		name: 'from',
		type: 'options',
		default: 'Draft',
		description: 'The page number to start from',
		options: [
			{ name: 'Draft', value: 'Draft' },
			{ name: 'Listed', value: 'Listed' },
		],
		displayOptions: {
			show: {
				operation: ['bulkUpdateAccountStatus'],
			},
		},
	},
	{
		displayName: 'To',
		name: 'to',
		type: 'options',
		default: 'Listed',
		description: 'The page number to end at',
		options: [
			{ name: 'Draft', value: 'Draft' },
			{ name: 'Listed', value: 'Listed' },
		],
		displayOptions: {
			show: {
				operation: ['bulkUpdateAccountStatus'],
			},
		},
	},
];

export const updateAccountStatusFields: INodeProperties[] = [
	{
		displayName: 'Target Account',
		name: 'targetAccount',
		type: 'string',
		description: 'The Account ID to update',
		default: '',
		required: true,
		displayOptions: {
			show: {
				operation: ['updateAccountStatus'],
			},
		},
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		default: 'draft',
		description: 'The status of the account',
		placeholder: 'draft',
		options: [
			{ name: 'Draft', value: 'draft' },
			{ name: 'Listed', value: 'listed' },
		],
		displayOptions: {
			show: {
				operation: ['updateAccountStatus'],
			},
		},
		required: true,
	},
];
