import { useState } from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implémenter l'envoi du formulaire
    toast.success('Votre message a été envoyé avec succès !');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Contactez-nous</h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Informations de contact */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nos Coordonnées</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Adresse</h3>
                  <p className="text-gray-700">
                    123 Rue de l'Artisanat<br />
                    75000 Paris, France
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Téléphone</h3>
                  <p className="text-gray-700">
                    <a href="tel:+33123456789" className="hover:text-primary-600">
                      +33 1 23 45 67 89
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                  <p className="text-gray-700">
                    <a href="mailto:contact@menuiserie-artisanale.fr" className="hover:text-primary-600">
                      contact@menuiserie-artisanale.fr
                    </a>
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Horaires</h3>
                  <p className="text-gray-700">
                    Lundi - Vendredi : 9h - 18h<br />
                    Samedi : 10h - 16h<br />
                    Dimanche : Fermé
                  </p>
                </div>
              </div>
            </div>

            {/* Formulaire de contact */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Sujet
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors font-medium"
                >
                  Envoyer le message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

