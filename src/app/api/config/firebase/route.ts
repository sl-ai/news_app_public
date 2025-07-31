import { NextRequest, NextResponse } from 'next/server';
import { getFirebaseConfig } from '@/lib/serverSecretManager';

export async function GET(request: NextRequest) {
  try {
    const config = await getFirebaseConfig();
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error fetching Firebase config:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Firebase configuration' },
      { status: 500 }
    );
  }
} 