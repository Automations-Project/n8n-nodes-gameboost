import { 
    INodeType, 
    INodeTypeDescription,
    IHttpRequestOptions,
    IExecuteSingleFunctions,
} from 'n8n-workflow';


import { STATIC_FIELDS } from '../../create_static_fields';
//@ts-ignore
import {getGameSlugs,getAccountDataFields,getAllAccountsID,handleGetAllAccountsPreSend,handleGetAllAccountsPostReceive,processAccountData} from '../../methods'

// Move constants outside the class

export class GameBoost implements INodeType {


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
        //@ts-ignore
        inputs: ['main'],
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
                Authorization: '={{`Bearer ${$credentials.gameboostApi.apiToken}`}}',
            },
        },
        properties: [
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                default: 'getAllAccounts',
                noDataExpression: true,
                options: [
                    {
                        name: 'Get All Accounts',
                        value: 'getAllAccounts',
                        action: 'Get all accounts',
                        description:"Retrieve all the account data stored in the system, This includes details about all the accounts currently available",
                        routing: {
                            request: {
                                method: 'GET',
                                url: 'https://api.gameboost.com/v1/accounts',
                                qs: {
                                    with_data: true,
                                    page: 1,
                                    per_page: 10 // Default value
                                }
                            },
                            send: {
                                preSend: [handleGetAllAccountsPreSend]
                            },
                            output: {
                                postReceive: [handleGetAllAccountsPostReceive]
                            }
                        },
                    },
                    {
                        name: 'Get Account By ID',
                        value: 'getAccountById',
                        description: 'Search for a specific account using its unique ID, This is helpful when you need detailed information about one particular account',
                        action: 'Get account by ID',
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
                        description:"Access the schema (JSON file) for a specific game, This schema contains essential details like characters, skins, and other attributes required for that game",
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
                        description: 'Add a new account to the system, You can input all the required details for the account and once completed, publish it on the platform',
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
                                        return Promise.resolve(requestOptions);
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: 'Delete Account',
                        value: 'deleteAccount',
                        description: 'Permanently remove an account using its unique ID. Use this option if the account is no longer needed.',
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
                        description: 'Change the status of an account such as switching it from "Draft" to "Listed", This is useful for managing the visibility of accounts on the platform',
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
                    defaultOptions: [{name: 'All', value: ''}]
                },
                displayOptions: {
                    show: {
                        operation: ['getgameschema','createaccount','getAllAccounts'],
                    },
                },
                default: '',
                description: 'The Game name on the platform, Choose from the list',
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
            {
                displayName: 'Get All Pages',
                name: 'getAllPages',
                type: 'boolean',
                default: false,
                description: 'Whether to get all accounts or just the first page',
                displayOptions: {
                    show: {
                        operation: ['getAllAccounts'],
                    },
                },
            },
            {
                displayName: 'With All Data',
                name: 'getAllData',
                type: 'boolean',
                default: false,
                description: 'Whether to include all account data in the response',
                displayOptions: {
                    show: {
                        operation: ['getAllAccounts'],
                    },
                },

                
            },
  {
                displayName: 'Status',
                name: 'accountStatus',
                type: 'options',
                default: '',
                options: [
                    { name: 'All', value: '' },
                    { name: 'Draft', value: 'Draft' },
                    { name: 'Listed', value: 'Listed' },
                    { name: 'Pending', value: 'Pending' },
                    { name: 'Processing', value: 'Processing' },
                    { name: 'Refunded', value: 'Refunded' },
                    { name: 'Sold', value: 'Sold' }
                    
                ],
                
                description: 'Whether to include all account data in the response',
                displayOptions: {
                    show: {
                        operation: ['getAllAccounts'],
                    },
                },

                
                

                
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

