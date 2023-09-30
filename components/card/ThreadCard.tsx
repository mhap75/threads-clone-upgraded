import { formatDateString } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ThreadCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  author: {
    name: string;
    image: string;
    id: string;
  };
  content: string;
  community:
    | {
        name: string;
        image: string;
        id: string;
      }[]
    | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  currentUserId,
  parentId,
  content,
  author,
  community,
  createdAt,
  comments,
  isComment,
}) => {
  return (
    <article
      className={`flexCol w-full rounded-xl ${
        isComment ? "px-0 xs:px-7" : "bg-dark-2 p-7"
      }`}
    >
      <div className="flexCol items-start justify-between">
        <div className="flex w-full flex-1 gap-4">
          <div className="flexCol items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt={author.name}
                fill
                className="rounded-full"
              />
            </Link>
            <div className="thread-card_bar" />
          </div>

          <div className="flexCol w-full">
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1">{author.name}</h4>
            </Link>

            <p className="mt-2 text-small-regular text-light-2">{content}</p>

            <div className={`flexCol mt-5 gap-3 ${isComment && "mb-10"}`}>
              <div className="flex gap-3.5">
                {["heart-gray", "reply", "repost", "share"].map((btn) => (
                  <Link
                    href={btn === "reply" ? `/thread/${id}` : "/"}
                    key={btn}
                  >
                    <Image
                      src={`/assets/images/${btn}.svg`}
                      alt="like"
                      width={24}
                      height={24}
                      className="object-contain hover:scale-110"
                    />
                  </Link>
                ))}
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/thread/${id}`}>
                  <p className="mt-1 text-subtle-medium text-gray-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>

        {!isComment && comments.length > 0 && (
          <div className="ml-1 mt-3 flex items-center gap-2">
            {comments.slice(0, 2).map((comment, index) => (
              <Image
                key={index}
                src={comment.author.image}
                alt={`user_${index}`}
                width={24}
                height={24}
                className={`${
                  index !== 0 && "-ml-5"
                } rounded-full object-cover`}
              />
            ))}

            <Link href={`/thread/${id}`}>
              <p className="mt-1 text-subtle-medium text-gray-1">
                {comments.length} repl{comments.length > 1 ? "ies" : "y"}
              </p>
            </Link>
          </div>
        )}
      </div>
      {!isComment && !!community?.length && (
        <Link
          href={`/communities/${community[0].id}`}
          className="mt-5 flex items-center"
        >
          <p className="text-subtle-medium text-gray-1">
            {formatDateString(createdAt)}{" "}
            <span className="text-primary-500">{community[0].name}</span>
          </p>
          <Image
            src={community[0].image}
            alt={community[0].name}
            height={14}
            width={14}
            className="ml-1 rounded-full object-cover"
          />
        </Link>
      )}
    </article>
  );
};
export default ThreadCard;
