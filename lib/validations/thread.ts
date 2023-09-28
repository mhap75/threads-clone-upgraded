import * as z from "zod";

export const ThreadValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, "Name should be at least 3 characters")
    .max(1000, "Name should be maximum of 1000 characters"),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  thread: z
    .string()
    .nonempty()
    .min(3, "Name should be at least 3 characters")
    .max(1000, "Name should be maximum of 1000 characters"),
});
