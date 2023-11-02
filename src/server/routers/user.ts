import { db } from "@/lib/db";
import { router, publicProcedure } from "@trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const GetType = ["ID", "EMAIL", "NAME"] as const;

const updateUserInput = z.object({
  userId: z.string(),
  email: z.string().optional(),
  name: z.string().optional(),
  password: z.string().optional(),
  image: z.string().optional(),
  role: z.enum(["USER", "ADMIN", "BANNED"]).optional(),
});

const registerUserInput = z.object({
  email: z.string(),
  username: z.string(),
  name: z.string(),
  password: z.string(),
});

export const userRouter = router({
  getUser: publicProcedure
    .input(z.object({ getType: z.enum(GetType), value: z.string() }))
    .query(async ({ input }) => {
      const { getType, value } = input;
      let result;

      if (getType === "ID") {
        result = await db.user
          .findUnique({
            where: { id: value },
          })
          .catch((e: any) => {
            console.log(e?.message);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              cause: e?.message,
            });
          });
      } else if (getType === "EMAIL") {
        result = await db.user
          .findUnique({
            where: { email: value },
          })
          .catch((e: any) => {
            console.log(e?.message);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              cause: e?.message,
            });
          });
      } else if (getType === "NAME") {
        result = await db.user
          .findUnique({
            where: { name: value },
          })
          .catch((e: any) => {
            console.log(e?.message);
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              cause: e?.message,
            });
          });
      }

      if (!result) throw new TRPCError({ code: "NOT_FOUND" });

      return result;
    }),

  getAllUsers: publicProcedure.query(async () => {
    const users = await db.user.findMany().catch((e: any) => {
      console.log(e?.message);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        cause: e?.message,
      });
    });

    return users;
  }),

  updateUser: publicProcedure
    .input(updateUserInput)
    .mutation(async ({ input }) => {
      const { userId, ...updatedFields } = input;

      const existingUser = await db.user
        .findUnique({
          where: { id: userId },
        })
        .catch((e: any) => {
          console.log(e?.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: e?.message,
          });
        });

      if (!existingUser)
        throw new TRPCError({
          code: "NOT_FOUND",
          cause: "No user with the given ID was found.",
        });

      const updatedUser = await db.user
        .update({
          where: { id: userId },
          data: updatedFields,
        })
        .catch((e: any) => {
          console.log(e?.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: e?.message,
          });
        });

      return updatedUser;
    }),

  registerUser: publicProcedure
    .input(registerUserInput)
    .mutation(async ({ input }) => {
      const { email, name, password } = input;

      const existingUserWithEmail = await db.user.findUnique({
        where: { email },
      });

      const existingUserWithUsername = await db.user.findUnique({
        where: { name },
      });

      if (existingUserWithEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Email is already in use.",
        });
      }

      if (existingUserWithUsername) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          cause: "Username is already in use.",
        });
      }

      const newUser = await db.user
        .create({
          data: {
            email: email,
            name: name,
            password: password,
          },
        })
        .catch((e: any) => {
          console.log(e?.message);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            cause: e?.message,
          });
        });

      return newUser;
    }),
});
