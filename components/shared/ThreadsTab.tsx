import ThreadCard from "@/components/card/ThreadCard";
import { getUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

interface ThreadsTabProps {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const ThreadsTab: React.FC<ThreadsTabProps> = async ({
  accountType,
  accountId,
  currentUserId,
}) => {
  let result = await getUserPosts(accountId);

  if (!result) redirect("/");

  return (
    <section className="flexCol mt-9 gap-10">
      {result.threads.map((thread: any) => (
        <ThreadCard
          key={thread._id}
          id={thread._id}
          currentUserId={currentUserId}
          parentId={thread.parentId}
          content={thread.text}
          author={
            accountType === "User"
              ? {
                  name: result.name,
                  image: result.image,
                  id: result.id,
                }
              : {
                  name: thread.author.name,
                  image: thread.author.image,
                  id: thread.author.id,
                }
          }
          community={thread.community} // ToDo
          createdAt={thread.createdAt}
          comments={thread.children}
        />
      ))}
    </section>
  );
};
export default ThreadsTab;
