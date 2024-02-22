'use client'
import { register } from "@/actions";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormButton } from "@/app/components/FormButton";
import { Errors } from "@/components/ui/error";

export default function Page() {
    
    const [state, dispatch] = useFormState(register, { errors: {
        fieldErrors: {},
        formErrors: []
    } });
    return <main className="horizon-page items-center">
        <section className="mt-24 px-20 w-1/3">
            <h1 className="text-3xl font-bold">Register</h1>
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="firstname">First name</Label>
                    <Input data-testid="firstname" id="firstname" type={'text'} name="firstname" placeholder="John" />
                    <Errors errors={state.errors.fieldErrors.firstname} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input data-testid="lastname" id="lastname" type={'text'} name="lastname" placeholder="Doe" />
                    <Errors errors={state.errors.fieldErrors.lastname} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input data-testid="email" id="email" type={'email'} name="email" placeholder="john.doe@example.com" />
                    <Errors errors={state.errors.fieldErrors.email} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input data-testid="password" id="password" type={'password'} name="password" />
                    <Errors errors={state.errors.fieldErrors.password} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="confirm-password">Confirm password</Label>
                    <Input data-testid="confirm-password" id="confirm-password" type={'password'} name="confirm-password" />
                    <Errors errors={state.errors.fieldErrors.confirmPassword} />
                </div>
                <FormButton textContent={'Register'} />
            </form>
        </section>
    </main>
}


