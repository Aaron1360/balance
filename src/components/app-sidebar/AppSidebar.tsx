import * as React from "react";
import {
  FileText,
  Repeat,
  Receipt,
  Wrench,
  Calendar,
  ShieldAlert,
  Luggage,
  HandCoins,
  Car,
  Book,
  Plus,
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
import TransactionFormBtn from "./new-transaction/TransactionFormBtn";

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
      name: "Vacaciones",
      url: "#",
      icon: Luggage,
    },
    {
      name: "Fondo de Emergencia",
      url: "#",
      icon: ShieldAlert,
    },
    {
      name: "Nuevo Coche",
      url: "#",
      icon: Car,
    },
    {
      name: "Educación",
      url: "#",
      icon: Book,
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
        <TransactionFormBtn icon={Plus} text="Añadir Transacción" />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
