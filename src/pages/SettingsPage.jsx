import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import Toggle from '../components/Toggle';
import { User, Lock, Bell, Share2, Camera, Copy, Trash2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// --- НОВЫЙ КОМПОНЕНТ ДЛЯ АВАТАРКИ ---
const ProfileAvatar = ({ url, fallbackLetter, onUpload }) => {
    const [imageSrc, setImageSrc] = useState(null);
    const fileInputRef = useRef(null);

    // Загружаем защищенную картинку через Blob
    useEffect(() => {
        if (!url) {
            setImageSrc(null);
            return;
        }

        const fetchImage = async () => {
            try {
                // 1. Убираем лишний /api в начале, если он там продублировался
                const cleanUrl = url.startsWith('/api/api') ? url.replace('/api', '') : url;
                
                // 2. Запрашиваем файл с токеном (responseType: blob)
                const response = await api.get(cleanUrl, { responseType: 'blob' });
                
                // 3. Создаем временную ссылку для браузера
                const objectUrl = URL.createObjectURL(response.data);
                setImageSrc(objectUrl);
            } catch (e) {
                console.error("Не удалось загрузить аватар", e);
                setImageSrc(null);
            }
        };

        fetchImage();
    }, [url]);

    return (
        <div className="relative w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-3xl font-bold text-gray-400 border-2 border-white shadow-md overflow-hidden group">
            {imageSrc ? (
                <img 
                    src={imageSrc} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                />
            ) : (
                <span>{fallbackLetter}</span>
            )}

            {/* Скрытый инпут */}
            <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={onUpload}
            />

            <button 
                type="button" 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-leader-tiffany text-white p-2 rounded-full hover:bg-leader-cyan transition-colors shadow-sm z-10"
                title="Загрузить фото"
            >
                <Camera size={14} />
            </button>
        </div>
    );
};

// --- ОСНОВНАЯ СТРАНИЦА ---

export default function SettingsPage() {
  const { user, fetchUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile'); 
  const [message, setMessage] = useState({ type: '', text: '' });

  const profileForm = useForm();
  const passwordForm = useForm();
  
  const [notifications, setNotifications] = useState({
      email: true,
      push: false,
      sms: false
  });

  useEffect(() => {
    if (user) {
        profileForm.reset({
            fio: user.fio,
            phone: user.phone,
            email: user.email,
            gender: user.gender,
            timezone: user.timezone
        });
        if (user.preferences) {
            setNotifications(prev => ({ ...prev, ...user.preferences }));
        }
    }
  }, [user]);

  // 1. Смена Аватара
  const handleAvatarChange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('docType', 'avatar');

      try {
          const uploadRes = await api.post('/documents/upload', formData, {
              headers: { 'Content-Type': 'multipart/form-data' }
          });
          
          await api.patch('/profile/update', {
              avatar_document_id: uploadRes.data.document_id
          });

          setMessage({ type: 'success', text: 'Фото профиля обновлено' });
          fetchUser(); // Обновляем данные, чтобы получить новый URL
      } catch (error) {
          console.error(error);
          setMessage({ type: 'error', text: 'Ошибка загрузки фото' });
      }
  };

  // 2. Сохранение профиля
  const onSaveProfile = async (data) => {
      try {
          const payload = {
              ...data,
              gender: data.gender === "" ? null : data.gender,
              timezone: data.timezone === "" ? null : data.timezone
          };
          await api.patch('/profile/update', payload);
          setMessage({ type: 'success', text: 'Профиль обновлен' });
          fetchUser();
      } catch (e) {
          setMessage({ type: 'error', text: 'Ошибка сохранения' });
      }
  };

  // 3. Смена пароля
  const onChangePassword = async (data) => {
      if (data.newPassword !== data.confirmPassword) {
          setMessage({ type: 'error', text: 'Пароли не совпадают' });
          return;
      }
      try {
          await api.post('/settings/password', {
              oldPassword: data.oldPassword,
              newPassword: data.newPassword
          });
          setMessage({ type: 'success', text: 'Пароль успешно изменен' });
          passwordForm.reset();
      } catch (e) {
          setMessage({ type: 'error', text: e.response?.data?.error || 'Ошибка' });
      }
  };

  // 4. Удаление
  const onDeleteAccount = async () => {
      if (!window.confirm('Вы уверены? Это действие необратимо.')) return;
      try {
          await api.delete('/profile');
          logout();
      } catch (e) {
          setMessage({ type: 'error', text: 'Не удалось удалить аккаунт.' });
      }
  };

  const toggleNotification = async (key, value) => {
      const newSettings = { ...notifications, [key]: value };
      setNotifications(newSettings);
      try { await api.patch('/settings/preferences', newSettings); } catch (e) {}
  };

  const copyLink = () => {
      navigator.clipboard.writeText(`${window.location.origin}/register?ref=${user?.id}`);
      alert('Ссылка скопирована!');
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Настройки аккаунта</h1>

      <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Меню */}
          <div className="w-full md:w-64 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden shrink-0">
              {[
                  { id: 'profile', label: 'Профиль', icon: User },
                  { id: 'security', label: 'Безопасность', icon: Lock },
                  { id: 'notifications', label: 'Уведомления', icon: Bell },
                  { id: 'referral', label: 'Реферальная программа', icon: Share2, hidden: user?.role === 'partner' },
              ].map(tab => !tab.hidden && (
                  <button
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id); setMessage({type:'', text:''}); }}
                    className={`w-full flex items-center gap-3 px-6 py-4 text-sm font-medium transition-colors border-l-4
                        ${activeTab === tab.id 
                            ? 'border-leader-tiffany bg-blue-50 text-leader-dark' 
                            : 'border-transparent text-gray-600 hover:bg-gray-50'}
                    `}
                  >
                      <tab.icon size={18} />
                      {tab.label}
                  </button>
              ))}
          </div>

          {/* Контент */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 p-8 min-h-[500px]">
              
              {message.text && (
                  <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {message.text}
                  </div>
              )}

              {/* ВКЛАДКА ПРОФИЛЬ */}
              {activeTab === 'profile' && (
                  <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="max-w-lg animate-fade-in">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Личные данные</h2>
                      
                      <div className="flex items-center gap-6 mb-8">
                          {/* Используем наш умный компонент аватара */}
                          <ProfileAvatar 
                              url={user?.avatar} 
                              fallbackLetter={user?.fio?.[0] || 'U'}
                              onUpload={handleAvatarChange}
                          />
                          <div className="text-sm text-gray-500">
                              <p className="font-medium text-gray-700">Фото профиля</p>
                              <p>JPG, PNG до 15 MB.</p>
                          </div>
                      </div>

                      <div className="space-y-5">
                          <Input label="ФИО" {...profileForm.register("fio")} />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Input label="Телефон" {...profileForm.register("phone")} />
                              <Input label="Email" {...profileForm.register("email")} />
                          </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="w-full">
                                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Пол</label>
                                  <select {...profileForm.register("gender")} className="w-full px-4 py-2.5 border rounded-lg bg-white border-gray-300 outline-none">
                                      <option value="">Не указано</option>
                                      <option value="male">Мужской</option>
                                      <option value="female">Женский</option>
                                  </select>
                              </div>
                               <Input label="Часовой пояс" {...profileForm.register("timezone")} placeholder="Europe/Moscow" />
                          </div>
                      </div>

                      <Button type="submit" className="mt-8">Сохранить изменения</Button>
                  </form>
              )}

              {/* Остальные вкладки (Безопасность, Уведомления...) оставляем как были */}
              {activeTab === 'security' && (
                  <div className="max-w-lg animate-fade-in">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Безопасность</h2>
                      <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-5 mb-10">
                          <Input label="Текущий пароль" type="password" {...passwordForm.register("oldPassword", { required: true })} />
                          <Input label="Новый пароль" type="password" {...passwordForm.register("newPassword", { required: true, minLength: 8 })} />
                          <Input label="Повторите новый пароль" type="password" {...passwordForm.register("confirmPassword", { required: true })} />
                          <Button type="submit" className="mt-2">Обновить пароль</Button>
                      </form>
                      <div className="border-t border-red-100 pt-6 mt-6">
                          <h3 className="text-red-600 font-bold flex items-center gap-2 mb-2"><AlertTriangle size={20} /> Опасная зона</h3>
                          <Button variant="danger" onClick={onDeleteAccount} className="flex items-center gap-2"><Trash2 size={16} /> Удалить аккаунт</Button>
                      </div>
                  </div>
              )}

              {activeTab === 'notifications' && (
                  <div className="max-w-lg animate-fade-in">
                      <h2 className="text-xl font-bold text-gray-800 mb-6">Уведомления</h2>
                      <div className="space-y-1">
                          <Toggle label="Email: Новые сообщения" checked={notifications.email} onChange={(v) => toggleNotification('email', v)} />
                          <Toggle label="Email: Смена статуса" checked={notifications.email_status} onChange={(v) => toggleNotification('email_status', v)} />
                          <Toggle label="Push-уведомления" checked={notifications.push} onChange={(v) => toggleNotification('push', v)} />
                      </div>
                  </div>
              )}

              {activeTab === 'referral' && (
                  <div className="max-w-xl animate-fade-in">
                      <h2 className="text-xl font-bold text-gray-800 mb-4">Реферальная программа</h2>
                      <div className="flex gap-2">
                          <input readOnly value={`${window.location.origin}/register?ref=${user?.id}`} className="flex-1 p-3 bg-gray-50 border rounded-lg text-gray-600 font-mono text-sm" />
                          <button onClick={copyLink} className="bg-leader-tiffany text-leader-dark px-4 rounded-lg"><Copy size={20} /></button>
                      </div>
                  </div>
              )}

          </div>
      </div>
    </Layout>
  );
}