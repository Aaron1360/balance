import {
    Trash2,
    Plus,
    MoreHorizontal,
    ArrowRight,
    Edit,
    type LucideIcon,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
  } from "@/components/ui/sidebar"
  
  export function NavProjects({
    projects,
  }: {
    projects: {
      name: string
      url: string
      icon: LucideIcon
    }[]
  }) {
    const { isMobile } = useSidebar()
  
    return (
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <SidebarGroupLabel>Proyectos</SidebarGroupLabel>
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-25 rounded-lg"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  <DropdownMenuItem>
                    <ArrowRight className="text-muted-foreground" />
                    <span>Detalles</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Edit className="text-muted-foreground" />
                    <span>Editar</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Trash2 className="text-destructive border-destructive hover:bg-destructive/10" />
                    <span className="text-destructive border-destructive hover:bg-destructive/10" >Eliminar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          ))}
          <SidebarMenuItem>
            <SidebarMenuButton className="text-sidebar-foreground/70">
              <Plus className="text-sidebar-foreground/70" />
              <span>Nuevo Proyecto</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    )
  }
  