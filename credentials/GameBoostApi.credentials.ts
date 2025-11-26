import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class GameBoostApi implements ICredentialType {
	name = 'gameboostApi';

	displayName = 'GameBoost API';

	icon = 'file:gameboostIcon.svg' as const;

	// eslint-disable-next-line n8n-nodes-base/cred-class-field-documentation-url-miscased
	documentationUrl = 'https://docs.gameboost.com/v2/api-reference';

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
			description: 'Your GameBoost API token. Get it from your <a href="https://gameboost.com/settings/api" target="_blank">API Settings</a>.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiToken}}',
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.gameboost.com',
			url: '/v2/games',
			method: 'GET',
		},
	};
}
