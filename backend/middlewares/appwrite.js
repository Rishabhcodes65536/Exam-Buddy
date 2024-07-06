import { Client, Account } from "appwrite";


//Web SDK
const client = new Client();

client
    .setEndpoint('http://localhost/v1') 
    .setProject('455x34dfkj') 
;

const account = new Account(client);

export {client,account}