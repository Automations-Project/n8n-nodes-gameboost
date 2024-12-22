import { ILoadOptionsFunctions, INodePropertyOptions, } from 'n8n-workflow';

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
                const options = Object.entries(errorResponse.games).map(([key, value]) => ({
                    name: String(value),
                    value: String(key),
                }));
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
            url: 'https://api.gameboost.com/v1/accounts',
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
