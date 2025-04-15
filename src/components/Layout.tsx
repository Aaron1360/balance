import { Outlet } from "react-router-dom"; // Outlet for page-specific content
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Header from "./report/Header";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Header></Header>
          </div>
        </header>
        {/* Page-specific content will be rendered here */}
        <div className="flex flex-1 flex-col justify-center gap-4 m-4">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
