import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Ticket } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const NavLink = ({ href, children, isActive = false }: { href: string; children: React.ReactNode; isActive?: boolean }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild isActive={isActive} className={cn(isActive ? "bg-accent/20 text-accent" : "text-primary hover:bg-accent/10 hover:text-accent")}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black">
      <SidebarProvider>
        <Sidebar className="border-r border-red-900/50" side="left" collapsible="icon">
          <SidebarHeader className="p-0">
             <div className="flex items-center gap-2 p-4 justify-center">
                <Logo className="w-8 h-8 flex-shrink-0" />
                <span className="font-headline text-lg text-primary truncate">Admin Panel</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <NavLink href="/admin" isActive>
                <LayoutDashboard />
                Dashboard
              </NavLink>
              <NavLink href="#">
                <Users />
                Usuários
              </NavLink>
              <NavLink href="#">
                <Ticket />
                Gerações
              </NavLink>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <main className="min-h-screen bg-black/80 p-4 lg:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
