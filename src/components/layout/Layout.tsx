import { Outlet } from "react-router-dom"; // Outlet for page-specific content
import { AppSidebar } from "@/components/app-sidebar/AppSidebar";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Toaster } from "sonner";
import Header from "./Header";

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
        <SidebarContent />
      </SidebarInset>
      <Toaster theme="dark" richColors/>
    </SidebarProvider>
  );
}

function SidebarContent() {
  const { state: sidebarState } = useSidebar();
  return (
    <>
      {/* Page-specific content will be rendered here */}
      <div className="flex flex-1 flex-col justify-center gap-4 px-1 w-full">
        <Outlet context={{ sidebarState }} />
      </div>
    </>
  );
}
