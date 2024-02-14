import { cookies } from "next/headers"
import { AUTH_COOKIE_EXPIRATION_IN_MILISECONDS, AUTH_SESSION_COOKIE } from "./constants"
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { JWT_SECRET } from "./constants"
import { NextRequest, NextResponse } from "next/server";


export type HorizonPayload = {
    expires: number
}

export interface HorizonJWTPayload extends JWTPayload {
    expires: number
}

const key = new TextEncoder().encode(JWT_SECRET);

export const encrypt = async(payload: HorizonPayload) => {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256'}).setIssuedAt().setExpirationTime('10 sec from now').sign(key);
}

export const decrypt = async (input: string): Promise<HorizonJWTPayload> => {
    const { payload } = await jwtVerify<{ expires: number }>(input, key, {
        algorithms: ['HS256']
    });
    return payload;
}

export const getSession = async() => {
    const session = cookies().get(AUTH_SESSION_COOKIE)?.value;
    if(!session) return null;
    return await decrypt(session);
}

export const updateSession = async (req: NextRequest) => {
    const session = req.cookies.get(AUTH_SESSION_COOKIE)?.value;
    if(!session) return null;
    const parsed = await decrypt(session);
    parsed.expires = Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS;
    const res = NextResponse.next();
    res.cookies.set({
        name: AUTH_SESSION_COOKIE,
        value: await encrypt(parsed)
    })
    
}