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
        <section className="mt-24 px-20">
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type={'email'} name="email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type={'password'} name="password" />
                </div>
                <Button aria-disabled={pending} disabled={pending}>Login</Button>
            </form>
        </section>
    </main>
}