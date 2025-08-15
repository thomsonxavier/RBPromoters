import { NextRequest, NextResponse } from 'next/server';
import { databases, ID, appwriteConfig } from '@/app/appwrite';

const CONTACT_COLLECTION_ID = appwriteConfig.contactCollectionId;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, number, email, message } = body;

    // Validate required fields
    if (!name || !number || !message) {
      return NextResponse.json(
        { error: 'Name, phone number, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create document in Appwrite collection
    const contactData = {
      name: name.trim(),
      number: number.toString().trim().substring(0, 12), // Limit to 12 characters
      email: email ? email.trim() : '', // Optional field
      message: message.trim(),
    };

    const response = await databases.createDocument(
      appwriteConfig.databaseId,
      CONTACT_COLLECTION_ID,
      ID.unique(),
      contactData
    );

    return NextResponse.json(
      { 
        success: true, 
        message: 'Contact form submitted successfully',
        id: response.$id 
      },
      { status: 201 }
    );

  } catch (error: any) {
    console.error('Contact form submission error:', error);
    
    // Handle specific Appwrite errors
    if (error.code === 401) {
      return NextResponse.json(
        { error: 'Unauthorized - Please check your API credentials' },
        { status: 401 }
      );
    }
    
    if (error.code === 404) {
      return NextResponse.json(
        { error: 'Contact collection not found. Please check collection ID: ' + CONTACT_COLLECTION_ID },
        { status: 404 }
      );
    }

    if (error.code === 403) {
      return NextResponse.json(
        { error: 'Permission denied. Please check collection permissions.' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit contact form. Please try again. Error: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get all contact submissions (for admin purposes)
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      CONTACT_COLLECTION_ID
    );

    return NextResponse.json(
      { 
        success: true, 
        contacts: response.documents,
        total: response.total 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Error fetching contacts:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    );
  }
}
