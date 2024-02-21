'use client'

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { login } from "@/actions"
import { useFormState, useFormStatus } from "react-dom"

export default function Page(): JSX.Element {
    const [state, dispatch] = useFormState(login, { message: '' });
    const { pending } = useFormStatus();
    return <main className="horizon-page items-center">
        <section className="px-20 mt-48 w-1/3">
            <h1 className="text-3xl font-bold">Login</h1>
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type={'email'} name="email" id="email" placeholder="john.doe@example.com" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type={'password'} name="password" id="password" />
                </div>
                <Button name="login-submit" className="bg-zinc-800  text-gray-200 duration-300" type={"submit"} aria-disabled={pending} disabled={pending}>Login</Button>
            </form>
        </section>
    </main>
}
