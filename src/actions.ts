'use server'

import { Schema, ZodError, z } from 'zod'
import { revalidatePath } from 'next/cache';
import { genSalt, hash, compare } from 'bcrypt';
import prisma from './db';
import { encrypt } from './auth/utils';
import { AUTH_COOKIE_EXPIRATION_IN_MILISECONDS, AUTH_SESSION_COOKIE, SALT_ROUNDS } from './auth/constants';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginActionFormData, LoginActionFormErrors, loginActionSchema } from './app/zod/schemas/loginActionSchema';
import { User } from '@prisma/client';

/**
 * Server action to register a new user
 * @param prevState any
 * @param formData FormData
*/
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

/**
 * Server action to log in a registered user.
 * @param prevState any
 * @param formData FormData
 * @returns Promise<{ message: string }>
 */
export async function login(prevState: any, formData: FormData): Promise<{ errors: LoginActionFormErrors }> {
    let data: LoginActionFormData | null = null;
    try {
        data = loginActionSchema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
    } catch (error) {
        if(error instanceof ZodError) {
            const errors: LoginActionFormErrors = error.flatten();
            return {
                errors
            }
        }
    }

    let user: User | null = null;
        
    async function isRegisteredUser(email?: string) {
        if(!email) return false;
        user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if(!user) return false;
        return true;
    }

    async function validateCredentials(password?: string): Promise<boolean> {
        if(!password) return false;
        const passwordMatch = await compare(password, user!.password);
        if (!passwordMatch) {
            return false; // Error message if password does not match
        }
        else return true;
    }

    const isRegisteredAdmin = await isRegisteredUser(data?.email);
    if(!isRegisteredAdmin) return {
        errors: {
            formErrors: [],
            fieldErrors: {
                email: ['The entered email has not been registered yet. Please sign up first.']
            }
        }
    }
    const userHasValidCredentials = await validateCredentials(data?.password);
    if(!userHasValidCredentials) {
        return {
            errors: {
                formErrors: [],
                fieldErrors: {
                    password: ['Incorrect username or password.']
                }
            }
        }
    }
    else {
        const signedJWT = await encrypt({ userId: user!.id });
        const expiration = new Date(Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS);
        cookies().set(AUTH_SESSION_COOKIE, signedJWT, { expires: expiration, httpOnly: true})
        redirect('/admin');
    }
} 

/**
 * Server action to log out a signed in user. 
 * @param prevState any
 * @param formData FormData
 */
export const logout = async (prevState: any, formData: FormData) => {
    cookies().set(AUTH_SESSION_COOKIE, '', { expires: new Date(0), httpOnly: true});
    redirect('/admin/login');
}