import { useState } from 'react';
import { Mail, Lock, User, Phone } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { useRegister } from '../hooks/useRegister';

export const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fio, setFio] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState<'client' | 'agent'>('client');
    const { register, isLoading, error } = useRegister();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await register({ email, password, fio, phone, role });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
            <Input
                type="text"
                label="ФИО"
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                placeholder="Иванов Иван Иванович"
                icon={<User size={20} />}
                required
            />

            <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
                icon={<Mail size={20} />}
                required
            />

            <Input
                type="tel"
                label="Телефон"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (999) 123-45-67"
                icon={<Phone size={20} />}
                required
            />

            <Input
                type="password"
                label="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                icon={<Lock size={20} />}
                required
            />

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Роль
                </label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as 'client' | 'agent')}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CE8D1]"
                >
                    <option value="client">Клиент</option>
                    <option value="agent">Агент</option>
                </select>
            </div>

            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full"
            >
                Зарегистрироваться
            </Button>
        </form>
    );
};
