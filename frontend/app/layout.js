import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Campus360 AI",
  description: "AI powered college notice automation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
      </body>
    </html>
  );
}