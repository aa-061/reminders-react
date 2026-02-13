import "./Layout.css";
import type { ReactNode } from "react";
import Footer from "@/components/layout/footer/Footer";
import MobileNav from "@/components/layout/mobile-nav/MobileNav";
import Navbar from "@/components/layout/navbar/Navbar";
import ToastContainer from "@/components/common/ToastContainer";

export default ({ children }: { children: ReactNode }) => {
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
