import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/toast.css';

/**
 * Composant ToastProvider unifié pour les notifications
 * Style professionnel avec thème bois/beige/marron
 */
const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick={true}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={true}
      pauseOnHover={false}
      limit={5}
      enableMultiContainer={false}
      transition="slide"
    />
  );
};

export default ToastProvider;

