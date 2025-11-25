import type {
	IExecuteFunctions,
	INodeExecutionData,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import {
	getAccountOffer,
	getAccountOffers_Execute,
	createAccountOffer,
	getAccountOfferTemplate,
	deleteAccountOffer,
	listAccountOffer,
	unlistAccountOffer,
	duplicateAccountOffer,
	getGame,
	getGamesExecute,
} from './methods';

export async function execute(
	this: IExecuteFunctions,
): Promise<INodeExecutionData[][]> {
	const items = this.getInputData();
	const returnData: INodeExecutionData[] = [];

	const resource = this.getNodeParameter('resource', 0) as string;
	const operation = this.getNodeParameter('operation', 0) as string;

	const logger = this.logger;

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject | IDataObject[];

			if (resource === 'accountOffer') {
				if (operation === 'get') {
					const accountOfferId = this.getNodeParameter('accountOfferId', i) as string;
					logger.debug(`Getting account offer: ${accountOfferId}`);

					responseData = await getAccountOffer.call(this, accountOfferId) as unknown as IDataObject;
				}

				else if (operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i) as boolean;
					const limit = this.getNodeParameter('limit', i, 50) as number;
					const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

					logger.debug(`Getting account offers with filters: ${JSON.stringify(filters)}`);

					const offers = await getAccountOffers_Execute.call(this, returnAll, limit, filters);
					responseData = offers as unknown as IDataObject[];
				}

				else if (operation === 'create') {
					const game = this.getNodeParameter('game', i) as string;
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const price = this.getNodeParameter('price', i) as number;
					const imageUrlsRaw = this.getNodeParameter('imageUrls', i) as string;
					const isManual = this.getNodeParameter('isManual', i) as boolean;
					const accountDataMode = this.getNodeParameter('accountDataMode', i) as string;

					const imageUrls = imageUrlsRaw
						.split(',')
						.map((url: string) => url.trim())
						.filter((url: string) => url.length > 0);

					let accountData: IDataObject = {};
					if (accountDataMode === 'json') {
						const jsonData = this.getNodeParameter('accountDataJson', i, '{}') as string;
						try {
							accountData = JSON.parse(jsonData);
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid JSON in Account Data field',
								{ itemIndex: i },
							);
						}
					} else {
						const fields = this.getNodeParameter('accountDataFields.field', i, []) as Array<{
							name: string;
							value: string;
						}>;
						for (const field of fields) {
							if (field.name && field.value !== undefined) {
								try {
									accountData[field.name] = JSON.parse(field.value);
								} catch {
									accountData[field.name] = field.value;
								}
							}
						}
					}

					const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

					const createData = {
						game,
						title,
						description,
						price,
						imageUrls,
						isManual,
						accountData,
						deliveryTime: undefined as { duration: number; unit: string } | undefined,
						login: undefined as string | undefined,
						password: undefined as string | undefined,
						emailLogin: undefined as string | undefined,
						emailPassword: undefined as string | undefined,
						emailProvider: undefined as string | undefined,
						deliveryInstructions: undefined as string | undefined,
						dump: undefined as string | undefined,
						privateNote: undefined as string | undefined,
						slug: undefined as string | undefined,
					};

					if (isManual) {
						const deliveryTimeData = this.getNodeParameter('deliveryTime.values', i, {}) as {
							duration?: number;
							unit?: string;
						};
						if (deliveryTimeData.duration && deliveryTimeData.unit) {
							createData.deliveryTime = {
								duration: deliveryTimeData.duration,
								unit: deliveryTimeData.unit,
							};
						}
					} else {
						createData.login = this.getNodeParameter('login', i, '') as string;
						createData.password = this.getNodeParameter('password', i, '') as string;
						createData.emailLogin = this.getNodeParameter('emailLogin', i, '') as string;
						createData.emailPassword = this.getNodeParameter('emailPassword', i, '') as string;
						createData.emailProvider = this.getNodeParameter('emailProvider', i, '') as string;
					}

					if (additionalOptions.deliveryInstructions) {
						createData.deliveryInstructions = additionalOptions.deliveryInstructions as string;
					}
					if (additionalOptions.dump) {
						createData.dump = additionalOptions.dump as string;
					}
					if (additionalOptions.privateNote) {
						createData.privateNote = additionalOptions.privateNote as string;
					}
					if (additionalOptions.slug) {
						createData.slug = additionalOptions.slug as string;
					}

					logger.debug(`Creating account offer for game: ${game}`);

					responseData = await createAccountOffer.call(this, createData) as unknown as IDataObject;
				}

				else if (operation === 'getTemplate') {
					const gameSlug = this.getNodeParameter('gameSlug', i) as string;
					logger.debug(`Getting account offer template for game: ${gameSlug}`);

					responseData = await getAccountOfferTemplate.call(this, gameSlug);
				}

				else if (operation === 'delete') {
					const accountOfferId = this.getNodeParameter('accountOfferId', i) as string;
					logger.debug(`Deleting account offer: ${accountOfferId}`);

					responseData = await deleteAccountOffer.call(this, accountOfferId);
				}

				else if (operation === 'list') {
					const accountOfferId = this.getNodeParameter('accountOfferId', i) as string;
					logger.debug(`Listing account offer: ${accountOfferId}`);

					responseData = await listAccountOffer.call(this, accountOfferId) as unknown as IDataObject;
				}

				else if (operation === 'unlist') {
					const accountOfferId = this.getNodeParameter('accountOfferId', i) as string;
					logger.debug(`Unlisting account offer: ${accountOfferId}`);

					responseData = await unlistAccountOffer.call(this, accountOfferId) as unknown as IDataObject;
				}

				else if (operation === 'duplicate') {
					const accountOfferId = this.getNodeParameter('accountOfferId', i) as string;
					logger.debug(`Duplicating account offer: ${accountOfferId}`);

					responseData = await duplicateAccountOffer.call(this, accountOfferId) as unknown as IDataObject;
				}

				else {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported operation: ${operation}`,
						{ itemIndex: i },
					);
				}
			}

			else if (resource === 'game') {
				if (operation === 'get') {
					const gameSlug = this.getNodeParameter('gameSlug', i) as string;
					logger.debug(`Getting game: ${gameSlug}`);

					responseData = await getGame.call(this, gameSlug) as unknown as IDataObject;
				}

				else if (operation === 'getMany') {
					const returnAll = this.getNodeParameter('returnAll', i, true) as boolean;
					const filters = this.getNodeParameter('filters', i, {}) as IDataObject;

					logger.debug(`Getting games with filters: ${JSON.stringify(filters)}`);

					const games = await getGamesExecute.call(this, returnAll, filters);
					responseData = games as unknown as IDataObject[];
				}

				else {
					throw new NodeOperationError(
						this.getNode(),
						`Unsupported operation: ${operation}`,
						{ itemIndex: i },
					);
				}
			}

			else {
				throw new NodeOperationError(
					this.getNode(),
					`Unsupported resource: ${resource}`,
					{ itemIndex: i },
				);
			}

			const executionData = this.helpers.constructExecutionMetaData(
				this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
				{ itemData: { item: i } },
			);

			returnData.push(...executionData);

		} catch (error) {
			if (this.continueOnFail()) {
				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray({ error: (error as Error).message }),
					{ itemData: { item: i } },
				);
				returnData.push(...executionData);
				continue;
			}
			throw error;
		}
	}

	return [returnData];
}
