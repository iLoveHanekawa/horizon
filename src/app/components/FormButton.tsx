'use client'

import { useFormStatus } from "react-dom";
import { ButtonLoading } from "@/components/ui/buttonLoading";
import { Button } from "@/components/ui/button";

type FormButtonProps = Readonly<{
    textContent: string
}>

export const FormButton: React.FC<FormButtonProps> = ({ textContent }) => {
    const { pending } = useFormStatus();
    return <>
        { pending? <ButtonLoading />: <Button name="login-submit" className="bg-zinc-800  text-gray-200 duration-300" type={"submit"} aria-disabled={pending} disabled={pending}>{textContent}</Button>}
    </>

}