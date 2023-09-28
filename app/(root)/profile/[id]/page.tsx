import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import ProfileHeader from "@/components/shared/ProfileHeader";

const ProfileById = async ({ params: { id } }: { params: { id: string } }) => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await getUser(id);

  if (user.id === id && !userInfo?.onboarded) redirect("/onboarding");
  
  return <section>
    <ProfileHeader
      accountId={userInfo.id}
      authUserId={user.id}
      name={userInfo.name}
      username={userInfo.username}
      imgUrl={userInfo.image}
      bio={userInfo.bio}
    />

    <div className="mt-9">

    </div>
  </section>;
};
export default ProfileById;
