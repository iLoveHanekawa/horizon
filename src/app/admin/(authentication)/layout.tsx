import { APP_URL } from "@/app/config";
import { getCurrentUser } from "@/auth/utils"
import { redirect } from "next/navigation";
import React from "react";

type RegisterProps = Readonly<{ children: React.ReactNode}>

export default async function Layout({ children }: RegisterProps): Promise<JSX.Element> {
    const user = await getCurrentUser();
    if(user) redirect('/admin');
    return <div>{children}</div>
}