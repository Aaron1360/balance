import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="flex items-center gap-2 bg-sidebar-accent text-sidebar-accent-foreground px-4 py-2 rounded-lg"
        >
          {/* Avatar */}
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>

          {/* Username and Email */}
          <div className="flex-1 text-left text-sm leading-tight">
            <span className="block truncate font-semibold">{user.name}</span>
            <span className="block truncate text-xs text-sidebar-accent-foreground/80">
              {user.email}
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
