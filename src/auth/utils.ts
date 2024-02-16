import 'server-only';
import { cookies } from "next/headers"
import { AUTH_COOKIE_EXPIRATION_IN_MILISECONDS, AUTH_SESSION_COOKIE } from "./constants"
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
import { JWT_SECRET } from "./constants"
import prisma from '@/db';
import { NextRequest, NextResponse } from "next/server";

export type HorizonPayload = {
    userId: string
}

export interface HorizonJWTPayload extends JWTPayload {
    userId: string
}

const key = new TextEncoder().encode(JWT_SECRET);

/**
 * Encrypt the payload using JWT.
 * @param payload HorizonPayload
 * @returns Promise<string>
*/
export const encrypt = async(payload: HorizonPayload) => {
    return await new SignJWT(payload).setProtectedHeader({ alg: 'HS256'}).setIssuedAt().setExpirationTime('10 sec from now').sign(key);
}

/**
 * decrypt the input string present in session's value
 * @param input string
 * @returns 
*/
export const decrypt = async (input: string): Promise<HorizonJWTPayload> => {
    const { payload } = await jwtVerify<HorizonPayload>(input, key, {
        algorithms: ['HS256']
    });
    return payload;
}

/**
 * Gets the session data
 * @returns Promise<HorizonJWTPayload>
*/
export const getSession = async() => {
    const session = cookies().get(AUTH_SESSION_COOKIE)?.value;
    if(!session) return null;
    return await decrypt(session);
}

/**
 * Updates the session cookie's expirations
 * @param req NextRequest 
 * @returns Promise<void>
*/
export const updateSession = async (req: NextRequest) => {
    const session = req.cookies.get(AUTH_SESSION_COOKIE)?.value;
    if(!session) return null;
    const parsed = await decrypt(session);
    const expires = new Date(Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS);
    const res = NextResponse.next();
    res.cookies.set({
        name: AUTH_SESSION_COOKIE,
        value: await encrypt(parsed),
        expires,
        httpOnly: true
    });
}

/**
 * Obtain the userId from session
 * @returns 
*/
export const getCurrentUser = async (): Promise<{ firstname: string, lastname: string, email: string } | null> => {
    const data = await getSession();
    if(!data || data.exp! <= Date.now()) {
        return null;
    }
    const admin = await prisma?.user.findFirst({
        where: {
            id: data.userId
        }
    });
    if(!admin) {
        return null;
    }
    else return {
        email: admin.email,
        firstname: admin.firstname,
        lastname: admin.lastname
    };
}