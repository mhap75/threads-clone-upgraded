import { getUser, getUserActivities } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const Activity = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getUserActivities(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <div className="flexCol mt-10 gap-5">
        {activity.length > 0 ? (
          <>
            {activity.map(({ _id, parentId, author }) => (
              <Link key={_id} href={`/thread/${parentId}`}>
                <article className="activity-card">
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">{author.name}</span>{" "}
                    replied to your comment
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="no-result">No activities yet</p>
        )}
      </div>
    </section>
  );
};
export default Activity;
