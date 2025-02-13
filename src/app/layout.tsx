import type { Metadata } from "next";
import type { JSX, ReactNode } from "react";

export const metadata: Metadata = {
  title: "Scratch",
  description: "By ARNNVV",
};

export default ({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element => (
  <html lang="en">
    <body>{children}</body>
  </html>
);
