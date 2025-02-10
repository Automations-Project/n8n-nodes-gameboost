import { IDataObject, IExecuteFunctions, INodeExecutionData, INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';
import { bulkUpdateAccountStatusFields, createAccountFields, getAllAccountsFields, publicFields, updateAccountStatusFields } from './fieldsGameBoost';
import { getGameSlugs, getAccountDataFields, getAllAccountsID } from './operatorMethods';
import { gameboostOperations } from './operatorsGameBoost';
import { executeGameboost } from './executeGameboost';

export class GameBoost implements INodeType {
	public async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const operation = this.getNodeParameter('operation', 0) as string;
		const responseData = await executeGameboost.call(this, operation);
		// console.log('Debug - Response Data:', responseData);
		if (Array.isArray(responseData) && responseData.length > 0 && responseData[0].hasOwnProperty('json')) {
			return [responseData as INodeExecutionData[]];
		}
		return [[{ json: responseData as unknown as IDataObject }]];
	}
	description: INodeTypeDescription = {
		displayName: 'Game Boost',
		name: 'gameBoost',
		icon: 'file:gameboostIcon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Get data from Game Boost API',
		defaults: {
			name: 'Game Boost',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],

		credentials: [
			{
				name: 'gameboostApi',
				required: true,
			},
		],
		properties: [
			{
				displayName:
					'<div hidden>🌟 Join the devs conversation on the <a href="https://discord.com/invite/gameboost" target="_blank">official GameBoost Discord Server</a>, or explore discussions on the unofficial <a href="https://discord.gg/YcV2hT87" target="_blank">Nskha Discord server</a>. 🚀</div>',
				name: 'tip',
				type: 'notice',
				default: '',
			},
			...gameboostOperations,
			...bulkUpdateAccountStatusFields,
			...publicFields,
			...createAccountFields,
			...getAllAccountsFields,
			...updateAccountStatusFields,
		],
	};

	methods = {
		loadOptions: {
			getGameSlugs,
			getAccountDataFields,
			getAllAccountsID,
		},
	};
}
