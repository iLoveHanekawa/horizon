'use client'

import { logout } from "@/actions"
import { useFormState, useFormStatus } from "react-dom"

export const LogoutForm: React.FC = () => {
    const [state, dispatch] = useFormState(logout, { message: '' });
    const { pending } = useFormStatus();
    return <form action={dispatch}>
        <button className="hover:text-gray-200 transition-colors duration-300" aria-disabled={pending} disabled={pending}>Log out</button>
    </form>
}