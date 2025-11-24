import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  LayoutDashboard, Building2, FileText, MessageSquare, Users,
  Calculator, Newspaper, Settings, LogOut, PlusCircle, Briefcase,
  ShieldCheck, Trophy, Landmark, UserCheck, FileStack
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarSrc, setAvatarSrc] = useState(null);

  // Загрузка аватара
  useEffect(() => {
    if (!user?.avatar) {
      setAvatarSrc(null);
      return;
    }

    const fetchAvatar = async () => {
      try {
        const cleanUrl = user.avatar.startsWith('/api/api')
          ? user.avatar.replace('/api', '')
          : user.avatar;

        const response = await api.get(cleanUrl, { responseType: 'blob' });
        const objectUrl = URL.createObjectURL(response.data);
        setAvatarSrc(objectUrl);
      } catch (e) {
        console.error("Не удалось загрузить аватар", e);
        setAvatarSrc(null);
      }
    };

    fetchAvatar();

    return () => {
      if (avatarSrc) URL.revokeObjectURL(avatarSrc);
    };
  }, [user?.avatar]);

  const menus = {
    client: [
      { path: '/accreditation', label: 'Аккредитация', icon: ShieldCheck },
      { path: '/company', label: 'Моя компания', icon: Building2 },
      { path: '/documents', label: 'Мои документы', icon: FileText },
      { path: '/applications', label: 'Мои заявки', icon: LayoutDashboard },
      { path: '/victories', label: 'Мои победы', icon: Trophy },
      { path: '/calculator', label: 'Калькулятор', icon: Calculator },
      { path: '/news', label: 'Новости', icon: Newspaper },
    ],
    agent: [
      { path: '/company', label: 'Компания', icon: Building2 },
      { path: '/applications', label: 'Мои заявки', icon: LayoutDashboard },
      { path: '/calculator', label: 'Калькулятор', icon: Calculator },
      { path: '/clients', label: 'Клиенты', icon: Users },
      { path: '/settings', label: 'Настройка', icon: Settings },
      { path: '/agent-contract', label: 'Мой договор', icon: Briefcase },
      { path: '/news', label: 'Новости', icon: Newspaper },
    ],
    partner: [
      { path: '/partner/applications', label: 'Мои заявки', icon: FileStack },
      { path: '/partner/bank', label: 'Мой Банк', icon: Landmark },
      { path: '/partner/clients', label: 'Мои клиенты', icon: Users },
      { path: '/partner/agents', label: 'Мои агенты', icon: UserCheck },
      { path: '/news', label: 'Новости', icon: Newspaper },
    ],
    admin: [
      { path: '/admin/users', label: 'Пользователи', icon: Users },
      { path: '/admin/chat', label: 'Модерация', icon: MessageSquare },
    ]
  };

  const currentMenu = menus[user?.role] || menus.client;

  const getRoleLabel = (role) => {
    const labels = {
      'client': 'Клиент',
      'agent': 'Агент',
      'partner': 'Партнер',
      'admin': 'Администратор'
    };
    return labels[role] || 'Пользователь';
  };

  return (
    <div className="flex min-h-screen bg-[#F3F4F6]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#1D194C] text-white fixed h-full flex flex-col z-10">
        <div className="p-6 border-b border-[#1E3567]">
          <h1 className="text-2xl font-bold tracking-wide">
            ЛИДЕР<span className="text-[#3CE8D1]">ГАРАНТ</span>
          </h1>
        </div>

        <nav className="flex-1 py-6 space-y-1 overflow-y-auto">
          {currentMenu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 transition-all border-l-4
                  ${isActive
                    ? 'border-[#3CE8D1] bg-[#1E3567] text-[#3CE8D1]'
                    : 'border-transparent text-gray-400 hover:bg-[#1E3567] hover:text-white'}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {user?.role !== 'admin' && user?.role !== 'partner' && (
          <div className="p-4">
            <button
              onClick={() => navigate('/create-application')}
              className="w-full flex items-center justify-center gap-2 bg-[#FF521D] hover:bg-[#E0481A] text-white font-bold py-3 rounded-lg shadow-lg transition-transform active:scale-95"
            >
              <PlusCircle size={20} />
              <span>Создать заявку</span>
            </button>
          </div>
        )}

        <div className="p-4 border-t border-[#1E3567] bg-[#15123A]">
          <div className="mb-3">
            <p className="text-xs text-gray-400 uppercase">Ваш менеджер</p>
            <p className="font-bold text-sm text-white">Д. Сергеев</p>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-400">
            <button onClick={logout} className="flex items-center gap-1 hover:text-[#FF521D]">
              <LogOut size={14} /> Выйти
            </button>
            <span>v1.0</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64 p-8">
        {/* Верхняя плашка с АВАТАРОМ */}
        <header className="bg-white p-4 rounded-xl shadow-sm mb-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Личный кабинет</h2>
          <Link to="/settings" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900">{user?.fio || 'Пользователь'}</p>
              <p className="text-xs text-gray-500 uppercase">{getRoleLabel(user?.role)}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold overflow-hidden border-2 border-white shadow-md">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{user?.fio?.[0] || 'U'}</span>
              )}
            </div>
          </Link>
        </header>

        {children}
      </main>
    </div>
  );
}