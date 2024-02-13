import prisma from "@/db"

export default async function Page() {
    const user = prisma.user.findFirst();
    
    return <div>Register</div>
}