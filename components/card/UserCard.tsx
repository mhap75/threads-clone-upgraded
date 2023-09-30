"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface UserCardProps {
  id: string;
  name: string;
  image: string;
  username: string;
  type: string;
}

const UserCard: React.FC<UserCardProps> = ({
  id,
  type,
  image,
  name,
  username,
}) => {
  const { push } = useRouter();

  return (
    <article className="user-card">
      <div className="user-card_avatar">
        <Image
          src={image}
          alt={name}
          width={48}
          height={48}
          className="rounded-full"
        />

        <div className="flex-1 text-ellipsis">
          <h4 className="text-base-semibold text-light-1">{name}</h4>
          <p className="text-small-medium text-gray-1">@{username}</p>
        </div>
      </div>

      <Button
        className="user-card_btn hover:!bg-opacity-50"
        onClick={() => push(`/profile/${id}`)}
      >
        View
      </Button>
    </article>
  );
};
export default UserCard;
