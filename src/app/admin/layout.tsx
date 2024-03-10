import { Metadata } from "next";
import React from "react"
import { SideNav } from "../components/SideNav";
import Link from "next/link";

type LayoutProps = Readonly<{
    children: React.ReactNode
}>

export const metadata: Metadata = {
    title: "Horizon | Admin",
    description: "Admin dashboard to manage the content on Horizon",
};


export default function Layout({ children }: LayoutProps): JSX.Element {
    return <div className="flex mt-12 bg-black pt-12">
        <SideNav>
            <h3 className="px-2 py-1 mb-1 text-sm text-white font-semibold">Admin Dashboard</h3>
            <Link className="text-gray-400 text-sm px-2 py-1 hover:underline" href={"/admin"}>Personal information</Link>
        </SideNav>
        {children}
    </div>
}