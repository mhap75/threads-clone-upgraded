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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { UserValidation } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface AccountProfileProps {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
  btnTitle: string;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user, btnTitle }) => {
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("media");
  const pathname = usePathname();
  const { back, push } = useRouter();

  const form = useForm({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile_photo: user?.image || "",
      name: user?.name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  const handleImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (!file.type.includes("image")) return;
      setFiles(Array.from(e.target.files));

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: z.infer<typeof UserValidation>) {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);

    if (hasImageChanged) {
      const imgRes = await startUpload(files);

      if (imgRes && imgRes[0].fileUrl) {
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    //! Keep the function's parameters in order
    await updateUser(
      user.id,
      values.username,
      values.name,
      values.bio,
      values.profile_photo,
      pathname,
    );

    if (pathname === "/profile/edit") {
      back();
    } else {
      push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flexCol justify-start"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label cursor-pointer">
                {field.value ? (
                  <Image
                    width={96}
                    height={96}
                    src={field.value}
                    alt="profile photo"
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    width={24}
                    height={24}
                    src="/assets/images/profile.svg"
                    alt="profile photo"
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload your photo"
                  className="account-form_image-input"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flexCol mt-10 w-full gap-3">
              <FormLabel className="account-form_label">Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Mark Zockerberg"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription
                className={`text-right ${
                  field.value.length > 30 ? "text-logout-btn" : ""
                }`}
              >
                {field.value.length}/30
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flexCol w-full gap-3">
              <FormLabel className="account-form_label">Username</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="threadsuser"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <FormDescription
                className={`text-right ${
                  field.value.length > 30 ? "text-logout-btn" : ""
                }`}
              >
                {field.value.length}/30
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flexCol w-full gap-3">
              <FormLabel className="account-form_label">Bio</FormLabel>
              <FormControl>
                <Textarea
                  rows={10}
                  placeholder="Tell everyone about yourself"
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
        <Button type="submit" className="mt-4 bg-primary-500">
          Submit
        </Button>
      </form>
    </Form>
  );
};
export default AccountProfile;
