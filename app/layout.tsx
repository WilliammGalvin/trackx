import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrackX",
  description: "Software Engineering Project",
};

type Link = {
  name: string;
  href: string;
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links: Link[] = [
    { name: "Inventory", href: "/inventory" },
    { name: "Orders", href: "/orders" },
    { name: "Analytics", href: "/analytics" },
    { name: "Settings", href: "/settings" },
  ];

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-full h-full flex flex-col">
        <nav className="w-full flex justify-between p-4 border-b border-gray-200">
          <a href="/">TrackX</a>
          <ul className="flex gap-4">
            {links.map((link) => (
              <li key={link.name}>
                <a href={link.href}>{link.name}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex-1 w-full h-full p-4">{children}</div>
      </body>
    </html>
  );
}
