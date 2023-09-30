import CommunityCard from "@/components/card/CommunityCard";
import { getCommunities } from "@/lib/actions/community.actions";
import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Communities = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await getUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await getCommunities({});

  return (
    <section>
      <h1 className="head-text mb-10">Communities</h1>

      <section className="mt-9 flex flex-wrap gap-4">
        {result.communities.length === 0 ? (
          <p className="no-result">No Result</p>
        ) : (
          <>
            {result.communities.map((community) => (
              <CommunityCard
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                image={community.image}
                bio={community.bio}
                members={community.members}
              />
            ))}
          </>
        )}
      </section>
    </section>
  );
};
export default Communities;
