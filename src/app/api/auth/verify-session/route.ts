import { NextRequest, NextResponse } from 'next/server';
import { Client, Account } from 'appwrite';

// Appwrite client configuration
const client = new Client();
const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1';
const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';

client
  .setEndpoint(endpoint)
  .setProject(projectId);

const account = new Account(client);

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();
    
    if (!sessionId) {
      return NextResponse.json({ 
        authenticated: false, 
        isAdmin: false, 
        error: 'No session ID provided' 
      }, { status: 401 });
    }

    // Try to get the current user
    const user = await account.get();
    
    // Check if user has admin role
    const isAdmin = user && user.labels && user.labels.includes('admin');
    
    return NextResponse.json({ 
      authenticated: true, 
      isAdmin, 
      user: {
        id: user.$id,
        email: user.email,
        name: user.name,
        labels: user.labels
      }
    });
    
  } catch (error: any) {
    console.error('Session verification failed:', error);
    return NextResponse.json({ 
      authenticated: false, 
      isAdmin: false, 
      error: error.message || 'Session verification failed' 
    }, { status: 401 });
  }
}
