import type { INodeProperties } from 'n8n-workflow';

/**
 * GameBoost API v2 Operations
 * Defines all available operations for the node
 */
export const operations: INodeProperties[] = [
	{
		displayName: 'Resource',
		name: 'resource',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Account Offer',
				value: 'accountOffer',
				description: 'Manage account offers for sale',
			},
			{
				name: 'Game',
				value: 'game',
				description: 'Get game information',
			},
		],
		default: 'accountOffer',
	},
	// Account Offer Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accountOffer'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new account offer',
				action: 'Create an account offer',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete an account offer',
				action: 'Delete an account offer',
			},
			{
				name: 'Duplicate',
				value: 'duplicate',
				description: 'Duplicate an existing account offer',
				action: 'Duplicate an account offer',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific account offer',
				action: 'Get an account offer',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many account offers',
				action: 'Get many account offers',
			},
			{
				name: 'Get Template',
				value: 'getTemplate',
				description: 'Get account data template/schema for a game',
				action: 'Get account offer template',
			},
			{
				name: 'List (Publish)',
				value: 'list',
				description: 'Publish an account offer (change status to listed)',
				action: 'List an account offer',
			},
			{
				name: 'Unlist (Draft)',
				value: 'unlist',
				description: 'Unlist an account offer (change status to draft)',
				action: 'Unlist an account offer',
			},
		],
		default: 'getMany',
	},
	// Game Operations
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['game'],
			},
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific game',
				action: 'Get a game',
			},
			{
				name: 'Get Many',
				value: 'getMany',
				description: 'Get many games',
				action: 'Get many games',
			},
		],
		default: 'getMany',
	},
];

/**
 * Account offer status options used across multiple fields
 */
export const accountOfferStatusOptions = [
	{ name: 'Draft', value: 'draft' },
	{ name: 'Pending', value: 'pending' },
	{ name: 'Listed', value: 'listed' },
	{ name: 'Processing', value: 'processing' },
	{ name: 'Sold', value: 'sold' },
	{ name: 'Refunded', value: 'refunded' },
	{ name: 'Archived', value: 'archived' },
];

/**
 * Sort options for account offers
 */
export const accountOfferSortOptions = [
	{ name: 'ID (Ascending)', value: 'id' },
	{ name: 'ID (Descending)', value: '-id' },
	{ name: 'Price (Ascending)', value: 'price' },
	{ name: 'Price (Descending)', value: '-price' },
	{ name: 'Views (Ascending)', value: 'views' },
	{ name: 'Views (Descending)', value: '-views' },
	{ name: 'Delivery Time (Ascending)', value: 'delivery_time' },
	{ name: 'Delivery Time (Descending)', value: '-delivery_time' },
	{ name: 'Created At (Ascending)', value: 'created_at' },
	{ name: 'Created At (Descending)', value: '-created_at' },
	{ name: 'Updated At (Ascending)', value: 'updated_at' },
	{ name: 'Updated At (Descending)', value: '-updated_at' },
	{ name: 'Listed At (Ascending)', value: 'listed_at' },
	{ name: 'Listed At (Descending)', value: '-listed_at' },
];

/**
 * Sort options for games
 */
export const gameSortOptions = [
	{ name: 'Name (Ascending)', value: 'name' },
	{ name: 'Name (Descending)', value: '-name' },
	{ name: 'ID (Ascending)', value: 'id' },
	{ name: 'ID (Descending)', value: '-id' },
	{ name: 'Slug (Ascending)', value: 'slug' },
	{ name: 'Slug (Descending)', value: '-slug' },
];

/**
 * Delivery time unit options
 */
export const deliveryTimeUnitOptions = [
	{ name: 'Minutes', value: 'minutes' },
	{ name: 'Hours', value: 'hours' },
	{ name: 'Days', value: 'days' },
];
