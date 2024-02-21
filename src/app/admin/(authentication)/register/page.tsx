'use client'
import { register } from "@/actions";

import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Page() {
    const { pending } = useFormStatus();
    const [state, dispatch] = useFormState(register, { message: 'waiting' });
    return <main className="horizon-page items-center">
        <section className="mt-24 px-20 w-1/3">
            <h1 className="text-3xl font-bold">Register</h1>
            <form action={dispatch} className="mt-5 flex flex-col gap-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="firstname">First name</Label>
                    <Input id="firstname" type={'text'} name="firstname" placeholder="John" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input id="lastname" type={'text'} name="lastname" placeholder="Doe" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type={'email'} name="email" placeholder="john.doe@example.com" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type={'password'} name="password" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type={'password'} name="confirm-password" />
                </div>
                <Button className="bg-zinc-800  text-gray-200 duration-300" aria-disabled={pending} disabled={pending}>Register</Button>
            </form>
        </section>
    </main>
}


const print = <T extends {}>(x: T) => {
    console.log(x);
}


type MyPromise<T extends {}> = {}


const x: MyPromise<{ greet: string }> = { greet: 'hello' }

