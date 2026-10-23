import { Outlet } from "react-router-dom";
import { Sidebar } from "@/widgets/sidebar";

function AppLayout() {
  return (
    <div className="flex min-h-dvh w-full bg-white">
      <Sidebar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
