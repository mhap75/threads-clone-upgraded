"use client";

import { sidebarLinks } from "@/constants";
import { SignedIn, SignOutButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LeftSidebar = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="custom-scrollbar leftsidebar">
      <div className="flexCol w-full flex-1 gap-6 px-6">
        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          if (route === "/profile") route = `${route}/${userId}`;

          return (
            <Link
              href={route}
              key={label}
              className={`leftsidebar_link transition hover:bg-primary-500/80 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-light-1 max-lg:hidden">{label}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-10 px-6">
        <SignedIn>
          <SignOutButton signOutCallback={() => push("/sign-in")}>
            <button className="flex gap-4 rounded-lg p-4 transition hover:bg-logout-btn/80">
              <Image
                src="/assets/images/logout.svg"
                alt="logout"
                width={24}
                height={24}
              />
              <p className="text-light-2 max-lg:hidden">Log out</p>
            </button>
          </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};
export default LeftSidebar;
