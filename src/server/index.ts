import { userRouter } from "./routers/user";
import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  helloWorld: publicProcedure.query(async () => {
    return "Hello World!";
    user: userRouter;
  }),
});

export type AppRouter = typeof appRouter;
