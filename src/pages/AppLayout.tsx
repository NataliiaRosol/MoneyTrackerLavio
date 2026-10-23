import { Outlet } from "react-router-dom";
import { Header } from "@/widgets/header";
import { Sidebar } from "@/widgets/sidebar";

function AppLayout() {
  return (
    <div className="flex min-h-dvh w-full bg-white">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
