import 'server-only'
import { z } from 'zod'
import { router, procedure } from '../trpc'
import prisma from '@/db'

export const userRouter = router({
    store: procedure.input(z.object({
        firstname: z.string(),
        lastname: z.string()
    })).mutation(async (req) => {
        try {
            // const { input } = req;
            // const firstname = input.firstname;
            // const lastname = input.lastname;
            // const user = await prisma.user.create({
            //     data: {
            //         firstname,
            //         lastname
            //     }
            // });
            // return user;
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
    }),
    update: procedure.input(z.object({
        firstname: z.string(),
        lastname: z.string(),
        description: z.array(z.string())
    })).mutation(async (req) => {
        const { input } = req;
        const { firstname, lastname, description } = input;
        // retieve from session storage.
        const id = '';
        // await prisma.user.update({
        //     where: {
        //         id
        //     },
        //     data: {
        //         firstname,
        //         lastname,
        //         description
        //     }
        // })
    })
});