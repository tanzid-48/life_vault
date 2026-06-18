import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "sonner";
import Footer from "@/components/shared/Footer";


const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "LifeVault — Share Your Life Lessons",
  description: "Collect and share wisdom that matters.",
};

export default function RootLayout({ children }) {
  return (
    <html 
    className="dark"
    lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        <Navbar />
        <main>{children}</main>
          <Footer />  
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}