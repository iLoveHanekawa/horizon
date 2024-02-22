import { z } from 'zod';

export const loginActionSchema = z.object({
    email: z.string({
        invalid_type_error: '{email} is supposed to be a string',
        required_error: 'Email is a required field.'
    }).email(),
    password: z.string({
        invalid_type_error: '{password} is supposed to be a string',
        required_error: 'Password is a required field.'
    })
})

export type LoginActionFormData = {
    email: string;
    password: string;
}

export type LoginActionFormErrors = z.typeToFlattenedError<LoginActionFormData>
