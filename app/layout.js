import { SupportProvider } from "@/app/_context/SupportContext";
import "@/app/_styles/globals.css";
import { Nunito } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./_context/AuthContext";

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Swift Support",
  description:
    "Enhance your customer support with our intelligent chatbot. Deliver quick, personalized assistance, streamline interactions, and keep your customers satisfied around the clock.",
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <body className={nunito.className}>
          <NextTopLoader showSpinner={false} color="#BE75FF" />
          <ToastContainer />
          <SupportProvider>{children}</SupportProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
