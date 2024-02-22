'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { login } from "@/actions"
import { useFormState } from "react-dom"
import { FormButton } from "@/app/components/FormButton"
import { Errors } from "@/components/ui/error"

export default function Page(): JSX.Element {
    const [state, dispatch] = useFormState(login, { errors: {
        fieldErrors: {},
        formErrors: []
    } });
    return <main className="horizon-page items-center">
        <section className="px-20 mt-48 w-1/3">
            <h1 className="text-3xl font-bold">Login</h1>
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input data-testid="email" type={'email'} name="email" id="email" placeholder="john.doe@example.com" />
                    <Errors errors={state.errors.fieldErrors.email} />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input data-testid="password" type={'password'} name="password" id="password" />
                    <Errors errors={state.errors.fieldErrors.password} />
                </div>
                <FormButton textContent={'Login'} />
            </form>
        </section>
    </main>
}
