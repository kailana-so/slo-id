import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { userId } = await req.json();

    if (!userId) {
      	return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    cookies().set('id', userId, {
		httpOnly: true,
		secure: true,
		sameSite: 'lax',
		path: '/',
    });

    return NextResponse.json({ success: true });
}
