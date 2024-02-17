'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache';
import { genSalt, hash, compare } from 'bcrypt';
import prisma from './db';
import { encrypt } from './auth/utils';
import { AUTH_COOKIE_EXPIRATION_IN_MILISECONDS, AUTH_SESSION_COOKIE, SALT_ROUNDS } from './auth/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function register(prevState: any, formData: FormData): Promise<{message: string}> {
    const schema = z.object({
        firstname: z.string({
            invalid_type_error: '{firstname} is supposed to be a string',
            required_error: 'First name is a required field.'
        }).min(2),
        lastname: z.string({
            invalid_type_error: '{lastname} is supposed to be a string',
            required_error: 'Last name is a required field.'
        }).min(2),
        email: z.string({
            invalid_type_error: '{email} is supposed to be a string',
            required_error: 'Email is a required field.'
        }).email(),
        password: z.string({
            invalid_type_error: '{password} is supposed to be a string',
            required_error: 'Password is a required field.'
        }).min(8),
        confirmPassword: z.string({
            invalid_type_error: '{confirm-password} is supposed to be a string',
            required_error: 'Confirm Password is a required field.'
        }).min(8)
    }).refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match!',
        path: ["confirmPassword"]
    });
    const data = schema.parse({
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirm-password')
    });
    const salt = await genSalt(SALT_ROUNDS);
    const hashedPass = await hash(data.password, salt);
    const admin = await prisma?.user.create({
        data: {
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email,
            password: hashedPass
        }
    });
    const signedJWT = await encrypt({ userId: admin?.id! });
    const expiration = new Date(Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS);
    cookies().set(AUTH_SESSION_COOKIE, signedJWT, { expires: expiration, httpOnly: true})
    redirect('/admin');
}

export async function login(prevState: any, formData: FormData): Promise<{ message: string }> {
    const schema = z.object({
        email: z.string({
            invalid_type_error: '{email} is supposed to be a string',
            required_error: 'Email is a required field.'
        }).email(),
        password: z.string({
            invalid_type_error: '{password} is supposed to be a string',
            required_error: 'Password is a required field.'
        })
    });
    const data = schema.parse({
        email: formData.get('email'),
        password: formData.get('password')
    });
    const admin = await prisma?.user.findFirst({
        where: {
            email: data.email
        }
    });
    if(!admin) {
        return {
            message: 'User not found! Please register.'
        }
    }
    const isPassMatched = await compare(data.password, admin?.password);
    if(isPassMatched) {
        const signedJWT = await encrypt({ userId: admin.id });
        const expiration = new Date(Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS);
        cookies().set(AUTH_SESSION_COOKIE, signedJWT, { expires: expiration, httpOnly: true})
        redirect('/admin');
    }
    else {
        return {
            message: "Incorrect password or username!"
        }
    }
} 

export const logout = async (prevState: any, formData: FormData) => {
    cookies().set(AUTH_SESSION_COOKIE, '', { expires: new Date(0), httpOnly: true});
    redirect('/admin/login');
}