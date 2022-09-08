import { NextRequest, NextResponse } from 'next/server';
// import * as jose from 'jose';
import {getToken} from 'next-auth/jwt'
 
 
export async function middleware(req: NextRequest) {

    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    // console.log({session});
    
    if (!session) {
        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
 
    // try {
    //     await jose.jwtVerify(req.cookies.get('token') as string,
    //         new TextEncoder().encode(process.env.JWT_SECRET_SEED));        
    //     return NextResponse.next();
 
    // } catch (error) {
    //     const { protocol, host, pathname  } = req.nextUrl
    //     return NextResponse.redirect(`${protocol}//${host}/auth/login?p=${pathname}`);
    // }
 
}
 
export const config = {
    matcher: ['/checkout/:path*']
};