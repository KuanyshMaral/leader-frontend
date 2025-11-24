import { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useInstructions, useInstruction } from '../hooks/useInstructions';

export const InstructionsPage = () => {
    const { data, isLoading } = useInstructions();
    const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
    const { data: selectedInstruction, isLoading: isLoadingInstruction } = useInstruction(selectedSlug || '');

    // Auto-select first instruction
    if (data?.data && data.data.length > 0 && !selectedSlug) {
        setSelectedSlug(data.data[0].slug);
    }

    return (
        <div className="flex gap-6 h-[calc(100vh-12rem)]">
            {/* Sidebar */}
            <aside className="w-80 bg-white rounded-xl shadow-sm p-6 overflow-y-auto">
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="text-[#3CE8D1]" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">Инструкции</h2>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Загрузка...</div>
                ) : data?.data && data.data.length > 0 ? (
                    <nav className="space-y-2">
                        {data.data.map((instruction) => (
                            <button
                                key={instruction.id}
                                onClick={() => setSelectedSlug(instruction.slug)}
                                className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${selectedSlug === instruction.slug
                                        ? 'bg-[#3CE8D1] bg-opacity-10 text-[#1D194C] font-medium'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                            >
                                <span className="flex-1">{instruction.title}</span>
                                <ChevronRight
                                    size={18}
                                    className={`transition-transform ${selectedSlug === instruction.slug ? 'text-[#3CE8D1]' : 'text-gray-400 group-hover:text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </nav>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <p>Инструкции не найдены</p>
                    </div>
                )}
            </aside>

            {/* Content */}
            <main className="flex-1 bg-white rounded-xl shadow-sm p-8 overflow-y-auto">
                {isLoadingInstruction ? (
                    <div className="text-center py-12 text-gray-500">Загрузка...</div>
                ) : selectedInstruction ? (
                    <article className="prose prose-lg max-w-none">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6">{selectedInstruction.title}</h1>
                        <div
                            className="text-gray-700 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: selectedInstruction.content }}
                        />
                    </article>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Выберите инструкцию из списка</p>
                    </div>
                )}
            </main>
        </div>
    );
};
