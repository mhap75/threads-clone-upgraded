"use server";

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

    const newThread = await Thread.create({
      text,
      author,
      community: null,
    });

    await User.findByIdAndUpdate(author, {
      $push: { threads: newThread._id },
    });

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
