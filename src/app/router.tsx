import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import { UserRole } from '@shared/types/enums';
import { AppLayout } from '@shared/components/layout/AppLayout';
import { Spinner } from '@shared/components/ui';

// Lazy load pages
const LoginPage = lazy(() => import('@features/auth').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('@features/auth').then(m => ({ default: m.RegisterPage })));

const ApplicationsListPage = lazy(() => import('@features/applications').then(m => ({ default: m.ApplicationsListPage })));
const ApplicationDetailPage = lazy(() => import('@features/applications').then(m => ({ default: m.ApplicationDetailPage })));
const CreateApplicationPage = lazy(() => import('@features/applications').then(m => ({ default: m.CreateApplicationPage })));
const VictoriesPage = lazy(() => import('@features/applications').then(m => ({ default: m.VictoriesPage })));
const ClientApplicationsPage = lazy(() => import('@features/applications').then(m => ({ default: m.ClientApplicationsPage })));

// Conditional wrapper for applications page based on role
const ConditionalApplicationsPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.role === UserRole.CLIENT ? <ClientApplicationsPage /> : <ApplicationsListPage />;
};

const DocumentsPage = lazy(() => import('@features/documents').then(m => ({ default: m.DocumentsPage })));
const ClientsPage = lazy(() => import('@features/clients').then(m => ({ default: m.ClientsPage })));
const ClientDetailPage = lazy(() => import('@features/clients').then(m => ({ default: m.ClientDetailPage })));
const CompanyPage = lazy(() => import('@features/company').then(m => ({ default: m.CompanyPage })));
const NewsPage = lazy(() => import('@features/news').then(m => ({ default: m.NewsPage })));
const CalculatorPage = lazy(() => import('@features/calculator').then(m => ({ default: m.CalculatorPage })));
const SettingsPage = lazy(() => import('@features/settings').then(m => ({ default: m.SettingsPage })));
const ChatPage = lazy(() => import('@features/chat').then(m => ({ default: m.ChatPage })));
const DashboardPage = lazy(() => import('@features/dashboard').then(m => ({ default: m.DashboardPage })));
const AgentContractPage = lazy(() => import('@features/agent').then(m => ({ default: m.AgentContractPage })));
const CallBasePage = lazy(() => import('@features/callbase').then(m => ({ default: m.CallBasePage })));
const InstructionsPage = lazy(() => import('@features/instructions').then(m => ({ default: m.InstructionsPage })));

const AdminUsersPage = lazy(() => import('@features/admin').then(m => ({ default: m.AdminUsersPage })));
const AdminChatPage = lazy(() => import('@features/admin').then(m => ({ default: m.AdminChatPage })));
const AdminChatModerationPage = lazy(() => import('@features/admin').then(m => ({ default: m.AdminChatModerationPage })));
const AdminCreatePartnerPage = lazy(() => import('@features/admin').then(m => ({ default: m.AdminCreatePartnerPage })));

const PartnerApplicationsPage = lazy(() => import('@features/partner').then(m => ({ default: m.PartnerApplicationsPage })));
const PartnerAgentsPage = lazy(() => import('@features/partner').then(m => ({ default: m.PartnerAgentsPage })));
const PartnerBankPage = lazy(() => import('@features/partner').then(m => ({ default: m.PartnerBankPage })));
const PartnerClientsPage = lazy(() => import('@features/partner').then(m => ({ default: m.PartnerClientsPage })));

export const AppRouter = () => {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected routes with layout */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <DashboardPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <DashboardPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <ConditionalApplicationsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications/create"
                    element={
                        <ProtectedRoute roles={[UserRole.AGENT]}>
                            <AppLayout>
                                <CreateApplicationPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications/:id"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT, UserRole.PARTNER]}>
                            <AppLayout>
                                <ApplicationDetailPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/victories"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT]}>
                            <AppLayout>
                                <VictoriesPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/instructions"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <InstructionsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/company"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <CompanyPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/documents"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <DocumentsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute roles={[UserRole.AGENT]}>
                            <AppLayout>
                                <ClientsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients/:id"
                    element={
                        <ProtectedRoute roles={[UserRole.AGENT]}>
                            <AppLayout>
                                <ClientDetailPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/agent/contract"
                    element={
                        <ProtectedRoute roles={[UserRole.AGENT]}>
                            <AppLayout>
                                <AgentContractPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/callbase"
                    element={
                        <ProtectedRoute roles={[UserRole.AGENT]}>
                            <AppLayout>
                                <CallBasePage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <ChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat/:id"
                    element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                            <AppLayout>
                                <ChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/news"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT, UserRole.PARTNER]}>
                            <AppLayout>
                                <NewsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/calculator"
                    element={
                        <ProtectedRoute roles={[UserRole.CLIENT, UserRole.AGENT]}>
                            <AppLayout>
                                <CalculatorPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <AppLayout>
                                <SettingsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Admin routes */}
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                            <AppLayout>
                                <AdminUsersPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users/create-partner"
                    element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                            <AppLayout>
                                <AdminCreatePartnerPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/chat"
                    element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                            <AppLayout>
                                <AdminChatPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/chat/:id"
                    element={
                        <ProtectedRoute roles={[UserRole.ADMIN]}>
                            <AppLayout>
                                <AdminChatModerationPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* Partner routes */}
                <Route
                    path="/partner/applications"
                    element={
                        <ProtectedRoute roles={[UserRole.PARTNER]}>
                            <AppLayout>
                                <PartnerApplicationsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/partner/agents"
                    element={
                        <ProtectedRoute roles={[UserRole.PARTNER]}>
                            <AppLayout>
                                <PartnerAgentsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/partner/bank"
                    element={
                        <ProtectedRoute roles={[UserRole.PARTNER]}>
                            <AppLayout>
                                <PartnerBankPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/partner/clients"
                    element={
                        <ProtectedRoute roles={[UserRole.PARTNER]}>
                            <AppLayout>
                                <PartnerClientsPage />
                            </AppLayout>
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};
