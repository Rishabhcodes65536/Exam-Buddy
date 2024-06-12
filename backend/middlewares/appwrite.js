import { Client, Account } from "appwrite";


// Init your Web SDK
const client = new Client();

client
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('455x34dfkj') // Your project ID
;

const account = new Account(client);

export {client,account}