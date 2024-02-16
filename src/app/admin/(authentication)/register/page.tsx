'use client'
import { register } from "@/actions";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
    const { pending } = useFormStatus();
    const [state, dispatch] = useFormState(register, { message: '' });
    return <main className="horizon-page items-center">
        <section className="mt-24 px-20">
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="firstname">First name</Label>
                    <Input type={'text'} name="firstname" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input type={'text'} name="lastname" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input type={'email'} name="email" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input type={'password'} name="password" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input type={'password'} name="confirm-password" />
                </div>
                <Button aria-disabled={pending} disabled={pending}>Register</Button>
            </form>
        </section>
    </main>
}