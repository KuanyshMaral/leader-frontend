export default function Toggle({ label, checked, onChange }) {
  return (
    <label className="flex items-center justify-between cursor-pointer py-3 border-b border-gray-100 last:border-0">
      <span className="text-gray-700 font-medium">{label}</span>
      <div className="relative">
        <input 
            type="checkbox" 
            className="sr-only" 
            checked={checked} 
            onChange={(e) => onChange(e.target.checked)} 
        />
        <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-leader-tiffany' : 'bg-gray-300'}`}></div>
        <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`}></div>
      </div>
    </label>
  );
}