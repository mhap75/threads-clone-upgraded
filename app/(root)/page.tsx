import ThreadCard from "@/components/card/ThreadCard";
import { getPosts } from "@/lib/actions/thread.actions";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const { posts, isNext } = await getPosts();
  const user = await currentUser();

  if (!user) return null;

  return (
    <main>
      <h1 className="head-text text-left">Home</h1>
      <section className="flexCol mt-9 gap-10">
        {posts.length === 0 ? (
          <p className="no-result">No threads found!</p>
        ) : (
          <>
            {posts.map(
              ({
                _id,
                parentId,
                text,
                author,
                community,
                createdAt,
                children,
              }) => (
                <ThreadCard
                  key={_id}
                  id={_id}
                  currentUserId={user.id}
                  parentId={parentId}
                  content={text}
                  author={author}
                  community={community}
                  createdAt={createdAt}
                  comments={children}
                />
              ),
            )}
          </>
        )}
      </section>
    </main>
  );
}
