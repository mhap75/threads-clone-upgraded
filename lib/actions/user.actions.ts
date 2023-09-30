"use server";

import Thread from "@/lib/models/thread.model";
import { connectDB } from "@/lib/mongoose";
import { FilterQuery, SortOrder } from "mongoose";
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

export async function getUserPosts(userId: string) {
  try {
    await connectDB();

    // ToDo: Populate Community

    return await User.findOne({ id: userId }).populate({
      path: "threads",
      model: Thread,
      populate: {
        path: "children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: "name image id",
        },
      },
    });
  } catch (err: any) {
    throw new Error(`Failed to get user posts: ${err.message}`);
  }
}

export async function getUsers({
  userId,
  searchQuery = "",
  pageNumber = 1,
  pageSize = 20,
  sort = "desc",
}: {
  userId: string;
  searchQuery?: string;
  pageNumber?: number;
  pageSize?: number;
  sort?: SortOrder;
}) {
  try {
    await connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const regex = new RegExp(searchQuery, "i");

    const query: FilterQuery<typeof User> = {
      id: { $ne: userId },
    };

    if (searchQuery.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sort };

    const userQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);
    const totalUsers = await User.countDocuments(query);
    const users = await userQuery.exec();
    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
  } catch (err: any) {
    throw new Error(`Failed to get users data: ${err.message}`);
  }
}

export async function getUserActivities(userId: string) {
  try {
    await connectDB();

    const userThreads = await Thread.find({ author: userId });

    const childThreadIds = userThreads.reduce(
      (acc, userThread) => acc.concat(userThread.children),
      [],
    );

    // replies
    return await Thread.find({
      _id: { $in: childThreadIds },
      author: { $ne: userId },
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });
  } catch (err: any) {
    throw new Error(`Failed to get user's activities: ${err.message}`);
  }
}
