import { useState, useEffect } from 'react';

const ErrorMessage = ({ message }) => {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      // Disparaître après 3 secondes
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [message]);

  if (!message || !visible) return null;

  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
};

export default ErrorMessage;

