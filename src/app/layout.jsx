import { Poppins } from "next/font/google";
import './global.css';
import ClientLayout from "@/components/ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins"
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={poppins.variable} suppressHydrationWarning>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}