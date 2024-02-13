import { z } from 'zod'
import { router, procedure } from '../trpc'
import prisma from '@/db'

export const userRouter = router({
    store: procedure.input(z.object({
        firstname: z.string(),
        lastname: z.string()
    })).mutation(async (req) => {
        try {
            const { input } = req;
            const firstname = input.firstname;
            const lastname = input.lastname;
            const user = prisma.user.create({
                data: {
                    firstname,
                    lastname
                }
            });
            return user;
        } catch (error) {
            console.log(error);
            return null;
        }
        
    }),
    show: procedure.query(async () => {
        try {
            const user = await prisma.user.findFirst();
            return user;
        } catch (error) {
            console.log(error);
            return null;      
        }
    })
});