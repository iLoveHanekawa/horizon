'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache';
import { genSalt, hash } from 'bcrypt';
import { encrypt } from './auth/utils';
import { AUTH_COOKIE_EXPIRATION_IN_MILISECONDS, AUTH_SESSION_COOKIE, SALT_ROUNDS } from './auth/constants';
import { cookies } from 'next/headers';

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
    try {
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
        return {
            message: 'Admin created successful.'
        }
    } catch (error) {
        console.log(error);
        return {
            message: 'Admin creation failed.'
        }
    }
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

    try {
        const data = schema.parse({
            email: formData.get('email'),
            password: formData.get('password')
        });
        const salt = await genSalt(SALT_ROUNDS);
        const hashedPass = await hash(data.password, salt);
        const admin = await prisma?.user.findFirst({
            where: {
                email: data.email
            }
        });
        if(admin?.password === hashedPass) {
            const signedJWT = await encrypt({ userId: admin.id });
            const expiration = new Date(Date.now() + AUTH_COOKIE_EXPIRATION_IN_MILISECONDS);
            cookies().set(AUTH_SESSION_COOKIE, signedJWT, { expires: expiration, httpOnly: true})
        }
        return {
            message: "Logged the user in successfully."
        }
    } catch (error) {
        console.log(error);
        return {
            message: "Failed to log user in."
        };
    }
} 