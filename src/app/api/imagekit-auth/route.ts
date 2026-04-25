import { NextResponse } from 'next/server';
// @ts-ignore
import ImageKit from 'imagekit';

/**
 * API route to provide authentication parameters for client-side ImageKit uploads.
 * It uses the backend SDK to securely generate a token and signature
 * without exposing the private API key to the client.
 */
export async function GET(request: Request) {
  // Initialize ImageKit with credentials from environment variables
  const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!
  });

  // Generate authentication parameters
  const authenticationParameters = imageKit.getAuthenticationParameters();
  
  // Return the parameters as JSON
  return NextResponse.json(authenticationParameters);
}