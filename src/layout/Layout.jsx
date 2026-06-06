import { Navbar } from "../components/Navbar";
import { ToastContainer } from "react-toastify";
import { Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

export const Layout = () => {
  return (
    <div
      style={{
        backgroundImage: `
                linear-gradient(#555555 0.01px, transparent 0.5px),
                linear-gradient(90deg, #555555 0.01px, transparent 0.5px),
                linear-gradient(#000000, #000000)
              `,
        backgroundSize: "50px 50px, 50px 50px",
        backgroundPosition: "0 0, 0 0",
        backgroundRepeat: "repeat, repeat",
      }}
      className="font-inter flex h-screen w-full flex-col overflow-hidden bg-[#000000] text-white"
    >
      <Analytics />
      <SpeedInsights />
      <Navbar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 h-60 w-90 rounded-full bg-white/40 blur-[150px]" />
          <div className="absolute -top-32 -right-32 h-60 w-90 rounded-full bg-white/40 blur-[150px]" />
          <div className="absolute -bottom-32 -left-32 h-60 w-90 rounded-full bg-white/40 blur-[150px]" />
          <div className="absolute -right-32 -bottom-32 h-60 w-90 rounded-full bg-white/40 blur-[150px]" />
        </div>
        <Outlet />
      </main>
      <ToastContainer position="top-right" theme="light" />
    </div>
  );
};
