import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { User, Lock, Bell, Share2, Camera, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { Button, Input, Spinner, UserAvatar } from '@shared/components/ui';
import { useAuthStore } from '@features/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../api';

const ProfileAvatar = ({ url, fallbackLetter, onUpload }: any) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="relative w-24 h-24 group">
            <UserAvatar
                url={url}
                fallbackLetter={fallbackLetter}
                size="xl"
                className="w-full h-full border-2 border-white shadow-md"
            />

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={onUpload}
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#3CE8D1] text-white p-2 rounded-full hover:bg-[#2DD1B8] transition-colors shadow-sm z-10"
                title="Загрузить фото"
            >
                <Camera size={14} />
            </button>
        </div>
    );
};

export const SettingsPage = () => {
    const { user, fetchUser, logout } = useAuthStore();
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });
    const queryClient = useQueryClient();

    const profileForm = useForm();
    const passwordForm = useForm();

    // Sync form with user data
    useEffect(() => {
        if (user) {
            profileForm.reset({
                fio: user.fio,
                phone: user.phone,
                email: user.email,
                gender: user.gender,
                timezone: user.timezone,
            });
        }
    }, [user, profileForm]);

    // Mutations
    const updateProfileMutation = useMutation({
        mutationFn: settingsApi.updateProfile,
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Профиль обновлен' });
            fetchUser(); // Refresh user data
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Ошибка сохранения' });
        }
    });

    const updatePasswordMutation = useMutation({
        mutationFn: settingsApi.changePassword,
        onSuccess: () => {
            setMessage({ type: 'success', text: 'Пароль успешно изменен' });
            passwordForm.reset();
        },
        onError: (e: any) => {
            setMessage({ type: 'error', text: e.response?.data?.error || 'Ошибка' });
        }
    });

    const uploadAvatarMutation = useMutation({
        mutationFn: async (file: File) => {
            const uploadRes = await settingsApi.uploadAvatar(file);
            // Update profile with new avatar URL
            await settingsApi.updateProfile({
                avatar_url: uploadRes.data.url,
                avatar_file_id: uploadRes.data.id,
            });
            return uploadRes.data.url;
        },
        onSuccess: (newUrl) => {
            setMessage({ type: 'success', text: 'Аватар обновлён' });
            fetchUser();
            // Invalidate avatar query to force refetch
            queryClient.invalidateQueries({ queryKey: ['avatar'] });
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Ошибка загрузки аватара' });
        }
    });

    const updatePreferencesMutation = useMutation({
        mutationFn: settingsApi.updatePreferences,
        onMutate: async (newPreferences) => {
            // Optimistic update could go here if we had local state for preferences separate from user
        },
        onSuccess: () => {
            fetchUser();
        }
    });

    const handleAvatarChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            uploadAvatarMutation.mutate(file);
        }
    };

    const onSaveProfile = (data: any) => {
        updateProfileMutation.mutate(data);
    };

    const onChangePassword = (data: any) => {
        if (data.newPassword !== data.confirmPassword) {
            setMessage({ type: 'error', text: 'Пароли не совпадают' });
            return;
        }
        updatePasswordMutation.mutate(data);
    };

    const onDeleteAccount = async () => {
        if (!window.confirm('Вы уверены? Это действие необратимо.')) return;
        try {
            await settingsApi.deleteAccount();
            logout();
        } catch (e) {
            setMessage({ type: 'error', text: 'Не удалось удалить аккаунт.' });
        }
    };

    const toggleNotification = (key: string, value: boolean) => {
        if (!user?.preferences) return;
        const newSettings = { ...user.preferences, [key]: value };
        // Optimistically update UI via local state if needed, but here we just mutate
        updatePreferencesMutation.mutate(newSettings);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id}`);
        alert('Ссылка скопирована!');
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Настройки аккаунта</h1>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Меню */}
                <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
                    {[
                        { id: 'profile', label: 'Профиль', icon: User },
                        { id: 'security', label: 'Безопасность', icon: Lock },
                        { id: 'notifications', label: 'Уведомления', icon: Bell },
                        {
                            id: 'referral',
                            label: 'Реферальная программа',
                            icon: Share2,
                            hidden: user?.role === 'partner',
                        },
                    ].map(
                        (tab) =>
                            !tab.hidden && (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        setMessage({ type: '', text: '' });
                                    }}
                                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4
                ${activeTab === tab.id
                                            ? 'border-[#3CE8D1] bg-blue-50 text-[#1D194C]'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50'
                                        }
              `}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            )
                    )}
                </div>

                {/* Контент */}
                <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
                    {message.text && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}
                        >
                            {message.text}
                        </div>
                    )}

                    {/* ВКЛАДКА ПРОФИЛЬ */}
                    {activeTab === 'profile' && (
                        <form
                            onSubmit={profileForm.handleSubmit(onSaveProfile)}
                            className="max-w-lg animate-fade-in"
                        >
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Личные данные</h2>

                            <div className="flex items-center gap-6 mb-8">
                                <ProfileAvatar
                                    url={user?.avatar}
                                    fallbackLetter={user?.fio?.[0] || 'U'}
                                    onUpload={handleAvatarChange}
                                />
                                <div className="text-sm text-gray-500">
                                    <p className="font-medium text-gray-700">Фото профиля</p>
                                    <p>JPG, PNG до 15 MB.</p>
                                    {uploadAvatarMutation.isPending && <span className="text-blue-500">Загрузка...</span>}
                                </div>
                            </div>

                            <div className="space-y-5">
                                <Input label="ФИО" {...profileForm.register('fio')} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Телефон" {...profileForm.register('phone')} />
                                    <Input label="Email" {...profileForm.register('email')} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пол</label>
                                        <select
                                            {...profileForm.register('gender')}
                                            className="w-full px-4 py-2.5 border rounded-lg bg-white border-gray-300 outline-none"
                                        >
                                            <option value="">Не указано</option>
                                            <option value="male">Мужской</option>
                                            <option value="female">Женский</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Часовой пояс"
                                        {...profileForm.register('timezone')}
                                        placeholder="Europe/Moscow"
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="mt-8" disabled={updateProfileMutation.isPending}>
                                {updateProfileMutation.isPending ? <Spinner size="sm" /> : 'Сохранить изменения'}
                            </Button>
                        </form>
                    )}

                    {/* ВКЛАДКА БЕЗОПАСНОСТЬ */}
                    {activeTab === 'security' && (
                        <div className="max-w-lg animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Безопасность</h2>
                            <form
                                onSubmit={passwordForm.handleSubmit(onChangePassword)}
                                className="space-y-5 mb-10"
                            >
                                <Input
                                    label="Текущий пароль"
                                    type="password"
                                    {...passwordForm.register('oldPassword', { required: true })}
                                />
                                <Input
                                    label="Новый пароль"
                                    type="password"
                                    {...passwordForm.register('newPassword', { required: true, minLength: 8 })}
                                />
                                <Input
                                    label="Повторите новый пароль"
                                    type="password"
                                    {...passwordForm.register('confirmPassword', { required: true })}
                                />
                                <Button type="submit" className="mt-2" disabled={updatePasswordMutation.isPending}>
                                    {updatePasswordMutation.isPending ? <Spinner size="sm" /> : 'Обновить пароль'}
                                </Button>
                            </form>
                            <div className="border-t border-red-100 pt-6 mt-6">
                                <h3 className="text-red-600 font-bold flex items-center gap-2 mb-2">
                                    <AlertTriangle size={20} /> Опасная зона
                                </h3>
                                <Button variant="secondary" onClick={onDeleteAccount} className="flex items-center gap-2">
                                    <Trash2 size={16} /> Удалить аккаунт
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* ВКЛАДКА УВЕДОМЛЕНИЯ */}
                    {activeTab === 'notifications' && (
                        <div className="max-w-lg animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-6">Уведомления</h2>
                            <div className="space-y-4">
                                {[
                                    { key: 'email', label: 'Email: Новые сообщения' },
                                    { key: 'email_status', label: 'Email: Смена статуса' },
                                    { key: 'push', label: 'Push-уведомления' },
                                ].map((item) => (
                                    <label key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <span className="text-gray-700">{item.label}</span>
                                        <input
                                            type="checkbox"
                                            checked={user?.preferences?.[item.key] || false}
                                            onChange={(e) => toggleNotification(item.key, e.target.checked)}
                                            className="w-5 h-5 text-[#3CE8D1] rounded"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ВКЛАДКА РЕФЕРАЛЬНАЯ ПРОГРАММА */}
                    {activeTab === 'referral' && (
                        <div className="max-w-xl animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Реферальная программа</h2>
                            <div className="flex gap-2">
                                <input
                                    readOnly
                                    value={`${window.location.origin}/register?ref=${user?.id}`}
                                    className="flex-1 p-3 bg-gray-50 border rounded-lg text-gray-600 font-mono text-sm"
                                />
                                <button
                                    onClick={copyLink}
                                    className="bg-[#3CE8D1] text-[#1D194C] px-4 rounded-lg"
                                >
                                    <Copy size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
