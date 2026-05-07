import { ReactNode } from "react";
import { redirect } from "next/navigation";

import NavBar from "@/components/NavBar";
import { isAuthenticated } from "@/lib/actions/auth.action";

const Layout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");

  return (
    <div className="root-layout">
      <NavBar />
      {children}
    </div>
  );
};

export default Layout;
