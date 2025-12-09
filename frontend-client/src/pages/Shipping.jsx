const Shipping = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">$ :Livraison</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Options de Livraison</h2>
            
            <div className="space-y-6 mb-8">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison Standard</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Délai :</strong> 5-7 jours ouvrables<br />
                  <strong>Prix :</strong> 15€ (gratuit à partir de 200€ d'achat)
                </p>
                <p className="text-gray-600 text-sm">
                  Livraison à domicile ou en point relais. Vous recevrez un email de confirmation avec 
                  un numéro de suivi.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison Express</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Délai :</strong> 2-3 jours ouvrables<br />
                  <strong>Prix :</strong> 30€
                </p>
                <p className="text-gray-600 text-sm">
                  Livraison rapide à domicile uniquement. Disponible pour les commandes passées avant 14h.
                </p>
              </div>

              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Livraison sur Mesure</h3>
                <p className="text-gray-700 mb-2">
                  <strong>Délai :</strong> Sur devis<br />
                  <strong>Prix :</strong> Sur devis
                </p>
                <p className="text-gray-600 text-sm">
                  Pour les meubles sur mesure et les commandes volumineuses, nous proposons une livraison 
                  et installation par nos équipes. Contactez-nous pour un devis personnalisé.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Zones de Livraison</h2>
            <p className="text-gray-700 mb-4">
              Nous livrons partout en France métropolitaine. Pour les DOM-TOM et l'international, 
              veuillez nous contacter pour connaître les conditions et tarifs.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Suivi de Commande</h2>
            <p className="text-gray-700 mb-4">
              Une fois votre commande expédiée, vous recevrez un email avec votre numéro de suivi. 
              Vous pourrez suivre l'état de votre livraison en temps réel.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Préparation de la Livraison</h2>
            <p className="text-gray-700 mb-4">
              Pour les meubles volumineux, assurez-vous que le passage est suffisant (escaliers, 
              portes, etc.). Nos livreurs peuvent vous aider à monter les meubles si vous avez 
              choisi l'option "Livraison sur Mesure".
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Questions ?</h2>
            <p className="text-gray-700">
              Si vous avez des questions concernant la livraison, n'hésitez pas à nous contacter 
              à <a href="mailto:contact@menuiserie-artisanale.fr" className="text-primary-600 hover:underline">contact@menuiserie-artisanale.fr</a> 
              ou par téléphone au <a href="tel:+33123456789" className="text-primary-600 hover:underline">+33 1 23 45 67 89</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;

