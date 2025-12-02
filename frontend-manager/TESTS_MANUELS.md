# Tests Manuels - Dashboard Manager

## 📋 Liste des scénarios de test à exécuter

Cette liste couvre tous les cas d'usage principaux du dashboard Manager.

---

## 🔐 1. Authentification

### Test 1.1: Connexion
- [ ] Accéder à `/login`
- [ ] Saisir email et mot de passe d'un compte manager
- [ ] Vérifier la redirection vers `/dashboard`
- [ ] Vérifier que le token est stocké dans `localStorage` sous `manager_token`
- [ ] Vérifier le toast de succès

### Test 1.2: Connexion avec compte non-manager
- [ ] Essayer de se connecter avec un compte client
- [ ] Vérifier le message d'erreur "Accès réservé aux managers"
- [ ] Vérifier qu'aucun token n'est stocké

### Test 1.3: Inscription
- [ ] Accéder à `/register`
- [ ] Remplir le formulaire avec des données valides
- [ ] Vérifier la création du compte avec rôle manager
- [ ] Vérifier la redirection vers `/dashboard`

### Test 1.4: Déconnexion
- [ ] Cliquer sur "Déconnexion" dans la sidebar
- [ ] Vérifier la suppression du token
- [ ] Vérifier la redirection vers `/login`

### Test 1.5: Protection des routes
- [ ] Se déconnecter
- [ ] Essayer d'accéder directement à `/dashboard`
- [ ] Vérifier la redirection vers `/login`
- [ ] Essayer d'accéder à `/products`, `/orders`, etc.
- [ ] Vérifier que toutes les routes sont protégées

---

## 📦 2. Gestion des Produits

### Test 2.1: Liste des produits
- [ ] Accéder à `/products`
- [ ] Vérifier l'affichage de tous les produits
- [ ] Vérifier les colonnes: Nom, Catégorie, Prix, Stock, Statut
- [ ] Vérifier le formatage des prix en CAD ($)
- [ ] Vérifier les images des produits (ou placeholder)

### Test 2.2: Recherche de produits
- [ ] Utiliser la barre de recherche
- [ ] Rechercher par nom de produit
- [ ] Vérifier que les résultats se filtrent en temps réel
- [ ] Rechercher par description
- [ ] Vérifier que la recherche est insensible à la casse

### Test 2.3: Actions hover sur les produits
- [ ] Survoler une ligne de produit
- [ ] Vérifier l'apparition des boutons "Voir", "Modifier", "Supprimer"
- [ ] Cliquer sur "Voir" → Vérifier la redirection vers `/products/:id/edit`
- [ ] Cliquer sur "Modifier" → Vérifier la redirection vers `/products/:id/edit`
- [ ] Cliquer sur "Supprimer" → Vérifier l'ouverture de la modal de confirmation

### Test 2.4: Création de produit
- [ ] Cliquer sur "Nouveau produit"
- [ ] Remplir tous les champs du formulaire
- [ ] Sélectionner une image
- [ ] Vérifier la prévisualisation de l'image
- [ ] Soumettre le formulaire
- [ ] Vérifier le toast de succès
- [ ] Vérifier la redirection vers `/products`
- [ ] Vérifier que le nouveau produit apparaît dans la liste

### Test 2.5: Modification de produit
- [ ] Cliquer sur "Modifier" sur un produit
- [ ] Vérifier le pré-remplissage du formulaire
- [ ] Vérifier l'affichage de l'image actuelle
- [ ] Modifier certains champs
- [ ] Changer l'image
- [ ] Vérifier la prévisualisation de la nouvelle image
- [ ] Soumettre le formulaire
- [ ] Vérifier le toast de succès
- [ ] Vérifier les modifications dans la liste

### Test 2.6: Suppression de produit
- [ ] Cliquer sur "Supprimer" sur un produit
- [ ] Vérifier l'ouverture de la modal de confirmation
- [ ] Cliquer sur "Annuler" → Vérifier que rien ne se passe
- [ ] Cliquer sur "Supprimer" dans la modal
- [ ] Vérifier le toast de succès
- [ ] Vérifier la disparition du produit de la liste

### Test 2.7: Gestion d'erreurs produits
- [ ] Essayer de créer un produit avec des données invalides
- [ ] Vérifier les messages d'erreur de validation
- [ ] Essayer de modifier un produit inexistant (ID invalide)
- [ ] Vérifier le message d'erreur 404
- [ ] Vérifier la redirection vers `/products`

---

## 🏷️ 3. Gestion des Catégories

### Test 3.1: Liste des catégories
- [ ] Accéder à `/categories`
- [ ] Vérifier l'affichage de toutes les catégories
- [ ] Vérifier les colonnes: Nom, Description, Slug

### Test 3.2: Création de catégorie
- [ ] Cliquer sur "Nouvelle catégorie"
- [ ] Remplir le formulaire
- [ ] Soumettre
- [ ] Vérifier l'ajout dans la liste

### Test 3.3: Modification de catégorie
- [ ] Cliquer sur "Modifier" (icône crayon)
- [ ] Modifier les champs
- [ ] Soumettre
- [ ] Vérifier les modifications

### Test 3.4: Suppression de catégorie
- [ ] Cliquer sur "Supprimer" (icône poubelle)
- [ ] Confirmer dans la popup
- [ ] Vérifier la suppression

---

## 🛒 4. Gestion des Commandes

### Test 4.1: Liste des commandes
- [ ] Accéder à `/orders`
- [ ] Vérifier l'affichage de toutes les commandes
- [ ] Vérifier les colonnes: ID, Client, Statut, Total, Date
- [ ] Vérifier le formatage des prix en CAD
- [ ] Vérifier le formatage des dates en français

### Test 4.2: Recherche de commandes
- [ ] Utiliser la barre de recherche
- [ ] Rechercher par ID de commande
- [ ] Rechercher par nom de client
- [ ] Rechercher par email
- [ ] Vérifier le filtrage en temps réel

### Test 4.3: Filtrage par statut
- [ ] Sélectionner un statut dans le filtre
- [ ] Vérifier que seules les commandes avec ce statut s'affichent
- [ ] Sélectionner "Tous les statuts"
- [ ] Vérifier l'affichage de toutes les commandes

### Test 4.4: Modification de statut (dans la liste)
- [ ] Changer le statut d'une commande via le select
- [ ] Vérifier le toast de succès
- [ ] Vérifier la mise à jour immédiate dans la liste

### Test 4.5: Détail d'une commande
- [ ] Cliquer sur l'icône "Voir" (œil)
- [ ] Vérifier l'affichage des informations client
- [ ] Vérifier l'affichage de l'adresse de livraison (si disponible)
- [ ] Vérifier la liste des articles commandés
- [ ] Vérifier le calcul du total
- [ ] Vérifier l'historique des statuts (si disponible)

### Test 4.6: Modification de statut (dans le détail)
- [ ] Dans la page de détail, changer le statut
- [ ] Ajouter/modifier le numéro de suivi
- [ ] Cliquer sur "Mettre à jour"
- [ ] Vérifier le toast de succès
- [ ] Vérifier la mise à jour dans l'historique
- [ ] Vérifier que le bouton est désactivé si le statut n'a pas changé

### Test 4.7: Gestion d'erreurs commandes
- [ ] Essayer d'accéder à une commande inexistante
- [ ] Vérifier le message d'erreur 404
- [ ] Vérifier la redirection vers `/orders`
- [ ] Simuler une erreur réseau
- [ ] Vérifier le message d'erreur approprié

---

## 👥 5. Gestion des Utilisateurs

### Test 5.1: Liste des utilisateurs
- [ ] Accéder à `/users`
- [ ] Vérifier l'affichage de tous les utilisateurs
- [ ] Vérifier les colonnes: Nom, Email, Rôle, Statut, Date
- [ ] Vérifier les badges de rôle (client/manager)
- [ ] Vérifier les badges de statut (Actif/Inactif)

### Test 5.2: Recherche d'utilisateurs
- [ ] Utiliser la barre de recherche
- [ ] Rechercher par nom
- [ ] Rechercher par email
- [ ] Vérifier le filtrage en temps réel

### Test 5.3: Filtrage par rôle
- [ ] Sélectionner "Client" dans le filtre
- [ ] Vérifier que seuls les clients s'affichent
- [ ] Sélectionner "Manager"
- [ ] Vérifier que seuls les managers s'affichent
- [ ] Sélectionner "Tous les rôles"
- [ ] Vérifier l'affichage de tous les utilisateurs

### Test 5.4: Activation/Désactivation d'utilisateur
- [ ] Cliquer sur l'icône toggle (bascule)
- [ ] Vérifier le changement de statut
- [ ] Vérifier le toast de succès
- [ ] Vérifier la mise à jour visuelle (couleur du badge)

### Test 5.5: Suppression d'utilisateur
- [ ] Cliquer sur l'icône "Supprimer" (poubelle)
- [ ] Vérifier l'ouverture de la modal de confirmation
- [ ] Cliquer sur "Annuler"
- [ ] Cliquer sur "Supprimer" et confirmer
- [ ] Vérifier le toast de succès
- [ ] Vérifier la disparition de l'utilisateur

### Test 5.6: Gestion d'erreurs utilisateurs
- [ ] Si l'endpoint `/api/users` n'existe pas (404)
- [ ] Vérifier que l'application ne crash pas
- [ ] Vérifier l'affichage d'un message approprié
- [ ] Vérifier que la liste est vide mais l'interface reste fonctionnelle

---

## 📊 6. Statistiques

### Test 6.1: Page Statistiques
- [ ] Accéder à `/stats`
- [ ] Vérifier l'affichage des 4 cartes de statistiques
- [ ] Vérifier le formatage des montants en CAD

### Test 6.2: Graphique ventes par mois
- [ ] Vérifier l'affichage du graphique en ligne
- [ ] Vérifier les données par mois
- [ ] Vérifier le formatage des tooltips en CAD
- [ ] Vérifier la légende

### Test 6.3: Top 5 produits
- [ ] Vérifier l'affichage du graphique en barres
- [ ] Vérifier que seuls les 5 meilleurs produits sont affichés
- [ ] Vérifier le formatage des montants
- [ ] Vérifier les noms des produits sur l'axe X

### Test 6.4: Ventes par statut
- [ ] Vérifier l'affichage du graphique en camembert
- [ ] Vérifier les pourcentages
- [ ] Vérifier les couleurs différentes par statut
- [ ] Vérifier le formatage des tooltips

### Test 6.5: Gestion d'erreurs statistiques
- [ ] Simuler une erreur API
- [ ] Vérifier que les graphiques affichent "Aucune donnée disponible"
- [ ] Vérifier que l'application ne crash pas

---

## 🎨 7. UX/UI Générale

### Test 7.1: Loaders
- [ ] Vérifier l'affichage des loaders pendant les chargements
- [ ] Vérifier que les boutons sont désactivés pendant les opérations
- [ ] Vérifier les messages "Chargement...", "Enregistrement...", etc.

### Test 7.2: Toasts
- [ ] Vérifier l'affichage des toasts de succès (vert)
- [ ] Vérifier l'affichage des toasts d'erreur (rouge)
- [ ] Vérifier la position (top-right)
- [ ] Vérifier la durée d'affichage (3 secondes)
- [ ] Vérifier la possibilité de fermer manuellement

### Test 7.3: Modals
- [ ] Vérifier l'overlay sombre
- [ ] Vérifier le centrage de la modal
- [ ] Vérifier les boutons "Confirmer" et "Annuler"
- [ ] Vérifier la fermeture au clic sur l'overlay
- [ ] Vérifier la fermeture avec "Annuler"

### Test 7.4: Navigation
- [ ] Vérifier que la sidebar met en évidence la page active
- [ ] Vérifier tous les liens de navigation
- [ ] Vérifier le logo/titre dans la sidebar
- [ ] Vérifier l'affichage des informations utilisateur

### Test 7.5: Formatage
- [ ] Vérifier que tous les prix sont en CAD ($)
- [ ] Vérifier que toutes les dates sont en français
- [ ] Vérifier le formatage des nombres

---

## 🔒 8. Sécurité

### Test 8.1: Token invalide
- [ ] Modifier manuellement le token dans localStorage
- [ ] Essayer d'accéder à une page protégée
- [ ] Vérifier la redirection vers `/login`
- [ ] Vérifier la suppression du token invalide

### Test 8.2: Token expiré
- [ ] Attendre l'expiration du token (ou simuler)
- [ ] Faire une requête API
- [ ] Vérifier la gestion de l'erreur 401
- [ ] Vérifier la redirection vers `/login`

### Test 8.3: Rôle non-manager
- [ ] Essayer de se connecter avec un compte client
- [ ] Vérifier le refus d'accès
- [ ] Vérifier qu'aucun token n'est stocké

---

## 🌐 9. Gestion des erreurs réseau

### Test 9.1: Backend indisponible
- [ ] Arrêter le backend
- [ ] Essayer d'accéder à une page nécessitant des données
- [ ] Vérifier le message d'erreur approprié
- [ ] Vérifier que l'application ne crash pas

### Test 9.2: Timeout
- [ ] Simuler un timeout réseau
- [ ] Vérifier le message d'erreur
- [ ] Vérifier la possibilité de réessayer

### Test 9.3: Erreur 500
- [ ] Simuler une erreur 500 du serveur
- [ ] Vérifier le message d'erreur
- [ ] Vérifier les logs dans la console

---

## ✅ Checklist finale

- [ ] Tous les tests ci-dessus ont été exécutés
- [ ] Aucune erreur console non gérée
- [ ] Tous les toasts s'affichent correctement
- [ ] Toutes les redirections fonctionnent
- [ ] Tous les formulaires valident correctement
- [ ] Toutes les modals s'ouvrent/ferment correctement
- [ ] Tous les graphiques s'affichent avec des données
- [ ] La navigation est fluide
- [ ] Le design est cohérent
- [ ] Les messages d'erreur sont clairs et utiles

---

**Note**: Cette liste de tests doit être exécutée après chaque déploiement majeur pour s'assurer que toutes les fonctionnalités fonctionnent correctement.

