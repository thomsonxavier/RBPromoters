import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary for server-side operations
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    const { params } = await request.json();

    // Generate timestamp
    const timestamp = Math.round(new Date().getTime() / 1000);
    
    // Create the parameters object with ONLY the parameters that need to be signed
    // Based on the error message, Cloudinary only expects folder and timestamp
    const signatureParams = {
      folder: params.folder,
      timestamp: timestamp,
    };

    // Generate signature
    const signature = cloudinary.utils.api_sign_request(
      signatureParams,
      process.env.CLOUDINARY_API_SECRET!
    );

    console.log('Signature params:', signatureParams);
    console.log('Generated signature:', signature);

    return NextResponse.json({
      timestamp,
      signature,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
