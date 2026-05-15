import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/AppSidebar';

export default function AppLayout() {
    return (
        <div className="flex h-screen">
            <AppSidebar />
            <main className="flex-1 overflow-y-auto">
                <div className="sm:p-2 lg:p-4">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}