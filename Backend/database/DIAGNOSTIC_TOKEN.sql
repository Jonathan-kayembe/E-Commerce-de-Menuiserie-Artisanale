-- =====================================================
-- SCRIPT DE DIAGNOSTIC POUR LES TOKENS
-- Exécutez ce script pour vérifier l'état des tokens
-- =====================================================

USE `e-commerce_db`;

-- 1. Vérifier que la table api_tokens existe
SELECT 
    'Vérification table api_tokens' AS test,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Table existe'
        ELSE '❌ Table n''existe pas'
    END AS resultat
FROM INFORMATION_SCHEMA.TABLES
WHERE table_schema = DATABASE() 
  AND table_name = 'api_tokens';

-- 2. Compter les tokens existants
SELECT 
    'Nombre de tokens' AS info,
    COUNT(*) AS total,
    COUNT(CASE WHEN expires_at IS NULL THEN 1 END) AS sans_expiration,
    COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at > NOW() THEN 1 END) AS valides,
    COUNT(CASE WHEN expires_at IS NOT NULL AND expires_at <= NOW() THEN 1 END) AS expires
FROM api_tokens;

-- 3. Vérifier d'abord que la colonne token existe
SELECT 
    'Vérification colonne token' AS test,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Colonne token existe'
        ELSE '❌ Colonne token n''existe pas - Exécutez FIX_API_TOKENS_TABLE.sql'
    END AS resultat
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = DATABASE() 
  AND table_name = 'api_tokens'
  AND column_name = 'token';

-- 4. Afficher tous les tokens avec leurs informations (seulement si la colonne existe)
SELECT 
    at.id,
    at.user_id,
    u.email,
    u.role,
    LEFT(at.token, 20) AS token_preview,
    at.expires_at,
    CASE 
        WHEN at.expires_at IS NULL THEN '✅ Sans expiration'
        WHEN at.expires_at > NOW() THEN '✅ Valide'
        ELSE '❌ Expiré'
    END AS statut,
    at.created_at
FROM api_tokens at
LEFT JOIN users u ON at.user_id = u.id
ORDER BY at.created_at DESC
LIMIT 10;

-- 5. Vérifier l'utilisateur manager
SELECT 
    'Utilisateur manager' AS test,
    id,
    full_name,
    email,
    role,
    is_active,
    CASE 
        WHEN password = '' OR password IS NULL THEN '❌ Pas de mot de passe'
        ELSE '✅ Mot de passe défini'
    END AS statut_password
FROM users
WHERE role = 'manager'
ORDER BY id;

-- 6. Nettoyer les tokens expirés
DELETE FROM api_tokens 
WHERE id > 0
  AND expires_at IS NOT NULL 
  AND expires_at < NOW();

SELECT '✅ Tokens expirés nettoyés' AS message;

-- 7. Afficher les tokens restants
SELECT 
    'Tokens restants après nettoyage' AS info,
    COUNT(*) AS total
FROM api_tokens;

