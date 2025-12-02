import { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff, FiCheckCircle, FiXCircle } from 'react-icons/fi';

const Input = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  placeholder,
  required = false,
  icon,
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const name = props.name;
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="mb-6">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-gray-700 mb-2">
          {label} {required && <span className="text-error-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Icône à gauche */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}

        {/* Input */}
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          placeholder={placeholder}
          required={required}
          className={`input-field ${icon ? 'pl-12' : ''} pr-12 ${error ? 'input-field-error' : ''} ${success ? 'border-success-500 focus:ring-success-500' : ''} ${className}`}
        />

        {/* Bouton de visibilité du mot de passe (priorité sur les autres icônes) */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-20 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
          </button>
        )}
        {/* Icône d'erreur (seulement si pas de mot de passe) */}
        {error && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-error-500 z-10">
            <FiXCircle size={20} />
          </div>
        )}
        {/* Icône de succès (seulement si pas de mot de passe et pas d'erreur) */}
        {success && !error && !isPassword && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-success-500 z-10">
            <FiCheckCircle size={20} />
          </div>
        )}
      </div>

      {/* Message d'erreur */}
      {error && (
        <p className="mt-2 text-sm text-error-600 flex items-center gap-1 animate-slide-down">
          <FiXCircle size={14} />
          {error}
        </p>
      )}

      {/* Message succès */}
      {success && !error && (
        <p className="mt-2 text-sm text-success-600 flex items-center gap-1 animate-slide-down">
          <FiCheckCircle size={14} />
          {success}
        </p>
      )}
    </div>
  );
});

export default Input;
