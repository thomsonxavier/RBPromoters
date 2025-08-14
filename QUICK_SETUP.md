# 🚀 Quick Setup Guide

## Step 1: Set Environment Variables

Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_APPWRITE_DATABASE_ID=your_database_id_here
```

**Replace:**
- `your_project_id_here` with your Appwrite Project ID
- `your_database_id_here` with your Appwrite Database ID

## Step 2: Get Your Appwrite IDs

1. **Project ID**: Go to your Appwrite Console → Settings → General
2. **Database ID**: Go to Databases → Your Database → Copy the ID

## Step 3: Run Setup Script

```bash
npm run setup-appwrite
```

This will:
- ✅ Create collection with ID `689e1771003c4fb4b958`
- ✅ Add all required fields for properties
- ✅ Create indexes for better performance

## Step 4: Test the Setup

Visit: `http://localhost:3000/test-appwrite`

This page will:
- ✅ Show your current configuration
- ✅ Test the connection to Appwrite
- ✅ Display any errors if setup failed
- ✅ Show existing properties if any

## Step 5: Start Adding Properties

Once setup is successful:
- Go to `/admin/add-property` to create properties
- Go to `/admin/dashboard` to manage all properties

## 🛠️ Troubleshooting

### "Missing environment variables" Error
- Make sure `.env.local` file exists in project root
- Check that Project ID and Database ID are correct
- Restart your development server after adding environment variables

### "Collection not found" Error
- Run `npm run setup-appwrite` again
- Check that your Database ID is correct
- Make sure you have permissions to create collections

### "Route not found" Error
- Verify your Project ID is correct
- Check that your Appwrite project is active
- Ensure your API keys have the right permissions

## 📋 What Gets Created

The setup script creates a collection with these fields:

### Required Fields
- `name` - Property name
- `slug` - URL-friendly identifier  
- `location` - Property location
- `rate` - Property rate/price
- `propertyType` - Type of property

### Optional Fields
- `beds`, `baths`, `area` - Basic details
- `config`, `sizeRange`, `priceRange` - Configuration
- `society`, `builder`, `status` - Metadata
- `features`, `amenities` - Arrays of features
- `description` - Property description
- Location fields: `pincode`, `state`, `city`, `locality`, `road`
- Apartment fields: `saleType`, `facing`, `postDate`, `owner`, `agent`
- Land fields: `landType`, `buildUpArea`, `sketch`, `remarks`
- `images` - Array of image URLs
- `apartmentConfigs` - Array of apartment configurations

## 🎯 Next Steps

After successful setup:
1. Add properties through the admin interface
2. Customize the form fields as needed
3. Add authentication to protect admin routes
4. Implement property search and filtering

---

**Need help?** Check the `/test-appwrite` page for detailed error messages and setup instructions.
