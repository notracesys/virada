'use client';

import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarInset } from '@/components/ui/sidebar';
import { LayoutDashboard, Users, Ticket, KeyRound, LogOut } from 'lucide-react';
import { Logo } from '@/components/logo';
import Link from 'next/link';
import { useUser, useAuth } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { signOut } from 'firebase/auth';

const NavLink = ({ href, children, isActive = false }: { href: string; children: React.ReactNode; isActive?: boolean }) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>{children}</Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);

function AdminAuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // If loading is finished and there's no user, redirect to login
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  // While checking auth, show a loading skeleton
  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="w-full max-w-md p-8 space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // If user is authenticated, render the actual layout
  return <>{children}</>;
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <AdminAuthWrapper>
      <div className="bg-background">
        <SidebarProvider>
          <Sidebar side="left" collapsible="icon">
            <SidebarHeader className="p-0">
               <div className="flex items-center gap-2 p-4 justify-center">
                  <Logo className="w-8 h-8 flex-shrink-0" />
                  <span className="font-headline text-lg text-foreground truncate">Admin Panel</span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarMenu>
                <NavLink href="/admin" isActive>
                  <LayoutDashboard />
                  Dashboard
                </NavLink>
                <NavLink href="/admin/codes">
                  <KeyRound />
                  Códigos de Acesso
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
             <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={handleLogout} className="w-full">
                        <LogOut />
                        Sair
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
          </Sidebar>
          <SidebarInset>
            <main className="min-h-screen bg-background p-4 lg:p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </AdminAuthWrapper>
  );
}
