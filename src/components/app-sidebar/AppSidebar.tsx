import * as React from "react";
import { Plus, Repeat } from "lucide-react";
import { NavMain } from "./NavDashboard";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import rebootImage from "@/assets/reboot1.png";
import TransactionsDialogBtn from "../transactions-dialog/TransactionsDialogBtn";

// This is sample data.
export const data = {
  user: {
    name: "Aaron Moreno",
    email: "aaronmvilleda@gmail.com",
    avatar: rebootImage,
  },
  navMain: [
    {
      title: "Transacciones",
      url: "/dashboard/transacciones",
      icon: Repeat,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser user={data.user} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuButton
            tooltip="Añadir Transacción"
            className="flex items-center justify-between px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground active:bg-primary focus:bg-primary"
          >
            {/* Wrapper for the Plus icon */}
            <div className="flex-shrink-0 flex items-center justify-start w-8 h-8 bg-primary text-primary-foreground">
              <Plus className="w-5 h-5 pointer-events-none" />
            </div>
            {/* Wrapper for TransactionsDialogBtn to make it grow */}
            <div className="flex-grow flex items-center justify-center">
              <TransactionsDialogBtn
                text="Añadir Transacción"
                triggerAsChild={true}
                className="flex flex-1 w-full items-center gap-2 cursor-pointer bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
              />
            </div>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
