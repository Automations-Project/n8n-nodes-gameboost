import { IAuthenticateGeneric, ICredentialType, INodeProperties, ICredentialTestRequest } from 'n8n-workflow';

export class GameBoostApi implements ICredentialType {
	name = 'gameboostApi';
	displayName = 'Game Boost API';
	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
	documentationUrl = 'https://docs.gameboost.com/api-reference';

	properties: INodeProperties[] = [
		{
			displayName: 'API Token',
			name: 'apiToken',
			type: 'string',
			required: true,
			typeOptions: {
				password: true,
			},
			default: '',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gameboost.com',
			url: '/v1/accounts',
			method: 'GET',
		},
	};
}
