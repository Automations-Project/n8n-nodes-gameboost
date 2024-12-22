import { 
    INodeType, 
    INodeTypeDescription,  IHttpRequestOptions,IExecuteSingleFunctions

} from 'n8n-workflow';


import { STATIC_FIELDS } from './create_static_fields';
//@ts-ignore
import {getGameSlugs,getAccountDataFields,getAllAccountsID} from '../../methods'

// Move constants outside the class

export class gameboost implements INodeType {
    //@ts-ignore
    private async processAccountData(fields: any[], gameSlug: string, helpers: any) {
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

    description: INodeTypeDescription = {
        displayName: 'Game Boost',
        name: 'gameBoost',
        icon: 'file:gameboost.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["operation"]}}',
        description: 'Get data from Game Boost API',
        defaults: {
            name: 'Game Boost',
        },

        // Input configuration
        //@ts-ignore
        inputs: ['main'],
        
        // Output configuration - note the different type assertion
        //@ts-ignore
        outputs: ['main'],


        credentials: [
            {
                name: 'gameboostApi',
                required: true,
            },
        ],
        requestDefaults: {
            baseURL: 'https://api.gameboost.com/v1',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: '={{`Bearer ${$credentials.gameboostApi.apiKey}`}}',
            },
        },
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                default: 'getAllAccounts',
                options: [
                    {
                        name: 'Get All Accounts',
                        value: 'getAllAccounts',
                        action: 'Get all accounts',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/accounts',
                            },
                        },
                    },
                    {
                        name: 'Get Account By ID',
                        value: 'getAccountById',
                        description: 'Get account by its ID',
                        action: 'Get account by its ID',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/accounts/{{$parameter["accountId"]}}',
                            },
                        },
                    },
                    {
                        name: 'Get Game Schema',
                        value: 'getgameschema',
                        action: 'Get game schema',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '=/accounts/template/{{$parameter["gameslug"]}}',
                            },
                        },
                    },
                    {
                        name: 'Create Account',
                        value: 'createaccount',
                        description: 'Create account to post it on Game Boost',
                        action: 'Create a new account',
                        routing: {
                            request: {
                                method: 'POST',
                                url: '/accounts',
                                body: {
                                    game: '={{$parameter.game}}',
                                    title: '={{$parameter.title}}',
                                    slug: '={{$parameter.slug}}',
                                    price: '={{$parameter.price}}',
                                    ign: '={{$parameter.ign}}',
                                    login: '={{$parameter.login}}',
                                    password: '={{$parameter.password}}',
                                    email_login: '={{$parameter.email_login}}',
                                    email_password: '={{$parameter.email_password}}',
                                    is_manual: '={{$parameter.is_manual}}',
                                    delivery_time: {
                                        duration: '={{$parameter.delivery_time}}',
                                        unit: 'minutes'
                                    },
                                    has_2fa: '={{$parameter.has_2fa}}',
                                    server: '={{$parameter.server}}',
                                    level_up_method: '={{$parameter.level_up_method}}',
                                    description: '={{$parameter.description}}',
                                    dump: '={{$parameter.dump}}',
                                    delivery_instructions: '={{$parameter.delivery_instructions}}',
                                    image_urls: '={{$parameter.image_urls.split(",").map(url => url.trim())}}',
                                    account_data: '={{$node["Game Boost"].processAccountData($parameter.accountDataField.fields, $parameter.gameslug)}}',
                                },
                            },
                            send: {
                                preSend: [
                                    async function (this: IExecuteSingleFunctions, requestOptions: IHttpRequestOptions) {
                                        // Get the account data fields
                                        const accountDataFields = (this.getNodeParameter('accountDataField.fields', []) as Array<{ field: string; value: string }>) || [];
                                        
                                        // Process the account data with expression resolution
                                        const accountData: { [key: string]: any } = {};
                                        for (const field of accountDataFields) {
                                            if (!field.field || !field.value) continue;
                                            
                                            // Keep the original value, only try to resolve expressions
                                            let resolvedValue = field.value;
                                            try {
                                                if (field.value.includes("{{")) {
                                                    resolvedValue = this.evaluateExpression(field.value, 0) as string;
                                                }
                                            } catch (error) {
                                                console.log(`Error resolving expression for ${field.field}:`, error);
                                            }

                                            // Store the value as is, without type conversion
                                            accountData[field.field] = resolvedValue;
                                        }

                                        requestOptions.body = {
                                            ...requestOptions.body,
                                            account_data: accountData,
                                        };

                                        console.log('Final Request Body:', JSON.stringify(requestOptions.body, null, 2));
                                        return Promise.resolve(requestOptions);
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Delete Account',
                        value: 'deleteAccount',
                        description: 'Delete an account by its ID',
                        action: 'Delete an account',
                        routing: {
                            request: {
                                method: 'DELETE',
                                url: '=/accounts/{{$parameter["accountId"]}}',
                            },
                        },
                    },


                    {
                        name: 'Update Account Status',
                        value: 'updateAccountStatus',
                        description: 'Update Account Status Draft/listed',
                        action: 'Update account status',
                        routing: {
                            request: {
                                method: 'PATCH',
                                url: '=/accounts/{{$parameter["accountId"]}}',
                                body: {
                                    status: '={{$parameter.status}}'
                                }
                            },

                            
                        },
                    },


                ],
            },

            {
                displayName: 'Status',
                name: 'status',
                type: 'options',
                default: 'draft',
                description: 'The status of the account',
                placeholder:"Draft",
                options: [
                    { name: 'Draft', value: 'draft' },
                    { name: 'Listed', value: 'listed' },
                ],
                displayOptions: {

                    show: {
                        operation: ['updateAccountStatus'],
                    },
                    
                },
                required: true,
            },
            {
                displayName: 'Game Name or ID',
                name: 'gameslug',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getGameSlugs',
                },
                displayOptions: {
                    show: {
                        operation: ['getgameschema','createaccount'],
                    },
                },
                default: '',
                description: 'The Game name on the platform. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
            {
                displayName: 'Account Data Field',
                name: 'accountDataField',
                type: 'fixedCollection',
                typeOptions: {
                    multipleValues: true,
                },
                displayOptions: {
                    show: {
                        operation: ['createaccount'],
                    },
                },
                default: {},
                options: [
                    {
                        name: 'fields',
                        displayName: 'Fields',
                        values: [
                            {
                                displayName: 'Field Name or ID',
                                name: 'field',
                                type: 'options',
																																description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
                                typeOptions: {
                                    loadOptionsMethod: 'getAccountDataFields',
                                    loadOptionsDependsOn: ['gameslug'],
                                },
                                default: '',
                            },
                            {
                                displayName: 'Value',
                                name: 'value',
                                type: 'string',
                                default: '',
                                description: 'Enter value according to field requirements',
                            },
                        ],
                    },
                ],
                description: 'Select fields from the account_data schema and their values',
            },
            ...STATIC_FIELDS.map(field => ({
                ...field,
                displayOptions: {
                    show: {
                        operation: ['createaccount'],
                    },
                },
            })),
            {
                displayName: 'Account Name or ID',
                name: 'accountId',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getAllAccountsID',
                },
                displayOptions: {
                    show: {
                        operation: ['deleteAccount', 'getAccountById','updateAccountStatus'],
                    },
                },
                default: '',
                description: 'The ID of the account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
            },
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

