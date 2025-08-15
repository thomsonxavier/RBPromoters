import { Client, Databases, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';

// Load environment variables manually
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim().replace(/"/g, '');
  }
});

const client = new Client()
  .setEndpoint(envVars.NEXT_PUBLIC_APPWRITE_ENDPOINT)
  .setProject(envVars.NEXT_PUBLIC_APPWRITE_PROJECT_ID);

const databases = new Databases(client);

async function checkAndFixImages() {
  try {
    console.log('Checking Appwrite collection for image format issues...');
    
    const documents = await databases.listDocuments(
      envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
      envVars.NEXT_PUBLIC_APPWRITE_COLLECTION_ID
    );

    console.log(`Found ${documents.documents.length} documents`);

    for (const doc of documents.documents) {
      const images = doc.images;
      
      if (images && Array.isArray(images)) {
        let hasOldFormat = false;
        const newImages = [];

        for (const image of images) {
          if (typeof image === 'object' && image.src) {
            console.log(`Document ${doc.name} has old image format:`, image);
            hasOldFormat = true;
            newImages.push(image.src); // Convert to string URL
          } else if (typeof image === 'string') {
            newImages.push(image);
          }
        }

        if (hasOldFormat) {
          console.log(`Fixing image format for document: ${doc.name}`);
          
          // Update the document with correct image format
          await databases.updateDocument(
            envVars.NEXT_PUBLIC_APPWRITE_DATABASE_ID,
            envVars.NEXT_PUBLIC_APPWRITE_COLLECTION_ID,
            doc.$id,
            {
              images: newImages
            }
          );
          
          console.log(`Fixed image format for: ${doc.name}`);
        }
      }
    }

    console.log('Image format check completed!');
  } catch (error) {
    console.error('Error checking/fixing images:', error);
  }
}

checkAndFixImages();
