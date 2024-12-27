import { INodeProperties } from "n8n-workflow";
export const STATIC_FIELDS: INodeProperties[] = [
    // Not Needed because we get the gameslug from the gameslug parameter
    {
        displayName: 'Game',
        name: 'game',
        type: 'string',
        default: '={{$node["Game Boost"].parameter["gameslug"]}}',
        description: 'The name of the game',
        placeholder:"rust",
        typeOptions: {
            readOnly: true,
        },
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        default: '',
        description: 'The title of the account',
        placeholder:"New Rust Accounts [Steam] 🚫 Zero Hours 🔑 Full Access 🚀 Instant Delivery",
        required: true,
    },
    {
        displayName: 'Slug',
        name: 'slug',
        type: 'string',
        default: '',
        description: 'A URL-friendly identifier',
        placeholder:"rust-account-with-full-access",
        required: true,

    },
    {
        displayName: 'Price [Euro]',
        name: 'price',
        type: 'number',
        default: 0,
        description: 'The price of the account in Euros Only',
        placeholder:"100",
        required: true,
    },
    {
        displayName: 'IGN',
        name: 'ign',
        type: 'string',
        default: '',
        description: 'In-game name',
        placeholder:"Miracle-A",
        required: true,
    },
    {
        displayName: 'Login',
        name: 'login',
        type: 'string',
        default: '',
        description: 'The login username',
        placeholder:"Miracle-A-2001",
        required: true,
    },
    {
        displayName: 'Password',
        name: 'password',
        type: 'string',
								typeOptions: { password: true },
        default: '',
        description: 'The account password',
        placeholder:"D93jADms@12okasCAwwqw",
        required: true,
    },
    {
        displayName: 'Email Login',
        name: 'email_login',
        type: 'string',
        default: '',
        description: 'The email used to log in',
        placeholder:"etc@gmail.com",
        required: true,
    },
    {
        displayName: 'Email Password',
        name: 'email_password',
        type: 'string',
								typeOptions: { password: true },
        default: '',
        description: 'The password for the email',
        placeholder:"D93jADms@12okasCAwwqw",
        required: true,
    },
    {
        displayName: 'Is Manual',
        name: 'is_manual',
        type: 'boolean',
        default: false,
        description: 'Whether the delivery is manual',
        required: true,
    },
    {
        displayName: 'Delivery Time in Minutes',
        name: 'delivery_time',
        type: 'number',
        default: 0,
        placeholder:"10",
        required: true,
    },
    {
        displayName: 'Has 2FA',
        name: 'has_2fa',
        type: 'boolean',
        default: false,
        description: 'Whether the account has 2FA',
        required: true,
    },
    {
        displayName: 'Server',
        name: 'server',
        type: 'options',
        default: 'asia',
        description: 'The server the account is on',
        placeholder:"Global",
        required: true,
        
        options: [
            
    {
        name: 'Asia',
        value: 'asia'
    },
    {
        name: 'Europe',
        value: 'europe'
    },
    {
        name: 'Europe West',
        value: 'europe_west'
    },
    {
        name: 'Global',
        value: 'global'
    },
    {
        name: 'North America',
        value: 'north_america'
    },
    {
        name: 'South East Asia',
        value: 'south_east_asia'
    }     

 ],
    },
    {
        displayName: 'Level Up Method',
        name: 'level_up_method',
        type: 'options',
        default: 'by_hand',
        description: 'The method used to level up',
        placeholder:"By Hand",
        required: true,
        options: [
            { name: 'By Hand', value: 'by_hand', description: 'The account is manually leveled up' },
            { name: 'By Bot', value: 'by_bot', description: 'The account is leveled up by a bot' },
        ],
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        default: '',
        description: 'A description of the account',
        placeholder:"New Rust Accounts [Steam] 🚫 Zero Hours 🔑 Full Access 🚀 Instant Delivery",
        required: true,
    },
    {
        displayName: 'Dump',
        name: 'dump',
        type: 'string',
        default: '',
        description: 'Any additional dump data',
        placeholder:"Fresh Rust Account with Full Access",
        required: true,
    },
    {
        displayName: 'Delivery Instructions',
        name: 'delivery_instructions',
        type: 'string',
        default: '',
        description: 'Instructions for delivery',
        placeholder:"The code will be provided instantly if I am online.",
        required: true,
    },
    {
        displayName: 'Image URLs',
        name: 'image_urls',
        type: 'string',
        default: '',
        description: 'Enter image URLs separated by commas (e.g., https://example.com/image1.jpg, https://example.com/image2.jpg)',
        noDataExpression: false,
    },
];
