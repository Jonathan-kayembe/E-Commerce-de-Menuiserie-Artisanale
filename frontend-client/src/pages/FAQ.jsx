import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "Quels sont les délais de livraison ?",
      answer: "Les délais de livraison varient selon le produit et l'option choisie. La livraison standard prend 5-7 jours ouvrables, tandis que la livraison express est disponible en 2-3 jours. Pour les meubles sur mesure, les délais sont indiqués sur devis."
    },
    {
      question: "Proposez-vous des meubles sur mesure ?",
      answer: "Oui, nous proposons des meubles entièrement sur mesure. Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé. Nos artisans travailleront avec vous pour créer la pièce parfaite."
    },
    {
      question: "Quels matériaux utilisez-vous ?",
      answer: "Nous utilisons principalement du bois massif de qualité (chêne, hêtre, pin, etc.) ainsi que des matériaux durables et respectueux de l'environnement. Tous nos matériaux sont soigneusement sélectionnés pour leur qualité et leur durabilité."
    },
    {
      question: "Puis-je retourner un produit ?",
      answer: "Oui, vous disposez d'un délai de 14 jours pour retourner un produit non sur mesure, non monté et en parfait état. Les frais de retour sont à votre charge sauf en cas de produit défectueux. Consultez notre page Retours pour plus d'informations."
    },
    {
      question: "Comment puis-je suivre ma commande ?",
      answer: "Une fois votre commande expédiée, vous recevrez un email avec un numéro de suivi. Vous pourrez suivre l'état de votre livraison en temps réel via ce numéro."
    },
    {
      question: "Proposez-vous l'installation ?",
      answer: "Oui, pour les meubles volumineux et sur mesure, nous proposons un service d'installation par nos équipes. Cette option est disponible lors de la commande ou sur demande. Contactez-nous pour plus d'informations."
    },
    {
      question: "Quels sont les modes de paiement acceptés ?",
      answer: "Nous acceptons les cartes bancaires (Visa, Mastercard), les virements bancaires et les chèques. Le paiement par carte est sécurisé via notre système de paiement en ligne."
    },
    {
      question: "Y a-t-il une garantie sur les produits ?",
      answer: "Tous nos produits bénéficient d'une garantie de 2 ans contre les défauts de fabrication. Cette garantie couvre les problèmes liés à la qualité des matériaux et à la fabrication."
    },
    {
      question: "Puis-je modifier ou annuler ma commande ?",
      answer: "Vous pouvez modifier ou annuler votre commande dans les 24 heures suivant la validation, avant que la production ne commence. Pour les commandes sur mesure, contactez-nous rapidement car la production peut commencer immédiatement."
    },
    {
      question: "Livrez-vous en dehors de la France ?",
      answer: "Nous livrons principalement en France métropolitaine. Pour les DOM-TOM et l'international, veuillez nous contacter pour connaître les conditions et tarifs de livraison."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Questions Fréquentes (FAQ)</h1>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex justify-between items-center"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <span className="text-primary-600 text-xl">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 py-4 bg-white border-t border-gray-200">
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-primary-50 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Vous ne trouvez pas la réponse à votre question ?
            </h2>
            <p className="text-gray-700 mb-4">
              N'hésitez pas à nous contacter. Notre équipe est là pour vous aider.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:contact@menuiserie-artisanale.fr"
                className="inline-block px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors text-center"
              >
                Envoyer un email
              </a>
              <a
                href="tel:+33123456789"
                className="inline-block px-6 py-2 border-2 border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors text-center"
              >
                Appeler : +33 1 23 45 67 89
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;

