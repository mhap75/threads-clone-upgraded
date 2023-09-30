import UserCard from "@/components/card/UserCard";
import { getUser, getUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Search = async () => {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await getUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const { users, isNext } = await getUsers({
    userId: user.id,
    searchQuery: "",
    pageNumber: 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      {/* Searchbar */}

      <div className="flexCol mt-14 gap-9">
        {users.length === 0 ? (
          <p className="no-result">No users found!</p>
        ) : (
          <>
            {users.map(({ id, name, username, image }) => (
              <UserCard
                key={id}
                id={id}
                name={name}
                username={username}
                image={image}
                type="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
};
export default Search;
