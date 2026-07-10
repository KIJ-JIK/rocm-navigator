import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROCm Navigator | Autonomous CUDA-to-ROCm AI Migration",
  description: "Enterprise multi-agent autonomous engineering pipeline to migrate, validate, and optimize NVIDIA CUDA workloads for AMD Instinct Accelerators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300..700;1,300..700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
        <main className="flex-1 flex flex-col">{children}</main>
      </body>
    </html>
  );
}

