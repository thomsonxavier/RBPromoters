# Appwrite Setup Guide

## Prerequisites

1. **Appwrite Account**: Sign up at [cloud.appwrite.io](https://cloud.appwrite.io)
2. **Node.js**: Make sure you have Node.js installed

## Step 1: Create Appwrite Project

1. Go to your Appwrite Console
2. Create a new project or use an existing one
3. Note down your **Project ID**

## Step 2: Create Database

1. In your Appwrite project, go to **Databases**
2. Click **Create Database**
3. Name it something like "PropertyDB" or "RealEstateDB"
4. Note down your **Database ID**

## Step 3: Set Environment Variables

Create a `.env.local` file in your project root with:

```bash
# Appwrite Configuration
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
```

Replace:
- `your_project_id_here` with your actual Project ID
- `your_database_id_here` with your actual Database ID

## Step 4: Run Setup Script

Run the setup script to create the collection and indexes:

```bash
npm run setup-appwrite
```

This will:
- Create a collection with ID `689e1771003c4fb4b958`
- Set up all required fields for properties
- Create indexes for better performance

## Step 5: Verify Setup

1. Go to your Appwrite Console
2. Navigate to **Databases** → **Your Database** → **Collections**
3. You should see a "Properties" collection
4. Check that all the fields are created correctly

## Step 6: Test the Application

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `/admin/add-property` to test creating a property
3. Navigate to `/admin/dashboard` to see the property management interface

## Troubleshooting

### "Route not found" Error
- Make sure your Project ID and Database ID are correct
- Ensure the collection was created successfully
- Check that your environment variables are loaded

### "Collection not found" Error
- Run the setup script again: `npm run setup-appwrite`
- Check that the collection ID matches in your code

### Permission Errors
- Make sure your Appwrite project has the correct permissions
- Check that your API keys have the right scopes

## Collection Schema

The setup script creates a collection with these fields:

### Required Fields
- `name` (string) - Property name
- `slug` (string) - URL-friendly identifier
- `location` (string) - Property location
- `rate` (string) - Property rate/price
- `propertyType` (string) - Type of property

### Optional Fields
- `beds`, `baths`, `area` - Basic property details
- `config`, `sizeRange`, `priceRange` - Configuration details
- `society`, `builder`, `status` - Property metadata
- `features`, `amenities` - Arrays of features and amenities
- `description` - Property description
- Location fields: `pincode`, `state`, `city`, `locality`, `road`
- Apartment-specific: `saleType`, `facing`, `postDate`, `owner`, `agent`
- Land-specific: `landType`, `buildUpArea`, `sketch`, `remarks`
- `images` - Array of image URLs
- `apartmentConfigs` - Array of apartment configurations

## Next Steps

After setup, you can:
1. Add properties through the admin interface
2. Customize the form fields as needed
3. Add authentication to protect admin routes
4. Implement property search and filtering
