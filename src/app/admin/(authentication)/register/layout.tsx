import { Metadata } from "next";
import React from "react";

type LayoutProps = Readonly<{ children: React.ReactNode}>

export const metadata: Metadata = {
    title: "Horizon | Register",
    description: "Registration page for the admin of the Horizon portfolio application.",
};

export default async function Layout({ children }: LayoutProps): Promise<JSX.Element> {
    return <>{children}</>
}