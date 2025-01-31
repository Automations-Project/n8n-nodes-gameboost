import { IExecuteFunctions } from 'n8n-workflow';
import { handleGetAccountById, handleGetAllAccounts, handleDeleteAccount, handleCreateAccount, handleBulkUpdateAccountStatus, handleGetGameSchema } from './operatorMethods';

export async function executeGameboost(this: IExecuteFunctions, operation: string) {
	switch (operation) {
		case 'getAllAccounts':
			return await handleGetAllAccounts.call(this);
		case 'getAccountById':
			return await handleGetAccountById.call(this);
		case 'getGameSchema':
			return await handleGetGameSchema.call(this);
		case 'deleteAccount':
			return await handleDeleteAccount.call(this);
		case 'createAccount':
			return await handleCreateAccount.call(this);
		case 'bulkUpdateAccountStatus':
			return await handleBulkUpdateAccountStatus.call(this);
		default:
			throw new Error(`Unsupported operation: ${operation}`);
	}
}
