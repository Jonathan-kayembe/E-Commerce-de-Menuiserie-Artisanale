# Checklist de Tests Manuels - Frontend Client

## 🔐 Tests d'Authentification

### 1. Connexion
- [ ] Accéder à `/login`
- [ ] Saisir email et mot de passe valides
- [ ] Vérifier la redirection vers la page d'origine ou `/products`
- [ ] Vérifier que le token est stocké dans `localStorage`
- [ ] Vérifier que l'utilisateur est affiché dans le header

### 2. Inscription
- [ ] Accéder à `/register`
- [ ] Remplir le formulaire (nom, email, mot de passe, confirmation)
- [ ] Vérifier la validation (mot de passe min 8 caractères, email valide)
- [ ] Vérifier la redirection après inscription réussie
- [ ] Vérifier que l'utilisateur est automatiquement connecté

### 3. Déconnexion
- [ ] Cliquer sur "Déconnexion" dans le menu utilisateur
- [ ] Vérifier la redirection vers la page d'accueil
- [ ] Vérifier que le token est supprimé de `localStorage`
- [ ] Vérifier que les pages protégées redirigent vers `/login`

### 4. Protection des Routes
- [ ] Essayer d'accéder à `/cart` sans être connecté → doit rediriger vers `/login`
- [ ] Essayer d'accéder à `/checkout` sans être connecté → doit rediriger vers `/login`
- [ ] Essayer d'accéder à `/profile` sans être connecté → doit rediriger vers `/login`
- [ ] Essayer d'accéder à `/orders` sans être connecté → doit rediriger vers `/login`
- [ ] Après connexion, vérifier la redirection vers la page demandée

---

## 🔍 Tests de Recherche et Filtres

### 1. Recherche
- [ ] Accéder à `/products`
- [ ] Saisir un terme de recherche dans le champ
- [ ] Vérifier que les résultats se filtrent en temps réel
- [ ] Vérifier que la recherche fonctionne sur :
  - [ ] Nom du produit
  - [ ] Description
  - [ ] Marque
- [ ] Vérifier le compteur de résultats
- [ ] Vérifier le message "Aucun produit trouvé" si aucun résultat

### 2. Filtre par Catégorie
- [ ] Sélectionner une catégorie dans le select
- [ ] Vérifier que seuls les produits de cette catégorie sont affichés
- [ ] Sélectionner "Toutes les catégories"
- [ ] Vérifier que tous les produits sont affichés
- [ ] Combiner recherche + filtre catégorie
- [ ] Vérifier que les deux filtres fonctionnent ensemble

### 3. Tri
- [ ] Trier par "Nom (A-Z)" → vérifier l'ordre alphabétique
- [ ] Trier par "Prix croissant" → vérifier l'ordre croissant
- [ ] Trier par "Prix décroissant" → vérifier l'ordre décroissant
- [ ] Combiner tri + recherche + filtre catégorie

### 4. Réinitialisation
- [ ] Appliquer des filtres
- [ ] Cliquer sur "Réinitialiser les filtres"
- [ ] Vérifier que tous les filtres sont réinitialisés

---

## 🛍️ Tests de Produits

### 1. Liste des Produits
- [ ] Accéder à `/products`
- [ ] Vérifier l'affichage en grille
- [ ] Vérifier que les prix sont en $ CAD
- [ ] Vérifier les images (fallback si erreur)
- [ ] Vérifier les badges de stock (rupture, limité)

### 2. Hover sur Produits
- [ ] Survoler une carte produit
- [ ] Vérifier l'apparition des boutons "Voir" et "Ajouter au panier"
- [ ] Cliquer sur "Voir" → doit rediriger vers `/products/:id`
- [ ] Cliquer sur "Ajouter au panier" :
  - [ ] Si connecté → produit ajouté, toast de succès
  - [ ] Si non connecté → redirection vers `/login`

### 3. Détail d'un Produit
- [ ] Accéder à `/products/:id`
- [ ] Vérifier l'affichage de :
  - [ ] Images (galerie si plusieurs)
  - [ ] Nom, description, prix ($ CAD)
  - [ ] Matériau, couleur, finition
  - [ ] Stock disponible
  - [ ] Avis clients (si disponibles)
- [ ] Modifier la quantité
- [ ] Ajouter au panier → vérifier le toast de succès

---

## 🛒 Tests du Panier

### 1. Ajout au Panier
- [ ] Ajouter un produit depuis la liste
- [ ] Ajouter un produit depuis le détail
- [ ] Vérifier le badge du panier dans le header (compteur)
- [ ] Vérifier la persistance dans `localStorage`
- [ ] Ajouter le même produit plusieurs fois → vérifier l'incrémentation

### 2. Gestion du Panier
- [ ] Accéder à `/cart`
- [ ] Vérifier l'affichage de tous les articles
- [ ] Modifier la quantité avec +/- :
  - [ ] Vérifier la mise à jour en temps réel
  - [ ] Vérifier que la quantité ne peut pas être < 1
- [ ] Supprimer un article
- [ ] Vérifier le calcul du total (sous-total + taxes)
- [ ] Vérifier que les prix sont en $ CAD

### 3. Panier Vide
- [ ] Vider le panier
- [ ] Vérifier le message "Votre panier est vide"
- [ ] Vérifier le lien "Continuer vos achats"

### 4. Synchronisation
- [ ] Ajouter des produits sans être connecté (panier local)
- [ ] Se connecter
- [ ] Vérifier que le panier local est synchronisé avec le backend

---

## 💳 Tests de Checkout (Paiement Fictif)

### 1. Passage de Commande
- [ ] Accéder à `/checkout` avec un panier non vide
- [ ] Vérifier le récapitulatif des articles
- [ ] Vérifier le calcul du total ($ CAD)

### 2. Adresse de Livraison
- [ ] Sélectionner une adresse existante (si disponible)
- [ ] OU cocher "Utiliser une nouvelle adresse"
- [ ] Remplir le formulaire d'adresse
- [ ] Vérifier la validation des champs requis

### 3. Paiement Fictif ⚠️
- [ ] Vérifier l'avertissement jaune : "⚠️ Paiement simulé — aucun prélèvement réel"
- [ ] Vérifier le message explicatif
- [ ] Vérifier que le champ "Numéro de carte" est désactivé
- [ ] Vérifier que le numéro d'exemple est pré-rempli (`4242 4242 4242 4242`)
- [ ] Vérifier que les champs Date/CVV sont désactivés
- [ ] Vérifier le texte "Paiement fictif simulé"

### 4. Confirmation de Commande
- [ ] Cliquer sur "Confirmer la commande"
- [ ] Vérifier le loader pendant le traitement
- [ ] Vérifier le toast : "Commande enregistrée — paiement fictif effectué"
- [ ] Vérifier la redirection vers `/orders`
- [ ] Vérifier que le panier est vidé

### 5. Vérification Backend
- [ ] Vérifier dans la base de données que la commande est créée
- [ ] Vérifier que `payment_method = "FAKE_PAYMENT"`
- [ ] Vérifier que `payment_status = "PAID"` (ou `"SIMULATED"`)
- [ ] Vérifier qu'aucun prélèvement réel n'a été effectué

---

## 👤 Tests du Profil

### 1. Affichage du Profil
- [ ] Accéder à `/profile`
- [ ] Vérifier l'affichage des informations utilisateur
- [ ] Vérifier les onglets : "Informations personnelles", "Mot de passe", "Adresses"

### 2. Modification du Profil
- [ ] Modifier le nom complet
- [ ] Modifier l'email
- [ ] Vérifier la validation (email valide)
- [ ] Enregistrer → vérifier le toast de succès
- [ ] Vérifier que les données sont mises à jour

### 3. Changement de Mot de Passe
- [ ] Aller dans l'onglet "Mot de passe"
- [ ] Saisir le mot de passe actuel
- [ ] Saisir un nouveau mot de passe (min 8 caractères)
- [ ] Confirmer le nouveau mot de passe
- [ ] Vérifier la validation (mots de passe identiques)
- [ ] Enregistrer → vérifier le toast de succès

### 4. Gestion des Adresses
- [ ] Aller dans l'onglet "Adresses"
- [ ] Vérifier la liste des adresses existantes
- [ ] Cliquer sur "Ajouter une adresse"
- [ ] Remplir le formulaire (rue, ville, province, code postal, pays)
- [ ] Ajouter → vérifier le toast de succès
- [ ] Vérifier l'affichage de la nouvelle adresse
- [ ] Supprimer une adresse → vérifier la confirmation
- [ ] Vérifier la suppression

---

## 📦 Tests des Commandes

### 1. Liste des Commandes
- [ ] Accéder à `/orders`
- [ ] Vérifier l'affichage de toutes les commandes
- [ ] Vérifier pour chaque commande :
  - [ ] Numéro de commande
  - [ ] Statut avec couleur (livrée, expédiée, payée, etc.)
  - [ ] Date de commande
  - [ ] Nombre d'articles
  - [ ] Total en $ CAD
  - [ ] Aperçu des produits (3 premiers)
- [ ] Vérifier le lien "Voir les détails"

### 2. Détail d'une Commande
- [ ] Cliquer sur "Voir les détails" d'une commande
- [ ] Vérifier l'affichage complet :
  - [ ] Informations de la commande
  - [ ] Liste complète des articles
  - [ ] Adresse de livraison
  - [ ] Méthode de paiement (FAKE_PAYMENT)
  - [ ] Statut de paiement
  - [ ] Total en $ CAD

### 3. Panier Vide
- [ ] Accéder à `/orders` sans commandes
- [ ] Vérifier le message "Aucune commande"
- [ ] Vérifier le lien "Découvrir nos produits"

---

## 🎨 Tests d'Interface et UX

### 1. Responsive
- [ ] Tester sur mobile (< 640px)
- [ ] Tester sur tablette (640px - 1024px)
- [ ] Tester sur desktop (> 1024px)
- [ ] Vérifier que toutes les pages sont responsive

### 2. Toast Notifications
- [ ] Vérifier les toasts de succès (vert)
- [ ] Vérifier les toasts d'erreur (rouge)
- [ ] Vérifier les toasts d'information (bleu)
- [ ] Vérifier la position (top-right)
- [ ] Vérifier la fermeture automatique (3s)

### 3. Loaders
- [ ] Vérifier l'affichage des loaders pendant les requêtes
- [ ] Vérifier que les boutons sont désactivés pendant le chargement

### 4. Messages d'Erreur
- [ ] Tester avec des identifiants invalides → vérifier le message d'erreur
- [ ] Tester avec un email invalide → vérifier la validation
- [ ] Tester avec un produit inexistant → vérifier le 404
- [ ] Tester avec un token expiré → vérifier la redirection vers login

### 5. Accessibilité
- [ ] Vérifier les labels sur tous les inputs
- [ ] Vérifier les alt sur toutes les images
- [ ] Vérifier les états de focus sur les boutons
- [ ] Tester la navigation au clavier

---

## 🔄 Tests de Synchronisation

### 1. Panier Local → Backend
- [ ] Ajouter des produits sans être connecté
- [ ] Vérifier la sauvegarde dans `localStorage`
- [ ] Se connecter
- [ ] Vérifier que le panier local est synchronisé avec le backend

### 2. Token Expiré
- [ ] Attendre l'expiration du token (ou supprimer manuellement)
- [ ] Essayer d'accéder à une page protégée
- [ ] Vérifier la redirection vers `/login`
- [ ] Vérifier que le token est supprimé de `localStorage`

---

## ✅ Checklist Finale

- [ ] Tous les tests d'authentification passent
- [ ] Tous les tests de recherche/filtres passent
- [ ] Tous les tests de produits passent
- [ ] Tous les tests du panier passent
- [ ] Tous les tests de checkout passent (paiement fictif vérifié)
- [ ] Tous les tests du profil passent
- [ ] Tous les tests des commandes passent
- [ ] Tous les tests d'interface/UX passent
- [ ] Tous les tests de synchronisation passent
- [ ] Aucune erreur dans la console
- [ ] Tous les prix affichés en $ CAD
- [ ] Paiement fictif correctement implémenté et documenté

---

**Date de test** : _______________
**Testeur** : _______________
**Résultat** : ✅ Passé / ❌ Échec

