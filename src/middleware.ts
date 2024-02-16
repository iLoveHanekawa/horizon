import { NextRequest } from "next/server";
import { updateSession } from "./auth/utils";

export default async function middleware(req: NextRequest) {
    
    await updateSession(req);
}

export const config = {
    matcher: '/api/trpc/auth/*'
}