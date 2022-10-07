import { NextRequest, NextResponse } from 'next/server';
// import * as jose from 'jose';
import {getToken} from 'next-auth/jwt'
 
 
export async function middleware(req: NextRequest) {

    const session: any = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    // console.log({session});
    
    if (!session) {

        if (req.nextUrl.pathname.startsWith('/api/admin')) {
            return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
        }

        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `p=${requestedPage}`;
        return NextResponse.redirect(url);
    }

    const validRoles = ['admin', 'super-user', 'SEO'];

    if ( req.nextUrl.pathname.startsWith('/admin') && 
        !validRoles.includes(session.user.role)) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if ( req.nextUrl.pathname.startsWith('/api/admin') && 
        !validRoles.includes(session.user.role)) {
        return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url));
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
    matcher: ['/checkout/:path*', '/admin/:path*', '/((?!api\/)/admin/:path.*)']
};