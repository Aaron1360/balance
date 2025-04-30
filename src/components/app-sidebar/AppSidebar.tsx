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
import TransactionFormBtn from "../new-transaction-button/TransactionFormBtn";

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
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary"
          >
            {/* Plus icon styled to look like part of the button */}
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground">
              <Plus className="w-5 h-5" />
            </div>
            {/* TransactionFormBtn styled as part of the button */}
            <TransactionFormBtn text="Añadir Transacción" />
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
