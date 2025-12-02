const Loading = ({ fullScreen = true, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  };

  const containerClasses = fullScreen 
    ? 'flex items-center justify-center min-h-screen' 
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="relative">
        {/* Spinner */}
        <div className={`${sizeClasses[size]} border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin`}></div>
        {/* Pulse effect */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-primary-600 rounded-full animate-ping opacity-20`}></div>
      </div>
    </div>
  );
};

export default Loading;

