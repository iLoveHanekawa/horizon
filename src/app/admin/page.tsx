import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export default function Page() {
    return <main className="horizon-page items-start">
        <section className="mt-24 px-20">
            <div className="flex gap-2 flex-col">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1> 
                <h2 className="text-md font-semibold text-gray-300 mt-3">Personal information</h2>
            </div>
            <form className="mt-5">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="firstname">First name</Label>
                    <Input type="text" id="firstname" placeholder="First name" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="lastname">Last name</Label>
                    <Input type="text" id="lastname" placeholder="Last name" />
                </div>
                <div className="grid w-full max-w-sm items-center gap-1.5 mt-4">
                    <Label htmlFor="description">Description</Label>
                    <Textarea />
                </div>
            </form>
        </section>
    </main>
}