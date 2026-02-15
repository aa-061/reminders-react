import "./Layout.css";
import { useStore } from "@tanstack/react-store";
import { type ReactNode, useEffect, useState } from "react";
import ToastContainer from "@/components/common/ToastContainer";
import Footer from "@/components/layout/footer/Footer";
import MobileNav from "@/components/layout/mobile-nav/MobileNav";
import Navbar from "@/components/layout/navbar/Navbar";
import { themeStore } from "@/store";
import type { TTheme } from "@/types";

export default ({ children }: { children: ReactNode }) => {
  const theme = useStore(themeStore);

  useEffect(() => {
    let themeToUse: TTheme = "light";

    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      themeToUse = (savedTheme as TTheme) || (prefersDark ? "dark" : "light");
    }

    themeStore.setState(themeToUse);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="Layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileNav />
      <ToastContainer />
      {/* <TanStackDevtools
        config={{
          position: "bottom-right",
        }}
        plugins={[
          {
            name: "Tanstack Router",
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      /> */}
    </div>
  );
};
