import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    FileText,
    MessageSquare,
    Users,
    Calculator,
    Newspaper,
    Settings,
    LogOut,
    PlusCircle,
} from 'lucide-react';
import { useAuthStore } from '@features/auth';
import { UserRole } from '@shared/types/enums';
import { UserAvatar } from '@shared/components/ui';
import { SupportMessageModal } from '@features/support';
import { HelpMenu } from './HelpMenu';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const [showSupportModal, setShowSupportModal] = useState(false);

    if (!user) return null;

    // Menu items based on role with categories
    const menuItems = {
        [UserRole.CLIENT]: [
            { path: '/company', label: 'Моя компания', icon: Building2 },
            { path: '/documents', label: 'Мои документы', icon: FileText },
            { path: '/applications', label: 'Мои заявки', icon: LayoutDashboard },
            { path: '/victories', label: 'Мои победы', icon: LayoutDashboard },
            { type: 'divider' },
            { type: 'category', label: 'ИНСТРУМЕНТЫ' },
            { path: '/calculator', label: 'Калькулятор', icon: Calculator },
            { path: '/news', label: 'Новости', icon: Newspaper },
        ],
        [UserRole.AGENT]: [
            { path: '/company', label: 'Компания', icon: Building2 },
            { path: '/applications', label: 'Заявки', icon: LayoutDashboard },
            { path: '/clients', label: 'Мои клиенты', icon: Users },
            { path: '/settings', label: 'Настройка', icon: Settings },
            { type: 'divider' },
            { type: 'category', label: 'ИНСТРУМЕНТЫ' },
            { path: '/calculator', label: 'Калькулятор', icon: Calculator },
            { path: '/news', label: 'Новости', icon: Newspaper },
        ],
        [UserRole.PARTNER]: [
            { path: '/partner/applications', label: 'Мои заявки', icon: FileText },
            { path: '/partner/clients', label: 'Мои клиенты', icon: Users },
            { path: '/partner/agents', label: 'Мои агенты', icon: Users },
            { path: '/partner/bank', label: 'Мой банк', icon: Building2 },
            { type: 'divider' },
            { type: 'category', label: 'ИНСТРУМЕНТЫ' },
            { path: '/news', label: 'Новости', icon: Newspaper },
        ],
        [UserRole.ADMIN]: [
            { path: '/admin/users', label: 'Пользователи', icon: Users },
            { path: '/admin/chat', label: 'Модерация', icon: MessageSquare },
        ],
    };

    const currentMenu = menuItems[user.role] || [];

    return (
        <div className="flex min-h-screen bg-[#F3F4F6]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1D194C] text-white fixed h-full flex flex-col z-10">
                <div className="p-6 border-b border-[#1E3567]">
                    <h1 className="text-2xl font-bold tracking-wide">
                        ЛИДЕР<span className="text-[#3CE8D1]">ГАРАНТ</span>
                    </h1>
                </div>

                <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
                    {currentMenu.map((item, index) => {
                        // Category header
                        if (item.type === 'category') {
                            return (
                                <div key={`category-${index}`} className="px-6 pt-4 pb-2">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        {item.label}
                                    </span>
                                </div>
                            );
                        }

                        // Divider
                        if (item.type === 'divider') {
                            return (
                                <div key={`divider-${index}`} className="my-2 mx-6">
                                    <div className="border-t border-[#1E3567]"></div>
                                </div>
                            );
                        }

                        // Regular menu item
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-6 py-3 transition-all border-l-4 ${isActive
                                    ? 'border-[#3CE8D1] bg-[#1E3567] text-[#3CE8D1]'
                                    : 'border-transparent text-gray-400 hover:bg-[#1E3567] hover:text-white'
                                    }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {user.role === UserRole.AGENT && (
                    <div className="p-4">
                        <Link
                            to="/applications/create"
                            className="w-full flex items-center justify-center gap-2 bg-[#FF521D] hover:bg-[#E0481A] text-white font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-95"
                        >
                            <PlusCircle size={20} />
                            <span>Создать заявку</span>
                        </Link>
                    </div>
                )}

                {/* Help Menu - Only for CLIENT and AGENT */}
                {(user.role === UserRole.CLIENT || user.role === UserRole.AGENT) && (
                    <HelpMenu onOpenSupportModal={() => setShowSupportModal(true)} />
                )}

                <div className="p-4 border-t border-[#1E3567] bg-[#15123A]">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <button
                            onClick={logout}
                            className="flex items-center gap-1 hover:text-[#FF521D]"
                        >
                            <LogOut size={14} /> Выйти
                        </button>
                        <span>v1.0</span>
                    </div>
                </div>
            </aside >

            {/* Main Content */}
            < main className="flex-1 ml-64 p-8" >
                {/* Header */}
                < header className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center" >
                    <h2 className="text-xl font-bold text-gray-800">Личный кабинет</h2>
                    <Link to="/settings" className="flex items-center gap-4 hover:opacity-80">
                        <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{user.fio || 'Пользователь'}</p>
                            <p className="text-xs text-gray-500 uppercase">{user.role}</p>
                        </div>
                        <UserAvatar
                            url={user.avatar}
                            fallbackLetter={user.fio?.[0] || 'U'}
                            size="md"
                        />
                    </Link>
                </header >

                {children}
            </main >

            {showSupportModal && (
                <SupportMessageModal onClose={() => setShowSupportModal(false)} />
            )}
        </div >
    );
};