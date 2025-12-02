const Button = ({ 
  children, 
  onClick, 
  disabled = false, 
  variant = 'primary',
  type = 'button',
  className = '',
  icon: Icon,
}) => {
  const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon />}
      {children}
    </button>
  );
};

export default Button;

