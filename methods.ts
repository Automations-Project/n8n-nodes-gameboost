import { ILoadOptionsFunctions, INodePropertyOptions,IExecuteSingleFunctions, IHttpRequestOptions } from 'n8n-workflow';
interface FieldConfig {
    condition: string;
    values?: string[];
}

interface AccountDataTemplate {
    [key: string]: FieldConfig;
}

export async function getGameSlugs(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const credentials = await this.getCredentials('gameboostApi');
    
    try {
        await this.helpers.request({
            method: 'GET',
            url: 'https://api.gameboost.com/v1/accounts/template/all',
            headers: {
                'Authorization': `Bearer ${credentials.apiKey}`,
            },
            json: true,
        });
        return [];
        
    } catch (error) {
        // The games list is in the error response
        try {
            const errorResponse = JSON.parse(error.message.substring(error.message.indexOf('{')));
            
            if (errorResponse.games) {
                const options = [
                    {name: 'All', value: ''},
                    ...Object.entries(errorResponse.games).map(([key, value]) => ({
                        name: String(value),
                        value: String(key),
                    }))
                
                ];
                return options;
            }
        } catch (parseError) {
            console.error('Error parsing games from error response:', parseError);
        }
        
        return [];
    }
}

export async function getAllAccountsID(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    const credentials = await this.getCredentials('gameboostApi');
    
    // Get the API token similar to getAccountDataFields
    let apiToken = '';
    if (credentials && typeof credentials === 'object') {
        if ('apiToken' in credentials) {
            apiToken = credentials.apiToken as string;
        } else if ('data' in credentials && typeof credentials.data === 'object' && 'apiToken' in credentials.data) {
            apiToken = credentials.data.apiToken as string;
        }
    }

    if (!apiToken) {
        throw new Error('No API token found in credentials');
    }
    
    try {
        const response = await this.helpers.request({
            method: 'GET',
            url: 'https://api.gameboost.com/v1/accounts?per_page=200',
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            json: true,
        });
        if (response) {
            // Map each ID to an option object
            const options = response.data.map((account: any) => ({
                name: String(`Account ID: ${account.id}`),
                value: String(account.id),
                description: String(account.attributes.title),
            }));
            return options;
        }

        
        return [];
    } catch (error) {
        console.error('Error fetching accountsId:', error);
        return [];
    }
}


export async function getAccountDataFields(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
    try {
        const credentials = await this.getCredentials('gameboostApi');
        console.log('DEBUG: (getAccountDataFields) Credentials loaded successfully');

        let apiToken = '';
        if (credentials && typeof credentials === 'object') {
            if ('apiToken' in credentials) {
                apiToken = credentials.apiToken as string;
            } else if ('data' in credentials && typeof credentials.data === 'object' && 'apiToken' in credentials.data) {
                apiToken = credentials.data.apiToken as string;
            }
        }

        if (!apiToken) {
            throw new Error('No API token found in credentials');
        }

        const gameslug = this.getNodeParameter('gameslug', '') as string;
        console.log('DEBUG: (getAccountDataFields) gameslug parameter:', gameslug);

        if (!gameslug) {
            console.log('DEBUG: (getAccountDataFields) No gameslug selected, cannot load account data fields.');
            return [];
        }

        const url = `https://api.gameboost.com/v1/accounts/template/${encodeURIComponent(gameslug)}`;
        console.log('DEBUG: (getAccountDataFields) Requesting template data from:', url);

        const response = await this.helpers.request({
            method: 'GET',
            url,
            headers: {
                'Authorization': `Bearer ${apiToken}`,
            },
            json: true,
        });

        console.log('DEBUG: (getAccountDataFields) Response from template endpoint:', JSON.stringify(response, null, 2));

        // Get account_data from template
        const accountData = response?.template?.account_data as AccountDataTemplate;
        if (!accountData) {
            console.log('DEBUG: (getAccountDataFields) Could not find account_data in the response.');
            return [];
        }

        const returnData: INodePropertyOptions[] = [];
        for (const [key, fieldConfig] of Object.entries(accountData)) {
            // Only process fields that have a condition
            if (fieldConfig.condition) {
                let description = '';
                
                if (fieldConfig.condition === 'boolean') {
                    description = 'Boolean value (true/false)';
                } else if (fieldConfig.condition.startsWith('min:')) {
                    description = `Minimum value: ${fieldConfig.condition.split(':')[1]}`;
                } else if (fieldConfig.condition === 'string' && fieldConfig.values) {
                    description = `Allowed values: ${fieldConfig.values.join(', ')}`;
                } else {
                    description = `Condition: ${fieldConfig.condition}`;
                }

                returnData.push({
                    name: key,
                    value: key,
                    description,
                });
            }
        }

        console.log('DEBUG: (getAccountDataFields) Returning filtered account data fields:', returnData);
        return returnData;
    } catch (error) {
        console.log('DEBUG: (getAccountDataFields) Error:', error);
        return [];
    }
}
  


export async function handleGetAllAccountsPreSend(this: IExecuteSingleFunctions): Promise<IHttpRequestOptions> {
    const options = this.getNodeParameter('getAllPages', false) as boolean;
    const withAllData = this.getNodeParameter('getAllData', false) as boolean;
    return {
        method: 'GET',
        url: 'https://api.gameboost.com/v1/accounts',
        qs: {
            with_data: withAllData ? 1 : 0,
            per_page: options ? 200 : undefined
        }
    };
}


export async function handleGetAllAccountsPostReceive(this: IExecuteSingleFunctions, items: any[]): Promise<any[]> {
    const gameslug = this.getNodeParameter('gameslug', 'All') as string;
    const accountStatus = this.getNodeParameter('accountStatus', 'All') as string;
    
    console.log('Raw response:', JSON.stringify(items, null, 2));
    
    const accounts = items[0].json.data || [];
    
    console.log('Total accounts before filter:', accounts.length);
    
    return accounts
        .filter((account:any) => {
            const matchesGameslug = gameslug === '' || account.attributes.game_slug === gameslug;
            const matchesStatus = accountStatus === '' || account.attributes.status === accountStatus;
            return matchesGameslug && matchesStatus;
        })
        .map((account:any) => ({
            json: {
                ...account.attributes,
                id: account.id,
                type: account.type
            }
        }));
}

export async function processAccountData(fields: any[], gameSlug: string, helpers: any) {
    // Get the schema for the selected game
    const response = await helpers.httpRequest({
        method: 'GET',
        url: `/accounts/template/${gameSlug}`,
        baseURL: 'https://api.gameboost.com/v1',
    });

    // Extract number fields from schema
    const schema = response.account_data_schema || {};
    const numberFields = Object.entries(schema)
        .filter(([_, value]: [string, any]) => value.type === 'integer' || value.type === 'number')
        .map(([key]) => key);

    // Process fields with dynamic type conversion
    const result: { [key: string]: any } = {};
    for (const f of fields) {
        if (f.value.includes("{{")) {
            result[f.field] = f.value;
        } else if (numberFields.includes(f.field)) {
            result[f.field] = parseInt(f.value);
        } else {
            result[f.field] = f.value;
        }
    }
    return result;
}