import { Account, Avatars, Client, Databases, ID, Messaging, Storage } from "appwrite";

const client = new Client();

// Set default endpoint if not provided
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const apiKey = process.env.APPWRITE_API_KEY || '';

if (!projectId) {
  console.warn('NEXT_PUBLIC_APPWRITE_PROJECT_ID is not set. Please add it to your .env.local file');
}

if (!apiKey) {
  console.warn('APPWRITE_API_KEY is not set. Server-side operations may fail.');
}

client
    .setEndpoint(endpoint)
    .setProject(projectId)
;

// Note: For server-side operations, authentication might be handled differently
// We'll use the regular client for now

export const account = new Account(client);
export const avatars = new Avatars(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const messaging = new Messaging(client);

// For now, we'll use the regular databases instance
export const serverDatabases = databases;

export { ID } from 'appwrite';

// Export configuration for debugging
export const appwriteConfig = {
  endpoint,
  projectId,
  databaseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '',
  collectionId: '689e1bf300078583b2ba',
  contactCollectionId: '689ea1c50028608d23a8', // Contact form collection
  categoryCollectionId: process.env.NEXT_PUBLIC_CATEGORY_COLLECTION_ID || '', // Category collection
  bucketId: '689e16ec0007728e6ad7' // Rbproperties bucket
};
