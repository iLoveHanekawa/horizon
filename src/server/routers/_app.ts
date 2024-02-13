import { z } from 'zod';
import { procedure, router } from '../trpc';
import { userRouter } from './user';

export const appRouter = router({
    hello: procedure.input(z.object({ text: z.string() })).query((opts) => {
        return {
            greeting: `hello ${opts.input.text}`
        }
    }),
    user: userRouter
});

export type AppRouter = typeof appRouter;
