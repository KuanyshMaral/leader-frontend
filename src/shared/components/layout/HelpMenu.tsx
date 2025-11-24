import { useState } from 'react';
import { HelpCircle, MessageSquare, BookOpen, ChevronDown, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HelpMenuProps {
    onOpenSupportModal: () => void;
}

export const HelpMenu = ({ onOpenSupportModal }: HelpMenuProps) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="mt-auto border-t border-[#1E3567] pt-4">
            {/* Main Help Button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-6 py-3 text-gray-400 hover:text-white hover:bg-[#1E3567] transition-all"
            >
                <div className="flex items-center gap-3">
                    <HelpCircle size={20} />
                    <span className="font-medium">Помощь</span>
                </div>
                {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>

            {/* Submenu */}
            {isExpanded && (
                <div className="pl-6 space-y-1 mt-1">
                    <button
                        onClick={onOpenSupportModal}
                        className="w-full flex items-center gap-3 px-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1E3567] transition-all rounded-r-lg"
                    >
                        <MessageSquare size={18} />
                        <span>Оставить сообщение</span>
                    </button>

                    <button
                        onClick={() => navigate('/instructions')}
                        className="w-full flex items-center gap-3 px-6 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1E3567] transition-all rounded-r-lg"
                    >
                        <BookOpen size={18} />
                        <span>Инструкции</span>
                    </button>
                </div>
            )}
        </div>
    );
};
