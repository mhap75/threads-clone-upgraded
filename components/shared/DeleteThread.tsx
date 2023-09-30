"use client";

import { Button } from "@/components/ui/button";
import { deleteThread } from "@/lib/actions/thread.actions";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface DeleteThreadProps {
  authorId: string;
  currentUserId: string;
  id: string;
}

const DeleteThread: React.FC<DeleteThreadProps> = ({
  authorId,
  currentUserId,
  id,
}) => {
  const pathname = usePathname();
  const { push } = useRouter();

  const handleDelete = async () => {
    if (authorId !== currentUserId) return;

    try {
      await deleteThread(id, pathname);
      push("/");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Button
      onClick={handleDelete}
      className="float-right mb-5 border border-logout-btn bg-transparent text-logout-btn hover:bg-logout-btn/20 hover:text-light-2"
    >
      Delete
    </Button>
  );
};
export default DeleteThread;
