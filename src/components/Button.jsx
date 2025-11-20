export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-6 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-leader-tiffany text-leader-dark hover:bg-opacity-90 shadow-md", // Тиффани кнопка
    secondary: "bg-leader-dark text-white hover:bg-opacity-90",
    danger: "bg-leader-red text-white hover:bg-opacity-90",
    outline: "border-2 border-leader-dark text-leader-dark hover:bg-gray-50"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}