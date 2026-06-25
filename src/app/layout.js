import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/shared/Footer";
import { getSession } from "@/lib/auth-session";
import { redirect } from "next/navigation";

export const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "LifeVault — Share Your Life Lessons",
  description: "Collect and share wisdom that matters.",
};
export default async function RootLayout({ children }) {

  const session = await getSession();
 

  // ✅ suspended check
  if (session.user?.suspended === true) {
    redirect("/suspended");
  }
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} dark`}
      suppressHydrationWarning
    >
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
