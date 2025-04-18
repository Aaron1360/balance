import * as React from "react";
import {
  FileText,
  Repeat,
  Receipt,
  Wrench,
  Calendar,
  ShieldAlert,
  Luggage,
  CreditCard,
  CircleDollarSign,
  HandCoins,
} from "lucide-react";
import { NavMain } from "./NavDashboard";
import { NavProjects } from "./NavGoals";
import { NavUser } from "./NavUser";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import rebootImage from "@/assets/reboot1.png";
import NewTransactionBtn from "./new-transaction/NewTransactionBtn";

// This is sample data.
export const data = {
  user: {
    name: "Aaron Moreno",
    email: "aaronmvilleda@gmail.com",
    avatar: rebootImage,
  },
  navMain: [
    {
      title: "Estado de Cuenta",
      url: "/dashboard/estado-de-cuenta",
      icon: FileText,
      isActive: true,
    },
    {
      title: "Ingresos",
      url: "/dashboard/ingresos",
      icon: CircleDollarSign,
    },
    {
      title: "Transacciones",
      url: "/dashboard/transacciones",
      icon: Repeat,
    },
    {
      title: "Ahorros",
      url: "/dashboard/ahorros",
      icon: HandCoins,
    },
    {
      title: "Deudas",
      url: "/dashboard/deudas",
      icon: Receipt,
    },
    {
      title: "Servicios",
      url: "/dashboard/servicios",
      icon: Wrench,
    },
    {
      title: "Calendario",
      url: "/dashboard/calendario",
      icon: Calendar,
    },
  ],
  projects: [
    {
      name: "Fondo de Emergencia",
      url: "#",
      icon: ShieldAlert,
    },
    {
      name: "Vacaciones",
      url: "#",
      icon: Luggage,
    },
    {
      name: "Prestamo personal",
      url: "#",
      icon: CreditCard,
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
        <NavProjects projects={data.projects} />
        <NewTransactionBtn />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
