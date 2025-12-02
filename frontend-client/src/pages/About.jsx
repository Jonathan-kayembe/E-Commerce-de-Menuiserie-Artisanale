const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">À propos de nous</h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 mb-6">
              Bienvenue chez <strong>Menuiserie Artisanale</strong>, votre spécialiste en mobilier et aménagement sur mesure.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Notre Histoire</h2>
            <p className="text-gray-700 mb-4">
              Depuis plus de 20 ans, nous créons des meubles et des aménagements uniques qui allient 
              tradition artisanale et design moderne. Chaque pièce est conçue avec passion et attention 
              aux détails pour répondre à vos besoins spécifiques.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Notre Mission</h2>
            <p className="text-gray-700 mb-4">
              Nous nous engageons à vous offrir des produits de qualité supérieure, fabriqués avec des 
              matériaux durables et respectueux de l'environnement. Notre équipe d'artisans expérimentés 
              travaille main dans la main avec vous pour transformer vos idées en réalité.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Nos Valeurs</h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li><strong>Qualité</strong> : Nous n'utilisons que les meilleurs matériaux et techniques</li>
              <li><strong>Artisanat</strong> : Chaque pièce est unique et fabriquée à la main</li>
              <li><strong>Durabilité</strong> : Nos produits sont conçus pour durer</li>
              <li><strong>Service client</strong> : Votre satisfaction est notre priorité</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Notre Équipe</h2>
            <p className="text-gray-700 mb-4">
              Notre équipe est composée d'artisans passionnés, de designers créatifs et de professionnels 
              du service client, tous dédiés à vous offrir la meilleure expérience possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

