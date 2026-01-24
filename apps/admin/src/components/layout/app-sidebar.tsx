import {
  LayoutDashboard,
  Image,
  Users,
  Briefcase,
  Building2,
  Handshake,
  MapPin,
  Settings,
  Mail,
  FileText,
  Layers,
  SlidersHorizontal,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

const contentItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Hero Slides', url: '/hero-slides', icon: SlidersHorizontal },
  { title: 'Partners', url: '/partners', icon: Handshake },
  { title: 'Joint Ventures', url: '/joint-ventures', icon: Building2 },
  { title: 'Services', url: '/services', icon: Layers },
  { title: 'Gallery', url: '/gallery', icon: Image },
  { title: 'Offices', url: '/offices', icon: MapPin },
  { title: 'Jobs', url: '/jobs', icon: Briefcase },
]

const submissionItems = [
  { title: 'Contact Messages', url: '/submissions/contact', icon: Mail },
  { title: 'Job Applications', url: '/submissions/applications', icon: FileText },
]

const systemItems = [
  { title: 'Settings', url: '/settings', icon: Settings },
  { title: 'Users', url: '/users', icon: Users },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
            J
          </div>
          <div className="flex flex-col">
            <span className="font-semibold">Jerash Admin</span>
            <span className="text-xs text-muted-foreground">Content Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Submissions</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {submissionItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        isActive ? 'bg-accent text-accent-foreground' : ''
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
