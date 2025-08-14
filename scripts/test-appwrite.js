import { Client, Databases } from 'appwrite';
import { readFileSync } from 'fs';
import { join } from 'path';

// Load environment variables from .env.local
function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=');
        }
      }
    });
    
    return envVars;
  } catch (error) {
    console.error('Error loading .env.local:', error.message);
    return {};
  }
}

const env = loadEnv();

const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const databaseId = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

console.log('Testing Appwrite SDK...');
console.log('Config:', { endpoint, projectId, databaseId });

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

const databases = new Databases(client);

console.log('Available methods on databases:');
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(databases)).filter(name => !name.startsWith('_')));
