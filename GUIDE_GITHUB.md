# 🚀 Guide : Mettre le projet sur GitHub

## Étape 1 : Vérifier les fichiers à commiter

Avant de commiter, vérifiez que les fichiers sensibles sont bien ignorés :

```bash
git status
```

Assurez-vous que les fichiers suivants **ne sont pas** dans la liste :
- `.env` (dans Backend, frontend-client, frontend-manager)
- `node_modules/` (dans frontend-client et frontend-manager)
- `vendor/` (dans Backend)
- Fichiers de logs (`.log`)

## Étape 2 : Ajouter tous les fichiers

```bash
git add .
```

## Étape 3 : Faire le premier commit

```bash
git commit -m "Initial commit: E-Commerce Menuisier - Projet complet"
```

## Étape 4 : Créer un dépôt sur GitHub

1. Allez sur [GitHub.com](https://github.com)
2. Cliquez sur le bouton **"+"** en haut à droite
3. Sélectionnez **"New repository"**
4. Donnez un nom à votre dépôt (ex: `e-commerce-menuisier`)
5. **Ne cochez PAS** "Initialize this repository with a README" (vous avez déjà un README)
6. Cliquez sur **"Create repository"**

## Étape 5 : Lier votre dépôt local à GitHub

GitHub vous donnera des instructions, mais voici les commandes :

```bash
# Remplacez VOTRE_USERNAME et NOM_DU_REPO par vos valeurs
git remote add origin https://github.com/VOTRE_USERNAME/NOM_DU_REPO.git
```

## Étape 6 : Pousser votre code vers GitHub

```bash
# Renommer la branche principale en 'main' (si nécessaire)
git branch -M main

# Pousser le code
git push -u origin main
```

## 🔐 Si vous utilisez l'authentification par token

Si GitHub vous demande un mot de passe, vous devrez utiliser un **Personal Access Token** :

1. Allez dans GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquez sur "Generate new token (classic)"
3. Donnez-lui un nom et sélectionnez les permissions `repo`
4. Copiez le token généré
5. Utilisez ce token comme mot de passe lors du `git push`

## 📝 Commandes Git utiles

```bash
# Voir l'état des fichiers
git status

# Voir les modifications
git diff

# Ajouter un fichier spécifique
git add nom-du-fichier

# Faire un commit avec un message
git commit -m "Votre message de commit"

# Voir l'historique des commits
git log

# Pousser les modifications
git push

# Récupérer les modifications depuis GitHub
git pull
```

## ⚠️ Important

- **Ne commitez JAMAIS** les fichiers `.env` contenant vos mots de passe et clés secrètes
- **Ne commitez JAMAIS** les dossiers `node_modules/` et `vendor/` (ils sont déjà dans `.gitignore`)
- Si vous avez accidentellement committé un fichier sensible, utilisez `git rm --cached nom-du-fichier` puis recommittez

## 🎯 Prochaines étapes

Après avoir poussé votre code :

1. Ajoutez une description à votre dépôt GitHub
2. Ajoutez des tags/thèmes si nécessaire
3. Créez un fichier `LICENSE` si vous souhaitez définir une licence
4. Configurez GitHub Pages si vous voulez héberger le frontend (optionnel)

