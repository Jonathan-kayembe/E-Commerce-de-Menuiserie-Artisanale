import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-primary-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-display font-bold mb-4 gradient-text bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Menuiserie Artisanale
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Des meubles sur mesure, fabriqués avec passion et savoir-faire par des artisans experts.
            </p>
            <div className="flex gap-4">
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Navigation</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Produits
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Service Client</h4>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link 
                  to="/shipping" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Livraison
                </Link>
              </li>
              <li>
                <Link 
                  to="/returns" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Retours
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-300 hover:text-primary-400 transition-colors flex items-center gap-2 group"
                >
                  <span className="w-1 h-1 bg-primary-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FiMail className="text-primary-400 mt-1 flex-shrink-0" />
                <a 
                  href="mailto:contact@menuiserie.com" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  contact@menuiserie.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiPhone className="text-primary-400 mt-1 flex-shrink-0" />
                <a 
                  href="tel:+33123456789" 
                  className="text-gray-300 hover:text-primary-400 transition-colors"
                >
                  +33 1 23 45 67 89
                </a>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-primary-400 mt-1 flex-shrink-0" />
                <span className="text-gray-300">
                  123 Rue de la Menuiserie<br />
                  75000 Paris, France
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} Menuiserie Artisanale. Tous droits réservés.
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-primary-400 transition-colors">
                Confidentialité
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 transition-colors">
                Conditions
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-primary-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

