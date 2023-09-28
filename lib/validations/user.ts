import * as z from "zod";

export const UserValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .min(3, "Name should be at least 3 characters")
    .max(30, "Name should be maximum of 30 characters"),
  username: z
    .string()
    .min(3, "Username should be at least 3 characters")
    .max(30, "Username should be maximum of 30" + " characters"),
  bio: z.string().max(1000, "Bio should be less than 1000 characters"),
});
