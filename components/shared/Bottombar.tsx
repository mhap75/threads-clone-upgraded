"use client";

import { sidebarLinks } from "@/constants";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Bottombar = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { userId } = useAuth();

  return (
    <section className="bottombar">
      <div className="bottombar_container">
        {sidebarLinks.map(({ route, label, imgURL }) => {
          const isActive =
            (pathname.includes(route) && route.length > 1) ||
            pathname === route;

          if (route === "/profile") route = `${route}/${userId}`;

          return (
            <Link
              href={route}
              key={label}
              className={`bottombar_link transition hover:bg-primary-500/80 ${
                isActive && "bg-primary-500"
              }`}
            >
              <Image src={imgURL} alt={label} width={24} height={24} />
              <p className="text-subtle-medium text-light-1 max-sm:hidden">
                {label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
export default Bottombar;
