import { SignedIn, SignOutButton, UserButton } from "@clerk/remix"
import { ListOrderedIcon, Home, Inbox } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "~/components/ui/sidebar"
import { Button } from "../ui/button"

const items = [
  {
    title: "Home",
    url: "/home",
    icon: Home,
  },
  {
    title: "Reservations",
    url: "/reservations",
    icon: ListOrderedIcon,
  }

]

export function FamilySidebar() {

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Food Pantry
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SignOutButton>
          <Button variant="destructive">
            Sign Out
          </Button>
        </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  )
}