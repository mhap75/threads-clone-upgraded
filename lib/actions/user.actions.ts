"use server";

import { connectDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";
import User from "../models/user.model";

export async function updateUser(
  userId: string,
  username: string,
  name: string,
  bio: string,
  image: string,
  path: string,
): Promise<void> {
  try {
    await connectDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Failed to insert/update user: ${err.message}`);
  }
}

export async function getUser(userId: string) {
  try {
    await connectDB();

    return await User.findOne({ id: userId });
  } catch (err: any) {
    throw new Error(`Failed to get user data: ${err.message}`);
  }
}
