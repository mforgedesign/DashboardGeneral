import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Settings, Menu, X, Wallet } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, to, onClick }) => (
    <NavLink
        to={to}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-white/10 border border-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                : 'text-[var(--text-secondary)] hover:bg-white/5 hover:text-white'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

export function Layout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-primary)]">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full z-50 glass-panel !rounded-none !border-x-0 !border-t-0 flex justify-between items-center px-6 py-4">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold">M</div>
                    <span className="font-display font-semibold text-xl tracking-tight">MForge</span>
                </div>
                <button onClick={toggleMenu} className="text-white p-2">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Navigation */}
            <aside
                className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 fixed md:static inset-y-0 left-0 z-40 w-64 glass-panel !rounded-none !border-y-0 !border-l-0 transition-transform duration-300 ease-in-out flex flex-col pt-20 md:pt-6`}
            >
                <div className="hidden md:flex items-center gap-3 px-6 mb-10">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black font-bold text-lg shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                        M
                    </div>
                    <span className="font-display font-semibold text-2xl tracking-tight">MForge</span>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    <SidebarItem icon={LayoutDashboard} label="Dashboard" to="/" onClick={closeMenu} />
                    <SidebarItem icon={Wallet} label="Finanças & Metas" to="/finance" onClick={closeMenu} />
                    <SidebarItem icon={CheckSquare} label="Tarefas Prioritárias" to="/tasks" onClick={closeMenu} />
                </nav>

                <div className="p-4 mt-auto">
                    <SidebarItem icon={Settings} label="Configurações" to="/settings" onClick={closeMenu} />
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 h-full overflow-y-auto overflow-x-hidden pt-20 md:pt-0 p-4 md:p-8">
                <div className="max-w-7xl mx-auto animate-fade-in">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
                    onClick={closeMenu}
                />
            )}
        </div>
    );
}
