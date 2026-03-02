import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export const Layout = () => {
  return (
    <div className="font-inter bg-background flex h-screen w-full flex-col overflow-hidden text-white">
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </div>
  );
};
