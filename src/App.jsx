import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AppLayout from '@/layouts/AppLayout';
import Dashboard from '@/pages/Dashboard';
import Recipes from '@/pages/Recipes';
import RecipeDetail from '@/pages/RecipeDetail';
import Ingredients from '@/pages/Ingredients';
import Units from '@/pages/Units';
import Conversions from '@/pages/Conversions';

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="dark">
                <BrowserRouter>
                    <Routes>
                        <Route element={<AppLayout />}>
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/recipes" element={<Recipes />} />
                            <Route path="/recipes/:id" element={<RecipeDetail />} />
                            <Route path="/ingredients" element={<Ingredients />} />
                            <Route path="/units" element={<Units />} />
                            <Route path="/conversions" element={<Conversions />} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    );
}