import { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import { Trash2, Plus, Save, Building2 } from 'lucide-react';

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState('general'); // general, management, requisites, contacts
  const [isLoading, setIsLoading] = useState(true);

  const { register, control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      inn: '', name: '', tax_system: 'OSN',
      requisites: [], // Массив реквизитов
      management: [], // Массив руководителей
      founders: [],   // Массив учредителей
      contact_persons: [] 
    }
  });

  // Хуки для динамических списков
  const requisitesFields = useFieldArray({ control, name: "requisites" });
  const managementFields = useFieldArray({ control, name: "management" });
  const foundersFields = useFieldArray({ control, name: "founders" });
  const contactsFields = useFieldArray({ control, name: "contact_persons" });

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        // 1. Пробуем получить полную анкету
        const res = await api.get('/profile/company');
        // Если данные есть, заполняем форму
        reset(res.data); 
      } catch (e) {
        if (e.response?.status === 404) {
          // Если компании нет, берем минимум из профиля юзера
          const userRes = await api.get('/profile/me');
          if (userRes.data.company_inn) setValue('inn', userRes.data.company_inn);
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [reset, setValue]);

 const onSubmit = async (data) => {
    try {
        // Подготовка данных (очистка типов)
        const payload = {
            ...data,
            // Преобразуем пустую строку в null, а непустую - в число
            employee_count: data.employee_count ? parseInt(data.employee_count) : null,
            contract_count: data.contract_count ? parseInt(data.contract_count) : null, // Если есть такое поле
            
            // Логика для CEO (как и была)
            ceo_fio: data.management?.[0]?.fio || data.ceo_fio || 'Не указан'
        };

        await api.post('/profile/company', payload);
        alert('Анкета успешно сохранена!');
    } catch (e) {
        console.error(e);
        // Выводим детали ошибки, если они есть
        const errorDetail = e.response?.data?.detail || e.response?.data?.error || e.message;
        alert('Ошибка сохранения: ' + errorDetail);
    }
  };

  if (isLoading) return <Layout><div className="p-8">Загрузка анкеты...</div></Layout>;

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[80vh] flex flex-col">
         {/* Хедер */}
         <div className="px-8 py-6 border-b bg-white flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Карточка компании</h1>
                <p className="text-gray-500 text-sm">Заполните данные для автоматического формирования заявок</p>
            </div>
            <Button onClick={handleSubmit(onSubmit)} className="gap-2">
                <Save size={18} /> Сохранить
            </Button>
         </div>

         <div className="flex flex-1">
            {/* Сайдбар с табами (как в ТЗ) */}
            <div className="w-64 bg-gray-50 border-r border-gray-100 shrink-0">
                {[
                    { id: 'general', label: 'Общая информация' },
                    { id: 'management', label: 'Руководство' },
                    { id: 'founders', label: 'Учредители' },
                    { id: 'requisites', label: 'Банк. реквизиты' },
                    { id: 'contacts', label: 'Контактные лица' }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-left px-6 py-4 text-sm font-medium border-l-4 transition-colors
                            ${activeTab === tab.id 
                                ? 'border-leader-tiffany bg-white text-gray-800 shadow-sm' 
                                : 'border-transparent text-gray-500 hover:bg-gray-100'}
                        `}
                    >
                        {tab.label}
                    </button>
                ))}
                
                {/* Прогресс заполнения */}
                <div className="mt-8 px-6">
                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Заполнено:</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <p className="text-right text-xs text-green-600 font-bold mt-1">45%</p>
                </div>
            </div>

            {/* Контент формы */}
            <div className="flex-1 p-8 overflow-y-auto max-h-[calc(100vh-200px)]">
                
                {/* --- ВКЛАДКА 1: ОБЩАЯ --- */}
                <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                    <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b">Основные сведения</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                        <Input label="ИНН" {...register("inn")} />
                        <Input label="КПП" {...register("kpp")} />
                        <Input label="ОГРН" {...register("ogrn")} />
                        <div className="md:col-span-2">
                            <Input label="Краткое наименование" {...register("name")} />
                        </div>
                        <div className="md:col-span-2">
                            <Input label="Полное наименование" {...register("full_name")} />
                        </div>
                        <div className="md:col-span-2">
                            <Input label="Юридический адрес" {...register("legal_address")} />
                        </div>
                         <div className="md:col-span-2">
                            <Input label="Фактический адрес" {...register("actual_address")} />
                        </div>
                        
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Система налогообложения</label>
                             <select {...register("tax_system")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                                <option value="OSN">ОСН (Общая)</option>
                                <option value="USN">УСН (Упрощенная)</option>
                             </select>
                        </div>
                        <div>
                             <label className="block text-sm font-semibold text-gray-700 mb-1.5">Ставка НДС</label>
                             <select {...register("vat_rate")} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white">
                                <option value="20%">20%</option>
                                <option value="0%">0%</option>
                                <option value="no">Без НДС</option>
                             </select>
                        </div>

                        <Input label="Уставной капитал" {...register("authorized_capital")} />
                        <Input label="Численность сотрудников" {...register("employee_count")} type="number" />
                    </div>
                </div>

                {/* --- ВКЛАДКА 2: РУКОВОДСТВО (Динамический список) --- */}
                <div className={activeTab === 'management' ? 'block' : 'hidden'}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Руководство</h3>
                        <Button size="sm" variant="secondary" onClick={() => managementFields.append({ position: 'Генеральный директор', fio: '' })}>
                            <Plus size={16} className="mr-2"/> Добавить
                        </Button>
                    </div>
                    
                    <div className="space-y-4 max-w-4xl">
                        {managementFields.fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative">
                                <button 
                                    type="button" 
                                    onClick={() => managementFields.remove(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="Должность" {...register(`management.${index}.position`)} />
                                    <Input label="ФИО" {...register(`management.${index}.fio`)} />
                                    <Input label="Дата рождения" type="date" {...register(`management.${index}.birth_date`)} />
                                    <Input label="Паспорт (серия номер)" {...register(`management.${index}.passport`)} />
                                </div>
                            </div>
                        ))}
                        {managementFields.fields.length === 0 && <p className="text-gray-400 text-center py-8">Нет записей</p>}
                    </div>
                </div>

                {/* --- ВКЛАДКА 3: УЧРЕДИТЕЛИ --- */}
                <div className={activeTab === 'founders' ? 'block' : 'hidden'}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Учредители</h3>
                        <Button size="sm" variant="secondary" onClick={() => foundersFields.append({ name: '', share: '' })}>
                             <Plus size={16} className="mr-2"/> Добавить
                        </Button>
                    </div>
                     <div className="space-y-4 max-w-4xl">
                        {foundersFields.fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative">
                                <button type="button" onClick={() => foundersFields.remove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                <div className="grid grid-cols-12 gap-4">
                                    <div className="col-span-8">
                                        <Input label="ФИО / Наименование" {...register(`founders.${index}.name`)} />
                                    </div>
                                    <div className="col-span-4">
                                        <Input label="Доля (%)" {...register(`founders.${index}.share`)} />
                                    </div>
                                    <div className="col-span-12">
                                        <Input label="ИНН" {...register(`founders.${index}.inn`)} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                 {/* --- ВКЛАДКА 4: РЕКВИЗИТЫ --- */}
                 <div className={activeTab === 'requisites' ? 'block' : 'hidden'}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Банковские счета</h3>
                        <Button size="sm" variant="secondary" onClick={() => requisitesFields.append({ bik: '', bank_name: '' })}>
                             <Plus size={16} className="mr-2"/> Добавить счет
                        </Button>
                    </div>
                     <div className="space-y-4 max-w-4xl">
                        {requisitesFields.fields.map((field, index) => (
                            <div key={field.id} className="p-4 border rounded-lg bg-gray-50 relative">
                                <button type="button" onClick={() => requisitesFields.remove(index)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
                                <div className="grid grid-cols-2 gap-4">
                                    <Input label="БИК Банка" {...register(`requisites.${index}.bik`)} />
                                    <Input label="Название Банка" {...register(`requisites.${index}.bank_name`)} />
                                    <Input label="Расчетный счет" {...register(`requisites.${index}.checking_account`)} />
                                    <Input label="Корр. счет" {...register(`requisites.${index}.corr_account`)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
         </div>
      </div>
    </Layout>
  );
}