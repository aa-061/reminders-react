import "./Layout.css";
import { ReactNode } from "react";
import Footer from "./footer/Footer";
import MobileNav from "./mobile-nav/MobileNav";
import Navbar from "./navbar/Navbar";

export default ({ children }: { children: ReactNode }) => {
  return (
    <div className="Layout">
      <Navbar />
      <main>{children}</main>
      <Footer />
      <MobileNav />
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
