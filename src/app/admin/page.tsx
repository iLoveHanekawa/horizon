import { getSession } from "@/auth/utils"
import { AdminPersonalForm } from "./components/AdminPersonalForm"
import prisma from "@/db";
import { redirect } from "next/navigation";

export default async function Page() {

    const session = await getSession();

    const user = await prisma.user.findUnique({
        where: {
            id: session?.userId
        }
    })

    if(!user) redirect('/login');

    return <main className="horizon-page items-start w-2/4">
        <section className="px-20 w-10/12">
            <div className="flex gap-2 flex-col">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1> 
                <h2 className="text-md font-semibold text-gray-300 mt-3">Personal information</h2>
            </div>
            <AdminPersonalForm user={user} />
        </section>
    </main>
}