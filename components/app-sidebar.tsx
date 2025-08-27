'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import {FirecrawlWordmark} from '@/components/firecrawl-logo'
import {Home, Play, Search, Map, Globe, Activity, BarChart3, Key, Settings} from 'lucide-react'

const menuItems = [
  {title: 'Overview', icon: Home, url: '/'},
  {title: 'Playground', icon: Play, url: '/'},
  {title: 'Search', icon: Search, url: '/search'},
  {title: 'Map', icon: Map, url: '/map'},
  {title: 'Crawl', icon: Globe, url: '/crawl'},
]

const bottomMenuItems = [
  {title: 'Activity Logs', icon: Activity, url: '/activity'},
  {title: 'Usage', icon: BarChart3, url: '/usage'},
  {title: 'API Keys', icon: Key, url: '/api-keys'},
  {title: 'Settings', icon: Settings, url: '/settings'},
]

export function AppSidebar() {
  return (
    <Sidebar className="bg-sidebar-background border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 h-12 flex items-center justify-start">
        <div className="flex items-center justify-start w-full h-full">
          <FirecrawlWordmark height={16} />
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild={item.title === 'Playground'}
                isActive={item.title === 'Playground'}
                className={`w-full justify-start transition-colors duration-200 rounded-md ${
                  item.title === 'Playground'
                    ? 'bg-primary/10 text-primary hover:bg-primary/15'
                    : 'opacity-50 cursor-default hover:bg-muted/30'
                }`}
              >
                {item.title === 'Playground' ? (
                  <a href={item.url}>
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </a>
                ) : (
                  <span className="flex items-center gap-2">
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-border px-2 py-4">
        <SidebarMenu>
          {bottomMenuItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="w-full justify-start opacity-50 cursor-default transition-colors duration-200 rounded-md hover:bg-muted/30">
                <span className="flex items-center gap-2">
                  <item.icon className="w-4 h-4" />
                  <span>{item.title}</span>
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
