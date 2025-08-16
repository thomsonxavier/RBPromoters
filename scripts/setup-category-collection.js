const { Client, Databases, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const databases = new Databases(client);

async function setupCategoryCollection() {
    try {
        const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
        
        if (!databaseId) {
            console.error('❌ NEXT_PUBLIC_APPWRITE_DATABASE_ID is not set in .env.local');
            console.log('Please add: NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id');
            return;
        }

        console.log('🚀 Setting up category collection...');

        // Create the category collection
        const collection = await databases.createCollection(
            databaseId,
            ID.unique(),
            'Categories',
            [
                // Name attribute
                {
                    key: 'name',
                    type: 'string',
                    size: 255,
                    required: true,
                    array: false,
                },
                // Description attribute
                {
                    key: 'description',
                    type: 'string',
                    size: 1000,
                    required: true,
                    array: false,
                },
                // Image attribute
                {
                    key: 'image',
                    type: 'string',
                    size: 500,
                    required: true,
                    array: false,
                },
                // Slug attribute
                {
                    key: 'slug',
                    type: 'string',
                    size: 255,
                    required: true,
                    array: false,
                }
            ]
        );

        console.log('✅ Category collection created successfully!');
        console.log('📋 Collection ID:', collection.$id);
        console.log('');
        console.log('🔧 Next steps:');
        console.log('1. Add the collection ID to your .env.local file:');
        console.log(`   NEXT_PUBLIC_CATEGORY_COLLECTION_ID=${collection.$id}`);
        console.log('');
        console.log('2. Set up permissions for the collection:');
        console.log('   - Go to your Appwrite console');
        console.log('   - Navigate to Databases > Your Database > Categories');
        console.log('   - Set appropriate permissions for read/write access');
        console.log('');
        console.log('3. Create indexes if needed:');
        console.log('   - Create a unique index on "slug" field');
        console.log('   - Create a fulltext index on "name" field');

    } catch (error) {
        console.error('❌ Error setting up category collection:', error.message);
        
        if (error.code === 409) {
            console.log('ℹ️  Collection already exists. You can use the existing collection ID.');
        }
    }
}

// Run the setup
setupCategoryCollection();
