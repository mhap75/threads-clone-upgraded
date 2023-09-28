import { OrganizationSwitcher, SignedIn, SignOutButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";
import Link from "next/link";

const Topbar = () => {
  return (
    <nav className="topbar">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/assets/images/logo-dark.svg"
          width={28}
          height={28}
          alt="home"
          className="texh"
        />
        <p className="text-heading3-bold text-light-1 max-xs:hidden">Threads</p>
      </Link>

      <div className="flex items-center gap-1">
        <div className="md:hidden">
          <SignedIn>
            <SignOutButton>
              <button className="flex">
                <Image
                  src="/assets/images/logout.svg"
                  alt="logout"
                  width={24}
                  height={24}
                />
              </button>
            </SignOutButton>
          </SignedIn>
        </div>

        <OrganizationSwitcher
          appearance={{
            baseTheme: dark,
            elements: {
              organizationSwitcherTrigger: "py-2 px-4",
            },
          }}
        />
      </div>
    </nav>
  );
};
export default Topbar;
