import { INodeProperties } from 'n8n-workflow';

export const gameboostOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		options: [
			{
				name: 'Get All Accounts',
				value: 'getAllAccounts',
				description: 'Get all accounts from GameBoost',
				action: 'Get all accounts',
			},
			{
				name: 'Get Account by ID',
				value: 'getAccountById',
				description: 'Get a specific account by ID',
				action: 'Get a specific account by ID',
			},
			{
				name: 'Create Account',
				value: 'createAccount',
				description: 'Create a new account on GameBoost',
				action: 'Create a new account on game boost',
			},
			{
				name: 'Delete Account',
				value: 'deleteAccount',
				description: 'Delete an account from GameBoost',
				action: 'Delete an account from game boost',
			},
			{
				name: 'Bulk Update Account Status',
				value: 'bulkUpdateAccountStatus',
				description: 'Update the status of multiple accounts',
				action: 'Update the status of multiple accounts',
			},
		],
		default: 'getAllAccounts',
		noDataExpression: true,
	},
];
