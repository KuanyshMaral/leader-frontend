import { useForm } from 'react-hook-form';
import { X, AlertCircle } from 'lucide-react';
import Button from '../Button';

export default function ReplaceDocModal({ doc, onClose, onReplace }) {
  const { register, handleSubmit, watch } = useForm();
  const file = watch('file');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-[#2d3748] text-white px-6 py-4 flex justify-between items-center">
          <h3 className="font-bold text-lg">Замена документа</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>

        <div className="p-6 space-y-4">
            <div className="font-bold text-gray-800 text-lg border-b pb-2">
                {doc.file_name}
            </div>

            {/* Предупреждение */}
            <div className="bg-red-50 border border-red-100 p-3 rounded-md flex gap-3 items-start">
                <AlertCircle className="text-red-600 shrink-0" size={20} />
                <p className="text-xs text-red-800 leading-relaxed">
                    <span className="font-bold">Внимание.</span> Имеется ранее загруженная версия документа. 
                    При загрузке новой версии предыдущая будет направлена в Архив.
                </p>
            </div>

            <form onSubmit={handleSubmit(onReplace)} className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Укажите причину замены:</label>
                    <textarea 
                        {...register('reason')}
                        className="w-full p-2 border rounded-md text-sm focus:ring-2 focus:ring-leader-cyan outline-none resize-none"
                        rows="3"
                        placeholder="Введите текст"
                    ></textarea>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 h-32 flex flex-col items-center justify-center relative hover:bg-gray-100 transition-colors">
                    <input 
                        type="file" 
                        {...register('file', { required: true })}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <p className="text-sm font-bold text-gray-600 uppercase text-center">Выберите файл<br/>для замены</p>
                    {file && file[0] && <span className="text-xs text-green-600 mt-1">{file[0].name}</span>}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded font-medium text-sm">
                        ОТМЕНИТЬ
                    </button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold text-sm">
                        ЗАМЕНИТЬ
                    </Button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}