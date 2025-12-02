# 🔧 Solution : Problème "Accès réservé aux managers"

## 📋 Problème

Lors de la connexion, vous recevez le message : **"Accès réservé aux managers"**

## 🔍 Cause

Votre compte utilisateur dans la base de données a le rôle `'client'` au lieu de `'manager'`. Le frontend manager exige que les utilisateurs aient le rôle `'manager'` pour accéder au dashboard.

## ✅ Solutions

### Solution 1 : Mettre à jour le rôle via SQL (Recommandé)

1. **Ouvrez votre client MySQL** (phpMyAdmin, MySQL Workbench, ou ligne de commande)

2. **Exécutez cette requête SQL** en remplaçant `'votre_email@example.com'` par votre email :

```sql
USE `e-commerce_db`;

UPDATE users 
SET role = 'manager' 
WHERE email = 'votre_email@example.com';
```

3. **Vérifiez que la mise à jour a fonctionné** :

```sql
SELECT id, full_name, email, role, is_active 
FROM users 
WHERE email = 'votre_email@example.com';
```

Vous devriez voir `role = 'manager'`

4. **Reconnectez-vous** au frontend manager avec vos identifiants.

---

### Solution 2 : Utiliser le script SQL fourni

1. Ouvrez le fichier `Backend/database/UPDATE_USER_TO_MANAGER.sql`
2. Modifiez la ligne avec votre email
3. Exécutez le script dans votre client MySQL

---

### Solution 3 : Créer un nouveau compte manager via l'interface

1. Allez sur `/register` du frontend manager
2. Créez un nouveau compte
3. Le compte sera automatiquement créé avec le rôle `'manager'`

---

### Solution 4 : Vérifier tous les utilisateurs

Pour voir tous les utilisateurs et leurs rôles :

```sql
SELECT id, full_name, email, role, is_active, created_at 
FROM users 
ORDER BY created_at DESC;
```

---

## 🔐 Créer un utilisateur manager directement en SQL

Si vous voulez créer un nouveau compte manager directement dans la base de données :

```sql
USE `e-commerce_db`;

-- Générer d'abord le hash du mot de passe avec PHP :
-- cd Backend
-- php -r "echo password_hash('votre_mot_de_passe', PASSWORD_BCRYPT);"

-- Puis insérer l'utilisateur (remplacez le hash généré) :
INSERT INTO users (full_name, email, password, role, is_active) 
VALUES (
    'Nom Complet',
    'email@example.com',
    '$2y$10$VOTRE_HASH_GENERE_ICI',
    'manager',
    TRUE
);
```

---

## 📝 Notes importantes

1. **Le rôle par défaut** : Quand vous créez un utilisateur normalement, il a le rôle `'client'` par défaut.

2. **Valeurs possibles du rôle** :
   - `'client'` : Accès au frontend client uniquement
   - `'manager'` : Accès au frontend manager uniquement

3. **Sécurité** : Seuls les utilisateurs avec le rôle `'manager'` peuvent accéder au dashboard manager.

4. **Vérification** : Après avoir mis à jour le rôle, déconnectez-vous et reconnectez-vous pour que les changements prennent effet.

---

## 🐛 Debug

Si le problème persiste après avoir mis à jour le rôle :

1. **Vérifiez le token** : Déconnectez-vous et reconnectez-vous pour obtenir un nouveau token
2. **Vérifiez la console** : Ouvrez les outils de développement (F12) et regardez les erreurs dans la console
3. **Vérifiez le localStorage** : 
   - Ouvrez la console
   - Tapez : `localStorage.getItem('manager_token')`
   - Si le token existe, supprimez-le : `localStorage.removeItem('manager_token')`
   - Reconnectez-vous

---

## ✅ Vérification finale

Après avoir mis à jour le rôle, vous devriez pouvoir :
- ✅ Vous connecter au frontend manager
- ✅ Accéder au dashboard
- ✅ Voir toutes les pages protégées

Si vous avez toujours des problèmes, vérifiez que :
- Le backend est démarré
- La base de données est accessible
- Le champ `role` dans la table `users` contient bien `'manager'`

