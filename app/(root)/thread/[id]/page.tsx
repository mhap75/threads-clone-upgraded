import ThreadCard from "@/components/card/ThreadCard";
import Comment from "@/components/forms/Comment";
import { getPost } from "@/lib/actions/thread.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Thread = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!id || !user) return null;

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const thread = await getPost(id);

  return (
    <section className="relative">
      <div>
        <ThreadCard
          id={thread._id}
          currentUserId={user.id}
          parentId={thread.parentId}
          content={thread.text}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      </div>

      <div className="mt-7">
        <Comment
          threadId={thread.id}
          currentUserId={userInfo._id}
          currentUserImg={userInfo.image}
        />
      </div>

      <div className="mt-10">
        {thread.children.map((child: any) => (
          <ThreadCard
            key={child._id}
            id={child._id}
            currentUserId={child.id}
            parentId={child.parentId}
            content={child.text}
            author={child.author}
            community={child.community}
            createdAt={child.createdAt}
            comments={child.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
};
export default Thread;
