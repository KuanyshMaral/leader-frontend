import { forwardRef } from 'react';

const Input = forwardRef(({ label, error, ...props }, ref) => {
  return (
    <div className="mb-4 w-full">
      {label && <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>}
      <input
        ref={ref}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-leader-cyan transition-all
          ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}
        `}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error.message}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;