import { useForm } from 'react-hook-form';
import { X, UploadCloud } from 'lucide-react';
import { Button } from '@shared/components/ui';
import { DOC_TYPES } from '@shared/constants/docTypes';

interface UploadDocModalProps {
    onClose: () => void;
    onUpload: (data: any) => void;
    defaultDocType?: string;
}

export const UploadDocModal = ({ onClose, onUpload, defaultDocType = '' }: UploadDocModalProps) => {
    const { register, handleSubmit, watch } = useForm({
        defaultValues: { docType: defaultDocType },
    });
    const file = watch('file');

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden">
                {/* Шапка */}
                <div className="bg-[#1D194C] text-white px-6 py-4 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Загрузка документа</h3>
                    <button onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onUpload)} className="p-6 space-y-6">
                    {/* Выбор типа */}
                    <div className="space-y-2">
                        <select
                            {...register('docType', { required: true })}
                            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-[#3CE8D1] outline-none text-sm"
                        >
                            <option value="">Выберите из списка</option>
                            {DOC_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Область загрузки */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-40 flex flex-col items-center justify-center relative hover:bg-gray-100 transition-colors">
                        <input
                            type="file"
                            {...register('file', { required: true })}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <UploadCloud size={32} className="text-gray-400 mb-2" />
                        <p className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                            Выберите или перетащите
                        </p>
                        <p className="text-xs text-gray-400 mt-1">файлы в область</p>
                        {file && file[0] && (
                            <div className="mt-2 text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded">
                                {file[0].name}
                            </div>
                        )}
                    </div>

                    {/* Футер */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-medium text-sm"
                        >
                            ОТМЕНИТЬ
                        </button>
                        <Button
                            type="submit"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm"
                        >
                            ЗАГРУЗИТЬ
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
