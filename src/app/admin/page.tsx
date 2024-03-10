import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AdminPersonalForm } from "./components/AdminPersonalForm"

export default function Page() {
    return <main className="horizon-page items-start w-2/4">
        <section className="px-20 w-10/12">
            <div className="flex gap-2 flex-col">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1> 
                <h2 className="text-md font-semibold text-gray-300 mt-3">Personal information</h2>
            </div>
            <AdminPersonalForm />
        </section>
    </main>
}