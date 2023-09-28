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
  community: {
    name: string;
    image: string;
    id: string;
  } | null;
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
      <div className="flex items-start justify-between">
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

            <div className="flexCol mt-5 gap-3">
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
      </div>
    </article>
  );
};
export default ThreadCard;
