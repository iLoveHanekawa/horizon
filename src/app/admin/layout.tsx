import { Metadata } from "next";
import React from "react"

type LayoutProps = Readonly<{
    children: React.ReactNode
}>

export const metadata: Metadata = {
    title: "Horizon | Admin",
    description: "Admin dashboard to manage the content on Horizon",
};


export default function Layout({ children }: LayoutProps): JSX.Element {
    return <div>
        {children}
    </div>
}