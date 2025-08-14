import { Client, Databases, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const endpoint = envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1';
const projectId = envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const databaseId = envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const collectionId = envVars.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

if (!projectId || !databaseId || !collectionId) {
  console.error('❌ Missing environment variables!');
  console.log('Please create a .env.local file with:');
  console.log('NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id');
  console.log('NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id');
  console.log('NEXT_PUBLIC_APPWRITE_COLLECTION_ID=your_collection_id');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId);

const databases = new Databases(client);

async function addTestProperty() {
  try {
    console.log('🧪 Adding test property...');
    
    const testProperty = {
      name: 'Test Property - 2 Acre Dry Land',
      slug: 'test-property-2-acre-dry-land',
      location: 'Test Location, Tamil Nadu',
      rate: '2.5 L per Cent',
      beds: 0,
      baths: 0,
      area: 2,
      propertyType: 'land',
      status: 'In Process'
    };

    const response = await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      testProperty
    );

    console.log('✅ Test property added successfully!');
    console.log('📋 Document ID:', response.$id);
    console.log('📋 Property Name:', response.name);
    
    return response;
  } catch (error) {
    console.error('❌ Error adding test property:', error.message);
    throw error;
  }
}

addTestProperty()
  .then(() => {
    console.log('\n🎉 Test completed successfully!');
    console.log('🌐 You can now use the admin interface at: http://localhost:3000/admin/dashboard');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  });
