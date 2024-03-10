'use client'

import { ScrollArea } from "@radix-ui/react-scroll-area";

export const SideNav: React.FC<{ children: React.ReactNode}> = ({ children }) => {
    return <div className="px-12">
        <ScrollArea className="flex flex-col">
           { children } 
        </ScrollArea>
    </div>
}