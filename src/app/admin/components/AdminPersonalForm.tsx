'use client'

import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { User } from "@prisma/client"

export const AdminPersonalForm: React.FC<{ user: User }> = ({ user }) => {
    return <form className="mt-5 flex flex-col gap-4">
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="firstname">First name</Label>
        <Input className="w-full" type="text" id="firstname" name="firstname" placeholder="First name" defaultValue={user.firstname} />
    </div>
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="lastname">Last name</Label>
        <Input type="text" id="lastname" name="lastname" defaultValue={user.lastname} placeholder="Last name" />
    </div>
    <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea name="description" />
    </div>
    <Button type="button" className="bg-zinc-800">Add paragraph</Button>
    <Button className="bg-zinc-800  text-gray-200 duration-300" type="submit">Save</Button>
</form>
}