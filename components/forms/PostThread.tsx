"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { postThread } from "@/lib/actions/thread.actions";
import { ThreadValidation } from "@/lib/validations/thread";
import { useOrganization } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

const PostThread = ({ userId }: { userId: string }) => {
  const path = usePathname();
  const { push } = useRouter();
  const { organization } = useOrganization();

  const form = useForm({
    resolver: zodResolver(ThreadValidation),
    defaultValues: {
      thread: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
    try {
      await postThread({
        text: values.thread,
        author: userId,
        path,
        communityId: organization ? organization.id : null,
      });

      push("/");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flexCol justify-start"
      >
        <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flexCol mt-10 w-full gap-3">
              <FormLabel className="account-form_label">Content</FormLabel>
              <FormControl className="no-focus border border-dark-4 bg-dark-3 text-light-1">
                <Textarea
                  rows={15}
                  placeholder="Tell everyone what you are thinking about"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription
                className={`text-right ${
                  field.value.length > 1000 ? "text-logout-btn" : ""
                }`}
              >
                {field.value.length}/1000
              </FormDescription>
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-5 bg-primary-500">
          Post
        </Button>
      </form>
    </Form>
  );
};
export default PostThread;
