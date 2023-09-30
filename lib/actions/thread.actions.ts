"use server";

import Community from "@/lib/models/community.model";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import { connectDB } from "@/lib/mongoose";
import { revalidatePath } from "next/cache";

interface postThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function postThread({
  communityId,
  author,
  text,
  path,
}: postThreadParams) {
  try {
    await connectDB();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const newThread = await Thread.create({
      text,
      author,
      community: communityIdObject,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { threads: newThread._id },
      });
    }

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(`Error in adding post: ${err.message}`);
  }
}

export async function getPosts(pageNumber = 1, pageSize = 20) {
  const skipAmount = (pageNumber - 1) * pageSize;

  try {
    await connectDB();

    const postQuery = Thread.find({
      parentId: { $in: [null, undefined] },
    })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate({ path: "author", model: User })
      .populate({ path: "community", model: Community })
      .populate({
        path: "children",
        populate: {
          path: "author",
          model: User,
          select: "_id name parentId image",
        },
      });

    const totalPosts = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const posts = await postQuery.exec();

    const isNext = totalPosts > skipAmount + posts.length;

    return { posts, isNext };
  } catch (err: any) {
    throw new Error(`Error in fetching posts: ${err.message}`);
  }
}

export async function getPost(id: string) {
  try {
    await connectDB();
    // ToDo: Populate Community
    const thread = await Thread.findById(id)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return thread;
  } catch (err: any) {
    throw new Error(`Error in fetching post ${id}: ${err.message}`);
  }
}

export async function addComment(
  threadId: string,
  comment: string,
  userId: string,
  path: string,
) {
  try {
    await connectDB();

    const originalThread = await Thread.findById(threadId);

    if (!originalThread) throw new Error("Thread not found");

    const commentThread = new Thread({
      text: comment,
      author: userId,
      parentId: threadId,
    });
    const savedComment = await commentThread.save();
    originalThread.children.push(savedComment._id);
    await originalThread.save();

    revalidatePath(path);
  } catch (err: any) {
    throw new Error(
      `Error in adding comment for thread ${threadId}: ${err.message}`,
    );
  }
}

async function fetchAllChildThreads(threadId: string): Promise<any[]> {
  const childThreads = await Thread.find({ parentId: threadId });

  const descendantThreads = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    await connectDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined),
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()), // Use optional chaining to handle possible undefined values
        mainThread.community?._id?.toString(),
      ].filter((id) => id !== undefined),
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } },
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } },
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
