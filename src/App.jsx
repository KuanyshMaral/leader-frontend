import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Импорт страниц
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import ChatPage from './pages/ChatPage';
import ApplicationsPage from './pages/ApplicationsPage';
import ApplicationDetailPage from './pages/ApplicationDetailPage';
import DocumentsPage from './pages/DocumentsPage';
import AgentContractPage from './pages/AgentContractPage';
import CreateApplicationPage from './pages/CreateApplicationPage';
import CallBasePage from './pages/CallBasePage';
import NewsPage from './pages/NewsPage';
import CalculatorPage from './pages/CalculatorPage';
import SettingsPage from './pages/SettingsPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';

// Импорт страниц Админки
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminChatPage from './pages/admin/AdminChatPage';
import AdminCreatePartnerPage from './pages/admin/AdminCreatePartnerPage';

import PartnerApplicationsPage from './pages/partner/PartnerApplicationsPage';
import PartnerClientsPage from './pages/partner/PartnerClientsPage';
import PartnerAgentsPage from './pages/partner/PartnerAgentsPage';
import PartnerBankPage from './pages/partner/PartnerBankPage';

// --- КОМПОНЕНТ ЗАЩИТЫ (Называем его Private, чтобы не было ошибок) ---
const Private = ({ children, roles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-gray-500">Загрузка...</div>;
    }
    
    // 1. Если не авторизован -> на логин
    if (!user) {
        return <Navigate to="/login" />;
    }
    
    // 2. Если есть требования по ролям, а роль юзера не подходит -> на главную
    if (roles && !roles.includes(user.role)) {
        // Если Админ пытается зайти на страницу Клиента -> кидаем его в Админку
        if (user.role === 'admin') return <Navigate to="/admin/users" />;
        // Если Партнер пытается зайти к Клиенту -> кидаем к Партнеру
        if (user.role === 'partner') return <Navigate to="/partner/applications" />;
        // Иначе -> на главную
        return <Navigate to="/" />;
    }

    return children;
};

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* --- ОБЩИЕ РОУТЫ (Клиент + Агент) --- */}
                <Route path="/" element={
                    <Private roles={['client', 'agent']}><ApplicationsPage /></Private>
                } />
                
                <Route path="/dashboard" element={
                    <Private roles={['client', 'agent']}><Dashboard /></Private>
                } />

                <Route path="/settings" element={
                    <Private><SettingsPage /></Private>
                } />

                <Route path="/company" element={
                    <Private roles={['client', 'agent']}><CompanyPage /></Private>
                } />

                <Route path="/documents" element={
                    <Private roles={['client', 'agent']}><DocumentsPage /></Private>
                } />

                <Route path="/chat" element={
                    <Private roles={['client', 'agent']}><ChatPage /></Private>
                } />
                
                <Route path="/news" element={
                    <Private roles={['client', 'agent']}><NewsPage /></Private>
                } />
                
                <Route path="/calculator" element={
                    <Private roles={['client', 'agent']}><CalculatorPage /></Private>
                } />

                {/* Заявки */}
                <Route path="/applications" element={
                    <Private roles={['client', 'agent']}><ApplicationsPage /></Private>
                } />
                
                <Route path="/applications/:id" element={
                    <Private roles={['client', 'agent']}><ApplicationDetailPage /></Private>
                } />
                
                <Route path="/create-application" element={
                    <Private roles={['client', 'agent']}><CreateApplicationPage /></Private>
                } />

                {/* --- РОУТЫ АГЕНТА --- */}
                <Route path="/agent-contract" element={
                    <Private roles={['agent']}><AgentContractPage /></Private>
                } />
                
                <Route path="/clients" element={
                    <Private roles={['agent']}><ClientsPage /></Private>
                } />

                <Route path="/clients/:id" element={ // <-- ДОБАВИТЬ ЭТОТ РОУТ
                    <Private roles={['agent', 'partner']}><ClientDetailPage /></Private>
                } />
                
                <Route path="/call-base" element={
                    <Private roles={['agent']}><CallBasePage /></Private>
                } />

                {/* --- РОУТЫ АДМИНА --- */}
                <Route path="/admin/users" element={
                    <Private roles={['admin']}><AdminUsersPage /></Private>
                } />
                
                <Route path="/admin/users/create-partner" element={
                    <Private roles={['admin']}><AdminCreatePartnerPage /></Private>
                } />
                
                <Route path="/admin/chat" element={
                    <Private roles={['admin']}><AdminChatPage /></Private>
                } />
                
                <Route path="/admin/banks" element={
                    <Private roles={['admin']}>
                        <div className="p-8">Управление банками (в разработке)</div>
                    </Private>
                } />

                {/* --- РОУТЫ ПАРТНЕРА --- */}
                {/* (Если вы создали эти страницы, раскомментируйте импорты и используйте их) */}
                <Route path="/partner/applications" element={
                    <Private roles={['partner']}><PartnerApplicationsPage /></Private>
                } />
                <Route path="/partner/bank" element={
                    <Private roles={['partner']}><PartnerBankPage /></Private>
                } />
                <Route path="/partner/clients" element={
                    <Private roles={['partner']}><PartnerClientsPage /></Private>
                } />
                <Route path="/partner/agents" element={
                    <Private roles={['partner']}><PartnerAgentsPage /></Private>
                } />

            </Routes>
        </BrowserRouter>
    );
}