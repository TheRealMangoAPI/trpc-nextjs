import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  helloWorld: publicProcedure.query(async () => {
    return "Hello World!";
  }),
});

export type AppRouter = typeof appRouter;
