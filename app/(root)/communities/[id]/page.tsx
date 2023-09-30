import UserCard from "@/components/card/UserCard";
import ProfileHeader from "@/components/shared/ProfileHeader";
import ThreadsTab from "@/components/shared/ThreadsTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { communityTabs } from "@/constants";
import { getCommunityDetails } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";

const CommunityById = async ({
  params: { id },
}: {
  params: { id: string };
}) => {
  const user = await currentUser();

  if (!user) return null;

  const communityInfo = await getCommunityDetails(id);

  return (
    <section>
      <ProfileHeader
        accountId={communityInfo.id}
        authUserId={user.id}
        name={communityInfo.name}
        username={communityInfo.username}
        imgUrl={communityInfo.image}
        bio={communityInfo.bio}
        type="Community"
      />

      <div className="mt-9">
        <Tabs defaultValue="threads" className="w-full">
          <TabsList className="tab">
            {communityTabs.map(({ label, value, icon }) => (
              <TabsTrigger key={label} value={value} className="tab">
                <Image
                  src={icon}
                  alt={label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <p className="max-sm:hidden">{label}</p>
                {label === "Threads" && (
                  <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">
                    {communityInfo?.threads?.length}
                  </p>
                )}
                {label === "Members" && (
                  <p className="text-light-2 text-small-medium">
                    ({communityInfo?.members?.length})
                  </p>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="threads" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityInfo._id}
              accountType="Community"
            />
          </TabsContent>{" "}
          <TabsContent value="members" className="w-full text-light-1">
            <section className="flexCol mt-9 gap-10">
              {communityInfo?.members.map((mem: any) => (
                <UserCard
                  key={mem.id}
                  id={mem.id}
                  name={mem.name}
                  image={mem.image}
                  username={mem.username}
                  type="User"
                />
              ))}
            </section>
          </TabsContent>{" "}
          <TabsContent value="requests" className="w-full text-light-1">
            <ThreadsTab
              currentUserId={user.id}
              accountId={communityInfo._id}
              accountType="Community"
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
export default CommunityById;
