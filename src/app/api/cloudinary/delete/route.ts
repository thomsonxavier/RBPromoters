import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary for server-side operations
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(request: NextRequest) {
  try {
    console.log('DELETE request received for Cloudinary delete')
    
    const body = await request.json();
    console.log('Request body:', body)
    
    const { publicId } = body;

    if (!publicId) {
      console.log('No publicId provided')
      return NextResponse.json(
        { error: 'Public ID is required' },
        { status: 400 }
      );
    }

    console.log('Attempting to delete publicId:', publicId)

    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('Cloudinary delete result:', result)

    if (result.result === 'ok') {
      console.log('Delete successful')
      return NextResponse.json(
        { message: 'Image deleted successfully' },
        { status: 200 }
      );
    } else {
      console.log('Delete failed with result:', result)
      return NextResponse.json(
        { error: 'Failed to delete image', result },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
