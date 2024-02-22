import { z } from 'zod';

export const registerActionSchema = z.object({
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

export type RegisterActionFormData = {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export type RegisterActionFormErrors = z.typeToFlattenedError<RegisterActionFormData>