import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, ChefHat, Utensils, Scale, FlaskConical, Sun, Moon, Menu } from 'lucide-react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar';
import { useTheme } from '@/contexts/ThemeContext';

const mainNavItems = [
    { to: '/', label: 'Dashboard', icon: LayoutGrid },
    { to: '/recipes', label: 'Recetas', icon: ChefHat },
    { to: '/ingredients', label: 'Ingredientes', icon: Utensils },
    { to: '/units', label: 'Unidades', icon: FlaskConical },
    { to: '/conversions', label: 'Conversiones', icon: Scale },
];

export function AppSidebar() {
    const location = useLocation();
    const { theme, toggleTheme } = useTheme();
    const { openMobile, setOpenMobile, isMobile } = useSidebar();

    return (
        <>
            {isMobile && (
                <button
                    onClick={() => setOpenMobile(true)}
                    className="fixed top-4 left-4 z-50 flex h-10 w-10 items-center justify-center rounded-md bg-sidebar text-sidebar-foreground shadow-md hover:bg-sidebar-accent"
                >
                    <Menu className="h-5 w-5" />
                </button>
            )}
            <Sidebar collapsible="icon" variant="inset">
                <SidebarHeader>
                    <div className="flex h-12 items-center justify-between px-2">
                        <NavLink to="/" className="flex items-center gap-2">
                            <ChefHat className="h-7 w-7 shrink-0 text-primary" />
                            <span className="text-lg font-semibold group-data-[collapsible=icon]:hidden">RecipePro</span>
                        </NavLink>
                        <SidebarTrigger />
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <SidebarMenu>
                        {mainNavItems.map(({ to, label, icon: Icon }) => {
                            const isActive = location.pathname === to ||
                                (to !== '/' && location.pathname.startsWith(to));

                            return (
                                <SidebarMenuItem key={to}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isActive}
                                        tooltip={label}
                                    >
                                        <NavLink to={to} onClick={() => isMobile && setOpenMobile(false)}>
                                            <Icon className="h-5 w-5" />
                                            <span>{label}</span>
                                        </NavLink>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarContent>

                <SidebarFooter>
                    <div className="flex items-center justify-between p-2">
                        <button
                            onClick={toggleTheme}
                            className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                        >
                            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                    <SidebarRail />
                </SidebarFooter>
            </Sidebar>
        </>
    );
}

export { SidebarProvider };