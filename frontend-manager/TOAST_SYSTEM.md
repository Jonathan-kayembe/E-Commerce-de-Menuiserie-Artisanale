# 🎨 Système de Notifications Toast - Documentation

## 📋 Vue d'ensemble

Système de notifications unifié et moderne pour les deux frontends (Client et Manager) avec un style professionnel cohérent avec la charte graphique de la boutique (thème bois/beige/marron).

---

## ✅ Fonctionnalités

- ✅ **Design professionnel et minimaliste**
- ✅ **Position** : haut-droite (top-right)
- ✅ **Durée d'affichage** : 3 secondes (maximum)
- ✅ **Animation fluide** : entrée par la droite + disparition douce
- ✅ **Disparition automatique** : Tous les messages (toasts et ErrorMessage) disparaissent après 3 secondes
- ✅ **4 types supportés** : success, error, warning, info
- ✅ **Style cohérent** : palette bois/beige/marron
- ✅ **Composant réutilisable** dans les deux frontends
- ✅ **Fonctionne après rafraîchissement** de page
- ✅ **Un seul conteneur** par frontend (pas de doublons)

---

## 🎨 Styles

### Palette de couleurs

- **Success** : Vert (#22c55e) avec fond dégradé beige
- **Error** : Rouge (#ef4444) avec fond dégradé beige
- **Warning** : Orange/Ambre (#f59e0b) avec fond dégradé beige
- **Info** : Bleu (#3b82f6) avec fond dégradé beige

### Caractéristiques visuelles

- **Bordures** : 12px de rayon
- **Ombre** : 0 4px 12px rgba(0, 0, 0, 0.15)
- **Bordure gauche** : 4px de couleur selon le type
- **Effet hover** : légère élévation et ombre plus prononcée
- **Barre de progression** : 3px de hauteur avec dégradé

---

## 📦 Utilisation

### Import du composant

```jsx
import ToastProvider from './components/common/ToastProvider';
```

### Ajout dans App.jsx

```jsx
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* ... vos routes ... */}
        <ToastProvider />
      </BrowserRouter>
    </AuthProvider>
  );
}
```

### Utilisation dans les composants

```jsx
import { toast } from 'react-toastify';

// Success
toast.success('Opération réussie !');

// Error
toast.error('Une erreur est survenue');

// Warning
toast.warning('Attention : stock faible');

// Info
toast.info('Information importante');
```

---

## 🎯 Types de notifications

### 1. Success (Succès)
```jsx
toast.success('Produit ajouté au panier');
toast.success('Commande passée avec succès');
toast.success('Profil mis à jour');
```

### 2. Error (Erreur)
```jsx
toast.error('Erreur lors de la connexion');
toast.error('Produit non disponible');
toast.error('Erreur de validation');
```

### 3. Warning (Avertissement)
```jsx
toast.warning('Stock limité');
toast.warning('Champs obligatoires manquants');
toast.warning('Session expirée dans 5 minutes');
```

### 4. Info (Information)
```jsx
toast.info('Nouvelle fonctionnalité disponible');
toast.info('Mise à jour disponible');
toast.info('Votre commande est en préparation');
```

---

## ⚙️ Configuration

### Paramètres du ToastContainer

- **position** : `"top-right"`
- **autoClose** : `3000` (3 secondes - maximum)
- **hideProgressBar** : `false` (affiche la barre de progression)
- **newestOnTop** : `true` (les nouveaux toasts apparaissent en haut)
- **closeOnClick** : `true` (fermer au clic)
- **pauseOnFocusLoss** : `false` (ne pas mettre en pause si la fenêtre perd le focus)
- **draggable** : `true` (déplaçable)
- **pauseOnHover** : `false` (ne pas mettre en pause au survol)
- **limit** : `5` (maximum 5 toasts simultanés)

### Messages d'erreur statiques

Les composants `ErrorMessage` et les messages d'erreur statiques disparaissent également automatiquement après 3 secondes pour garantir une expérience utilisateur cohérente.

---

## 🎬 Animations

### Entrée
- **Animation** : `slideInRight`
- **Durée** : 0.4s
- **Easing** : `cubic-bezier(0.4, 0, 0.2, 1)`
- **Effet** : Translation depuis la droite avec fade-in

### Sortie
- **Animation** : `slideOutRight`
- **Durée** : 0.3s
- **Easing** : `cubic-bezier(0.4, 0, 0.2, 1)`
- **Effet** : Translation vers la droite avec fade-out

### Hover
- **Transform** : `translateY(-2px)`
- **Box-shadow** : Ombre plus prononcée
- **Transition** : 0.3s

---

## 📱 Responsive

### Desktop (> 480px)
- **Largeur** : 380px
- **Hauteur minimale** : 64px
- **Padding** : 16px 20px

### Mobile (≤ 480px)
- **Largeur** : calc(100% - 32px)
- **Hauteur minimale** : 56px
- **Padding** : 12px 16px
- **Font-size** : 13px

---

## 🔧 Personnalisation

### Modifier les couleurs

Éditez le fichier `src/components/styles/toast.css` :

```css
/* Exemple : modifier la couleur success */
.Toastify__toast--success {
  background: linear-gradient(135deg, #votre-couleur 0%, #ffffff 100%);
  color: #votre-couleur-texte;
  border-left: 4px solid #votre-couleur-bordure;
}
```

### Modifier la durée

Dans `ToastProvider.jsx` :

```jsx
<ToastContainer
  autoClose={3000} // 3 secondes (recommandé)
  // ...
/>
```

**Note** : Tous les messages du système (toasts et ErrorMessage) sont configurés pour disparaître après 3 secondes maximum. Si vous modifiez cette valeur, assurez-vous de mettre à jour également les composants `ErrorMessage` pour maintenir la cohérence.

### Modifier la position

```jsx
<ToastContainer
  position="top-center" // ou "bottom-right", "bottom-left", etc.
  // ...
/>
```

---

## 🐛 Dépannage

### Les toasts ne s'affichent pas

1. Vérifiez que `ToastProvider` est bien ajouté dans `App.jsx`
2. Vérifiez que le CSS est bien importé
3. Vérifiez la console pour les erreurs

### Les toasts s'affichent en double

1. Vérifiez qu'il n'y a qu'un seul `<ToastProvider />` dans `App.jsx`
2. Vérifiez qu'il n'y a pas d'ancien `<ToastContainer />` restant

### Les styles ne s'appliquent pas

1. Vérifiez que `toast.css` est bien importé dans `ToastProvider.jsx`
2. Vérifiez que le chemin d'import est correct
3. Vérifiez que le fichier CSS existe bien

---

## 📝 Exemples d'utilisation

### Dans un formulaire

```jsx
const handleSubmit = async (data) => {
  try {
    await api.createProduct(data);
    toast.success('Produit créé avec succès');
  } catch (error) {
    toast.error('Erreur lors de la création');
  }
};
```

### Dans un contexte

```jsx
const { addToCart } = useCart();

const handleAddToCart = (product) => {
  addToCart(product);
  toast.success(`${product.name} ajouté au panier`);
};
```

### Avec un message personnalisé

```jsx
toast.success('Commande #1234 passée avec succès', {
  position: "top-right",
  autoClose: 3000, // 3 secondes (maximum)
});
```

**Note** : Il est recommandé de ne pas dépasser 3000ms pour maintenir la cohérence avec le reste du système.

---

## 🎨 Charte graphique

Le système de toast respecte la charte graphique de la boutique :

- **Couleurs principales** : Bois (#8B5A2B), Beige (#F5F5DC), Marron (#6B4423)
- **Typographie** : Inter (sans-serif moderne)
- **Style** : Minimaliste, professionnel, élégant
- **Animations** : Fluides et discrètes

---

## ✅ Checklist d'implémentation

- [x] Composant `ToastProvider` créé
- [x] Styles CSS personnalisés créés
- [x] `App.jsx` mis à jour (Manager)
- [x] `App.jsx` mis à jour (Client)
- [x] Anciens `ToastContainer` supprimés
- [x] Animations fluides implémentées
- [x] Responsive design
- [x] Documentation complète

---

**Date** : $(date)
**Version** : 1.0.0

