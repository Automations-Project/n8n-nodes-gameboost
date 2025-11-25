import type {
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';

import { execute } from './execute';
import { operations } from './operators';
import {
	accountOfferGetFields,
	accountOfferTemplateFields,
	accountOfferGetManyFields,
	accountOfferCreateFields,
	gameGetFields,
	gameGetManyFields,
} from './fields';
import { getGames, getAccountOffers } from './methods';

export class GameBoost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GameBoost',
		name: 'gameBoost',
		icon: 'file:gameboostIcon.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with GameBoost API v2',
		defaults: {
			name: 'GameBoost',
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
			// Notice with links
			{
				displayName: 'Join the conversation on the <a href="https://discord.com/invite/gameboost" target="_blank">official GameBoost Discord</a> or the <a href="https://discord.gg/YcV2hT87" target="_blank">Nskha Discord</a>',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			// Operations
			...operations,
			// Account Offer Fields
			...accountOfferGetFields,
			...accountOfferTemplateFields,
			...accountOfferGetManyFields,
			...accountOfferCreateFields,
			// Game Fields
			...gameGetFields,
			...gameGetManyFields,
		],
	};

	methods = {
		loadOptions: {
			getGames,
			getAccountOffers,
		},
	};

	execute = execute;
}
