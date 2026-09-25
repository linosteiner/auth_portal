"use client"

import {AppSidebar} from "@/components/dashboard/app-sidebar"
import {Breadcrumbs} from "@/components/dashboard/breadcrumbs"
import {CurrentUserProvider} from "@/components/dashboard/current-user"
import {ThemeToggle} from "@/components/dashboard/theme-toggle"
import {Separator} from "@/components/ui/separator"
import {SidebarInset, SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar"

export default function DashboardLayout({children}: { children: React.ReactNode }) {
  return (
    <CurrentUserProvider>
      <SidebarProvider>
        <AppSidebar/>
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1"/>
              <Separator
                orientation="vertical"
                className="mr-2 data-vertical:h-4 data-vertical:self-auto"
              />
              <Breadcrumbs/>
            </div>
            <div className="px-4">
              <ThemeToggle/>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </CurrentUserProvider>
  )
}
