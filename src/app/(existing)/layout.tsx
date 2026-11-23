import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Feminine Sales Engine | To Living Free",

  description:
    "Build a business that creates demand, attracts premium clients, and sells with greater ease. Explore the complete Feminine Sales Engine experience by Jessica Caver Lindholm.",

  metadataBase: new URL("https://tolivingfree.com"),

  alternates: {
    canonical: "/fse-experience",
  },

  openGraph: {
    title: "Feminine Sales Engine",
    description:
      "Build the business that sells for you.",

    url: "https://tolivingfree.com/fse-experience",

    siteName: "To Living Free",

    type: "website",

    images: [
      {
        url: "/images/fse-share.png", // change to your actual filename
        width: 1200,
        height: 630,
        alt: "Feminine Sales Engine",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Feminine Sales Engine",
    description: "Build the business that sells for you.",
    images: ["/images/fse-share.png"], // same filename
  },

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}