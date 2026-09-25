"use client"

import * as React from "react"
import Link from "next/link"
import {usePathname} from "next/navigation"
import {BookOpen, GraduationCap, LayoutDashboard} from "lucide-react"

import {useCurrentUser} from "@/components/dashboard/current-user"
import {NavUser} from "@/components/dashboard/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Every entry leads to a real page. The shadcn template's placeholders (Playground, Projects,
// Support, ...) pointed at "#" and did nothing when clicked.
const navigation = [
  {title: "Overview", url: "/dashboard", icon: LayoutDashboard},
  {title: "Modules", url: "/dashboard/modules", icon: BookOpen},
]

export function AppSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
  const user = useCurrentUser()
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4"/>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">User Management</span>
                  <span className="truncate text-xs">Modules for users</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.url}>
                <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <item.icon/>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user ? `${user.firstName} ${user.lastName}` : "",
            email: user?.email ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
