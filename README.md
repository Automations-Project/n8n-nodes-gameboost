# n8n-nodes-gameboost

![Banner image](https://i.imgur.com/U0zB9Ea.png)

This is a custom n8n node created by **Nskha** that enables seamless integration with **GameBoost**. It allows sellers to manage their accounts through automated workflows without any programming knowledge.

## Features

- **No-code Automation**: Seamlessly integrate GameBoost operations into your n8n workflows
- **Complete Account Management**: 
  - List all accounts
  - Create new accounts
  - Delete existing accounts
- **Secure Authentication**: Built-in credential management for secure API access
- **Error Handling**: Robust error handling and detailed feedback
- **Documentation**: Comprehensive documentation and examples included

---

## Prerequisites

- **Node.js**: Version 18+ (Recommended: 20+)
- **n8n**: Latest stable version
- **npm**: Latest stable version (included with Node.js)
- **GameBoost Account**: Active seller account on GameBoost

---

## Installation

To install this custom node as an npm package, run:

npm i @nskha/n8n-nodes-gameboost


Once installed, ensure that n8n detects external modules according to [their documentation](https://docs.n8n.io/integrations/creating-nodes/install/).

---

## Usage

1. **Add the Node to Your Workflow**  
   After installing the package, you can add the **Gameboost** node in the n8n Editor UI.
2. **Configure Credentials**  
   Configure any necessary credentials required for interacting with GameBoost.  
   Refer to [n8n credentials documentation](https://docs.n8n.io/integrations/creating-nodes/credentials/) to learn how to add credentials to your node.
3. **Run Your Workflow**  
   Trigger or manually start your n8n workflow to perform account operations (list, delete, create) on GameBoost.

---

## Development

If you want to modify or extend this node:

1. Clone this repository:
git clone https://github.com/Automations-Project/n8n-nodes-gameboost.git

2. Install dependencies:
npm install


3. Navigate to `~/.n8n/custom` directory (create it if it doesn't exist) and initialize a new npm project:
npm init -y

4. Run the development server:
npm run start:dev
