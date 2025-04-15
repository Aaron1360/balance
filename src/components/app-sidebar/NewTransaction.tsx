import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";

function NewTransaction() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton className="flex justify-center items-center bg-black text-white hover:bg-gray-900 hover:text-white">
            <Plus /> Nueva Transacción
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default NewTransaction;
