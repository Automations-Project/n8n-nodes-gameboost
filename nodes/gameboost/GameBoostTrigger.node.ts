import type {
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
	IDataObject,
} from 'n8n-workflow';
import { NodeConnectionType } from 'n8n-workflow';
import * as crypto from 'crypto';

export class GameBoostTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'GameBoost Trigger',
		name: 'gameBoostTrigger',
		icon: 'file:gameboostIcon.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Handle GameBoost webhook events',
		defaults: {
			name: 'GameBoost Trigger',
		},
		inputs: [],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'gameboostApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'account.order.purchased',
				options: [
					{
						name: 'Account Order Purchased',
						value: 'account.order.purchased',
						description: 'Triggered when a customer purchases an account',
					},
				],
				description: 'The event to listen for',
			},
			{
				displayName: 'Verify Signature',
				name: 'verifySignature',
				type: 'boolean',
				default: true,
				description: 'Whether to verify the webhook signature using your API token. Recommended for security.',
			},
		],
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const body = this.getBodyData() as IDataObject;
		const headers = this.getHeaderData() as IDataObject;
		const verifySignature = this.getNodeParameter('verifySignature', true) as boolean;
		const expectedEvent = this.getNodeParameter('event') as string;

		const userAgent = headers['user-agent'] as string;
		if (!userAgent || !userAgent.includes('GameBoost')) {
			return {
				webhookResponse: { status: 'error', message: 'Invalid User-Agent' },
			};
		}

		if (verifySignature) {
			const signature = headers['signature'] as string;
			if (!signature) {
				return {
					webhookResponse: { status: 'error', message: 'Missing signature header' },
				};
			}

			try {
				const credentials = await this.getCredentials('gameboostApi');
				const apiToken = credentials?.apiToken as string;

				const rawBody = JSON.stringify(body);
				const expectedSignature = crypto
					.createHmac('sha256', apiToken)
					.update(rawBody)
					.digest('hex');

				if (signature !== expectedSignature) {
					this.logger.warn('GameBoost webhook signature mismatch');
					return {
						webhookResponse: { status: 'error', message: 'Invalid signature' },
					};
				}
			} catch (error) {
				this.logger.error('Error verifying webhook signature', { error });
				return {
					webhookResponse: { status: 'error', message: 'Signature verification failed' },
				};
			}
		}

		const receivedEvent = body.event as string;
		if (receivedEvent !== expectedEvent) {
			this.logger.debug(`Ignoring event ${receivedEvent}, expected ${expectedEvent}`);
			return {
				webhookResponse: { status: 'ignored', message: `Event ${receivedEvent} not handled` },
			};
		}

		const payload = body.payload as IDataObject;

		return {
			webhookResponse: { status: 'success' },
			workflowData: [
				this.helpers.returnJsonArray({
					event: receivedEvent,
					...payload,
				}),
			],
		};
	}
}
