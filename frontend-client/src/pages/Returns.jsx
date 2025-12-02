const Returns = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Politique de Retour</h1>
          
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Droit de Rétractation</h2>
            <p className="text-gray-700 mb-4">
              Conformément à la législation en vigueur, vous disposez d'un délai de <strong>14 jours</strong> 
              à compter de la réception de votre commande pour exercer votre droit de rétractation, sans 
              avoir à justifier de motifs ni à payer de pénalité.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Conditions de Retour</h2>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <p className="text-gray-700">
                <strong>Important :</strong> Les produits doivent être retournés dans leur état d'origine, 
                non utilisés, non montés, avec tous les accessoires et emballages d'origine.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Produits Éligibles au Retour</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Meubles standards (non sur mesure)</li>
              <li>Accessoires et décorations</li>
              <li>Produits non personnalisés</li>
              <li>Produits en parfait état, non montés</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">Produits Non Éligibles</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Meubles sur mesure ou personnalisés</li>
              <li>Produits montés ou utilisés</li>
              <li>Produits endommagés par le client</li>
              <li>Produits dont l'emballage d'origine a été détruit</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Procédure de Retour</h2>
            <ol className="list-decimal list-inside text-gray-700 space-y-3 mb-6">
              <li>
                <strong>Contactez-nous</strong> : Envoyez un email à{' '}
                <a href="mailto:retours@menuiserie-artisanale.fr" className="text-primary-600 hover:underline">
                  retours@menuiserie-artisanale.fr
                </a>{' '}
                ou appelez-nous au{' '}
                <a href="tel:+33123456789" className="text-primary-600 hover:underline">
                  +33 1 23 45 67 89
                </a>
              </li>
              <li>
                <strong>Remplissez le formulaire de retour</strong> : Nous vous enverrons un formulaire 
                de rétractation à compléter.
              </li>
              <li>
                <strong>Préparez le colis</strong> : Remettez le produit dans son emballage d'origine 
                avec tous les accessoires.
              </li>
              <li>
                <strong>Expédition</strong> : Nous organiserons la récupération du colis ou vous fournirons 
                une étiquette de retour prépayée.
              </li>
            </ol>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Frais de Retour</h2>
            <p className="text-gray-700 mb-4">
              Les frais de retour sont à votre charge, sauf en cas de produit défectueux ou d'erreur de 
              notre part. Dans ce cas, nous prendrons en charge tous les frais.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Remboursement</h2>
            <p className="text-gray-700 mb-4">
              Une fois le produit reçu et vérifié, nous procéderons au remboursement dans un délai de 
              <strong> 14 jours</strong>. Le remboursement sera effectué selon le même mode de paiement 
              que celui utilisé lors de la commande.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Échange</h2>
            <p className="text-gray-700 mb-4">
              Si vous souhaitez échanger un produit, contactez-nous. Nous vous guiderons dans la procédure 
              d'échange. Les frais de retour et de réexpédition seront à votre charge, sauf en cas de 
              produit défectueux.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Garantie</h2>
            <p className="text-gray-700 mb-4">
              Tous nos produits bénéficient d'une garantie de 2 ans contre les défauts de fabrication. 
              En cas de problème, contactez-nous et nous trouverons une solution.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mt-8">
              <p className="text-gray-700">
                <strong>Besoin d'aide ?</strong> Notre service client est à votre disposition pour toute 
                question concernant les retours. Contactez-nous à{' '}
                <a href="mailto:contact@menuiserie-artisanale.fr" className="text-primary-600 hover:underline">
                  contact@menuiserie-artisanale.fr
                </a>{' '}
                ou par téléphone au{' '}
                <a href="tel:+33123456789" className="text-primary-600 hover:underline">
                  +33 1 23 45 67 89
                </a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Returns;

