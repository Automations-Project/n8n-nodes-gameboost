import type { INodeProperties } from 'n8n-workflow';
import {
	accountOfferStatusOptions,
	accountOfferSortOptions,
	gameSortOptions,
	deliveryTimeUnitOptions,
} from './operators';

// =============================================================================
// ACCOUNT OFFER FIELDS
// =============================================================================

/**
 * Fields for Get Account Offer operation
 */
export const accountOfferGetFields: INodeProperties[] = [
	{
		displayName: 'Account Offer ID',
		name: 'accountOfferId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['get', 'delete', 'list', 'unlist', 'duplicate'],
			},
		},
		description: 'The ID of the account offer',
	},
];

/**
 * Fields for Get Template operation
 */
export const accountOfferTemplateFields: INodeProperties[] = [
	{
		displayName: 'Game Name or ID',
		name: 'gameSlug',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGames',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['getTemplate'],
			},
		},
		description: 'The game to get the account data template for. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

/**
 * Fields for Get Many Account Offers operation
 */
export const accountOfferGetManyFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		default: 50,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['getMany'],
				returnAll: [false],
			},
		},
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Game Name or ID',
				name: 'game_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getGames',
				},
				default: '',
				description: 'Filter by game. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by ID, title, or description',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: accountOfferSortOptions,
				default: '-updated_at',
				description: 'Sort order for results',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					...accountOfferStatusOptions,
				],
				default: '',
				description: 'Filter by status',
			},
		],
	},
];

/**
 * Fields for Create Account Offer operation
 */
export const accountOfferCreateFields: INodeProperties[] = [
	{
		displayName: 'Game Name or ID',
		name: 'game',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGames',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'The game for this account offer. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'Display title for the account offer',
		placeholder: 'e.g., Premium Account with Full Access',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'Detailed description of the account and its features',
	},
	{
		displayName: 'Price (EUR)',
		name: 'price',
		type: 'number',
		typeOptions: {
			minValue: 0.99,
			numberPrecision: 2,
		},
		required: true,
		default: 9.99,
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'Account price in EUR currency (minimum 0.99)',
	},
	{
		displayName: 'Image URLs',
		name: 'imageUrls',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'Comma-separated list of image URLs showcasing the account (Imgur not supported)',
		placeholder: 'https://example.com/image1.jpg, https://example.com/image2.jpg',
	},
	{
		displayName: 'Manual Delivery',
		name: 'isManual',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'Whether the account requires manual delivery by seller. If true, you must specify delivery time. If false, you must provide account credentials.',
	},
	// Delivery time fields (required for manual delivery)
	{
		displayName: 'Delivery Time',
		name: 'deliveryTime',
		type: 'fixedCollection',
		default: {},
		placeholder: 'Add Delivery Time',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [true],
			},
		},
		options: [
			{
				name: 'values',
				displayName: 'Delivery Time',
				values: [
					{
						displayName: 'Duration',
						name: 'duration',
						type: 'number',
						default: 10,
						description: 'Expected delivery time value',
					},
					{
						displayName: 'Unit',
						name: 'unit',
						type: 'options',
						options: deliveryTimeUnitOptions,
						default: 'minutes',
						description: 'Time unit for delivery',
					},
				],
			},
		],
		description: 'Expected delivery time (required for manual delivery)',
	},
	// Credentials (required for non-manual delivery)
	{
		displayName: 'Login',
		name: 'login',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [false],
			},
		},
		description: 'Account login username',
	},
	{
		displayName: 'Password',
		name: 'password',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [false],
			},
		},
		description: 'Account password',
	},
	{
		displayName: 'Email Login',
		name: 'emailLogin',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [false],
			},
		},
		description: 'Email address associated with the account',
	},
	{
		displayName: 'Email Password',
		name: 'emailPassword',
		type: 'string',
		typeOptions: { password: true },
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [false],
			},
		},
		description: 'Password for the associated email account',
	},
	{
		displayName: 'Email Provider',
		name: 'emailProvider',
		type: 'string',
		default: '',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				isManual: [false],
			},
		},
		description: 'Email service provider domain (e.g., gmail.com, proton.me)',
		placeholder: 'gmail.com',
	},
	// Account Data Input Mode
	{
		displayName: 'Account Data Input',
		name: 'accountDataMode',
		type: 'options',
		options: [
			{
				name: 'Manual JSON',
				value: 'json',
				description: 'Enter account data as JSON object',
			},
			{
				name: 'Field Builder',
				value: 'fields',
				description: 'Build account data using form fields',
			},
		],
		default: 'json',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		description: 'How to input game-specific account data',
	},
	{
		displayName: 'Account Data (JSON)',
		name: 'accountDataJson',
		type: 'json',
		default: '{}',
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				accountDataMode: ['json'],
			},
		},
		description: 'Game-specific account attributes as JSON (e.g., level, rank, items)',
	},
	{
		displayName: 'Account Data Fields',
		name: 'accountDataFields',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
				accountDataMode: ['fields'],
			},
		},
		options: [
			{
				name: 'field',
				displayName: 'Field',
				values: [
					{
						displayName: 'Field Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the account data field',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value for the field',
					},
				],
			},
		],
		description: 'Game-specific account data fields',
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['accountOffer'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Delivery Instructions',
				name: 'deliveryInstructions',
				type: 'string',
				typeOptions: {
					rows: 3,
				},
				default: '',
				description: 'Special instructions for account delivery (shown to buyer after purchase)',
			},
			{
				displayName: 'Dump',
				name: 'dump',
				type: 'string',
				default: '',
				description: 'Searchable metadata including keywords, tags, and categorization terms',
			},
			{
				displayName: 'Private Note',
				name: 'privateNote',
				type: 'string',
				default: '',
				description: 'Private note only visible to you',
			},
			{
				displayName: 'Slug',
				name: 'slug',
				type: 'string',
				default: '',
				description: 'Custom URL-friendly identifier (auto-generated if not provided)',
			},
		],
	},
];

// =============================================================================
// GAME FIELDS
// =============================================================================

/**
 * Fields for Get Game operation
 */
export const gameGetFields: INodeProperties[] = [
	{
		displayName: 'Game Name or ID',
		name: 'gameSlug',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getGames',
		},
		required: true,
		default: '',
		displayOptions: {
			show: {
				resource: ['game'],
				operation: ['get'],
			},
		},
		description: 'The game to retrieve. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
];

/**
 * Fields for Get Many Games operation
 */
export const gameGetManyFields: INodeProperties[] = [
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		default: true,
		displayOptions: {
			show: {
				resource: ['game'],
				operation: ['getMany'],
			},
		},
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['game'],
				operation: ['getMany'],
			},
		},
		options: [
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by ID, name, slug, or acronym',
			},
			{
				displayName: 'Sort',
				name: 'sort',
				type: 'options',
				options: gameSortOptions,
				default: 'name',
				description: 'Sort order for results',
			},
		],
	},
];
