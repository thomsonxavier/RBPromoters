import { Account, Avatars, Client, Databases, ID, Messaging, Storage } from "appwrite";

const client = new Client();

// Set default endpoint if not provided
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set. Please add it to your .env.local file');
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
;

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const messaging = new Messaging(client);

export { ID } from 'appwrite';

// Export configuration for debugging
export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  collectionId: '689e1bf300078583b2ba'
};
