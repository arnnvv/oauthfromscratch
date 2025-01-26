import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Scratch",
  description: "By ARNNVV",
};

export default ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => (
  <html>
    <body>{children}</body>
  </html>
);
