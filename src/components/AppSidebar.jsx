import { NavLink, useLocation } from 'react-router-dom';
import { LayoutGrid, ChefHat, Utensils, Scale, FlaskConical, Sun, Moon, PanelLeftClose, PanelLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';

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
    const isMobile = useIsMobile();
    const [collapsed, setCollapsed] = useState(true);

    const navItems = [
        { to: '/', label: 'Dashboard', icon: LayoutGrid },
        { to: '/recipes', label: 'Recetas', icon: ChefHat },
        { to: '/ingredients', label: 'Ingredientes', icon: Utensils },
        { to: '/units', label: 'Unidades', icon: FlaskConical },
        { to: '/conversions', label: 'Conversiones', icon: Scale },
    ];

    if (isMobile) {
        return (
            <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-card border-t-4 border-primary shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
                <div className="flex items-center justify-around h-16 px-1">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const isActive = location.pathname === to ||
                            (to !== '/' && location.pathname.startsWith(to));

                        return (
                            <NavLink
                                key={to}
                                to={to}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[68px]",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                                )}
                            >
                                <Icon className="h-6 w-6" />
                                <span className="text-[10px] font-semibold leading-none">{label}</span>
                            </NavLink>
                        );
                    })}
                </div>
            </nav>
        );
    }

    return (
        <aside className={cn(
            "bg-sidebar border-r border-sidebar-border flex flex-col h-screen transition-all duration-300",
            collapsed ? "w-16" : "w-60"
        )}>
            <div className={cn("p-3 border-b border-sidebar-border flex items-center", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && (
                    <NavLink to="/" className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <ChefHat className="h-5 w-5" />
                        </div>
                        <span className="text-base font-semibold">RecipePro</span>
                    </NavLink>
                )}
                {collapsed && (
                    <NavLink to="/" className="flex items-center justify-center">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                            <ChefHat className="h-5 w-5" />
                        </div>
                    </NavLink>
                )}
            </div>

            <div className="flex-1 p-2">
                <div className="space-y-1">
                    {navItems.map(({ to, label, icon: Icon }) => {
                        const isActive = location.pathname === to ||
                            (to !== '/' && location.pathname.startsWith(to));

                        return (
                            <NavLink
                                key={to}
                                to={to}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                                    collapsed && "justify-center px-0",
                                    isActive
                                        ? "bg-primary/10 text-primary font-medium"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                                )}
                                title={collapsed ? label : undefined}
                            >
                                <Icon className="h-[18px] w-[18px] shrink-0" />
                                {!collapsed && <span className="text-sm">{label}</span>}
                            </NavLink>
                        );
                    })}
                </div>
            </div>

            <div className="p-2 border-t border-sidebar-border space-y-2">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground"
                    title={collapsed ? "Expandir" : "Colapsar"}
                >
                    {collapsed ? <PanelLeft className="h-[18px] w-[18px]" /> : <PanelLeftClose className="h-[18px] w-[18px]" />}
                    {!collapsed && <span className="text-sm">Colapsar</span>}
                </button>
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "flex h-9 items-center rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground",
                        collapsed ? "w-full justify-center px-0" : "w-full justify-start px-3 gap-2"
                    )}
                    title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
                >
                    {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
                    {!collapsed && <span className="text-sm">{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
                </button>
            </div>
        </aside>
    );
}

export { SidebarProvider } from '@/components/ui/sidebar';