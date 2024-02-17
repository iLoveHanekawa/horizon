import { NextRequest, NextResponse } from "next/server";
import { getSession, updateSession } from "./auth/utils";
import { APP_URL_DEV, APP_URL_PROD } from "./app/config";

export default async function middleware(req: NextRequest, res: NextResponse) {
    const url = process.env.NODE_ENV === 'development'? APP_URL_DEV: APP_URL_PROD
    await updateSession(req);
    const session = await getSession();
    if(!session) return NextResponse.redirect(url + '/admin/login')
}

export const config = {
    matcher: ['/api/trpc/auth/:path*', '/admin']
}