import Providers from "@/Providers";
import { Inter } from "next/font/google";
import "../globals.css";

export const metadata = {
  title: "Threads",
  description:
    "Connect with your nearest people in your network with the most powerful social network",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en">
        <body
          className={`${inter.className} flexCenter min-h-screenAdaptable w-full bg-dark-1 py-4`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
