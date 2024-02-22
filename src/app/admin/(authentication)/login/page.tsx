'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { login } from "@/actions"
import { useFormState } from "react-dom"
import { FormButton } from "@/app/components/FormButton"
import { LoginActionFormErrors, type LoginActionFormData } from "@/app/zod/schemas/loginActionSchema"

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
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input data-testid="password" type={'password'} name="password" id="password" />
                </div>
                {/* <div className="test-red-800 text-xs text-red-700 font-medium">{ state.message }</div> */}
                <FormButton textContent={'Login'} />
            </form>
        </section>
    </main>
}
