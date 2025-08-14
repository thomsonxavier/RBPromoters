import { Client, Databases, ID } from 'appwrite';
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

// Configuration
const endpoint = env.NEXT_PUBLIC_APPWRITE_ENDPOINT || process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
const databaseId = env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';
const collectionId = '689e1bf300078583b2ba';

// Check if environment variables are set
if (!projectId || !databaseId) {
  console.error('❌ Missing environment variables!');
  console.error('Please create a .env.local file with:');
  console.error('NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id');
  console.error('NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id');
  process.exit(1);
}

const client = new Client();
client.setEndpoint(endpoint).setProject(projectId);

const databases = new Databases(client);

async function testConnection() {
  try {
    console.log('🔧 Testing Appwrite connection...');
    console.log('Config:', { endpoint, projectId, databaseId, collectionId });

    // Test connection by trying to list documents
    console.log('📡 Testing database connection...');
    const response = await databases.listDocuments(databaseId, collectionId);
    console.log('✅ Connection successful!');
    console.log(`📊 Found ${response.documents.length} documents in collection`);
    
    if (response.documents.length > 0) {
      console.log('📋 Sample document structure:');
      console.log(JSON.stringify(response.documents[0], null, 2));
    }
    
    return true;
  } catch (error) {
    if (error.code === 404) {
      console.log('❌ Collection not found!');
      console.log('\n📋 Manual Collection Setup Required:');
      console.log('=====================================');
      console.log('1. Go to your Appwrite Console');
      console.log('2. Navigate to Databases → Your Database');
      console.log('3. Click "Create Collection"');
             console.log('4. Set Collection ID to: 689e1bf300078583b2ba');
      console.log('5. Set Collection Name to: Properties');
      console.log('6. Add the following attributes:');
      
      const attributes = [
        { key: 'name', type: 'string', size: 255, required: true },
        { key: 'slug', type: 'string', size: 255, required: true },
        { key: 'location', type: 'string', size: 500, required: true },
        { key: 'rate', type: 'string', size: 100, required: true },
        { key: 'beds', type: 'integer', required: false },
        { key: 'baths', type: 'integer', required: false },
        { key: 'area', type: 'double', required: false },
        { key: 'propertyType', type: 'string', size: 50, required: true },
        { key: 'config', type: 'string', size: 200, required: false },
        { key: 'sizeRange', type: 'string', size: 100, required: false },
        { key: 'priceRange', type: 'string', size: 100, required: false },
        { key: 'ratePerSqft', type: 'string', size: 100, required: false },
        { key: 'society', type: 'string', size: 200, required: false },
        { key: 'builder', type: 'string', size: 200, required: false },
        { key: 'status', type: 'string', size: 100, required: false },
        { key: 'description', type: 'string', size: 2000, required: false },
        { key: 'pincode', type: 'string', size: 10, required: false },
        { key: 'state', type: 'string', size: 100, required: false },
        { key: 'city', type: 'string', size: 100, required: false },
        { key: 'locality', type: 'string', size: 100, required: false },
        { key: 'road', type: 'string', size: 200, required: false },
        { key: 'saleType', type: 'string', size: 50, required: false },
        { key: 'facing', type: 'string', size: 50, required: false },
        { key: 'postDate', type: 'string', size: 20, required: false },
        { key: 'owner', type: 'string', size: 100, required: false },
        { key: 'agent', type: 'string', size: 100, required: false },
        { key: 'totalUnits', type: 'integer', required: false },
        { key: 'landType', type: 'string', size: 50, required: false },
        { key: 'buildUpArea', type: 'string', size: 100, required: false },
        { key: 'sketch', type: 'string', size: 50, required: false },
        { key: 'remarks', type: 'string', size: 200, required: false },
      ];

      attributes.forEach(attr => {
        console.log(`   - ${attr.key}: ${attr.type}${attr.size ? ` (${attr.size})` : ''}${attr.required ? ' (required)' : ''}`);
      });

      console.log('\n7. Add these array attributes:');
      console.log('   - features: string array (1000 chars)');
      console.log('   - amenities: string array (1000 chars)');
      console.log('   - images: string array (2000 chars)');
      console.log('   - apartmentConfigs: string array (1000 chars)');
      
      console.log('\n8. After creating the collection, run this script again to test the connection.');
      console.log('\n🌐 Appwrite Console URL: https://cloud.appwrite.io/console');
      
      return false;
    } else {
      console.error('❌ Connection error:', error.message);
      return false;
    }
  }
}

// Run the test
testConnection()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Appwrite setup completed successfully!');
      console.log('✅ You can now use the property management system.');
      console.log('🌐 Visit /admin/add-property to start adding properties');
    } else {
      console.log('\n⚠️  Please complete the manual setup and run this script again.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  });
