import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/AppSidebar';
import { AppSidebar } from '@/components/AppSidebar';

export default function AppLayout() {
    return (
        <SidebarProvider>
            <div className="grid min-h-svh w-full grid-cols-[auto_1fr]">
                <AppSidebar />
                <main className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        <div className="mx-auto max-w-7xl">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
}