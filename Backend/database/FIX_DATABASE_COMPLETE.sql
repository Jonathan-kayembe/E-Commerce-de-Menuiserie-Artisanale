-- =====================================================
-- SCRIPT COMPLET DE CORRECTION DE LA BASE DE DONNÉES
-- Pour permettre la modification des produits et l'upload d'images
-- =====================================================

USE `e-commerce_db`;

-- =====================================================
-- 1. CRÉER LA TABLE api_tokens SI ELLE N'EXISTE PAS
-- =====================================================

CREATE TABLE IF NOT EXISTS api_tokens (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_api_tokens_user_id (user_id),
    INDEX idx_api_tokens_token (token),
    CONSTRAINT fk_api_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. S'ASSURER QUE LE CHAMP image_url EXISTE ET EST NULLABLE
-- =====================================================

-- Vérifier et ajouter la colonne image_url si elle n'existe pas
SET @dbname = DATABASE();
SET @tablename = "products";
SET @columnname = "image_url";
SET @preparedStatement = (SELECT IF(
  (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
    WHERE
      (table_name = @tablename)
      AND (table_schema = @dbname)
      AND (column_name = @columnname)
  ) > 0,
  "SELECT 1",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(255) NULL AFTER slug")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- S'assurer que image_url peut être NULL
ALTER TABLE products MODIFY COLUMN image_url VARCHAR(255) NULL;

-- =====================================================
-- 3. CRÉER/METTRE À JOUR L'UTILISATEUR MANAGER AVEC MOT DE PASSE
-- =====================================================

-- Mot de passe par défaut: "password" (hash bcrypt)
-- Hash: $2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (full_name, email, password, role, is_active) VALUES
('Manager Admin', 'manager@menuiserie.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', TRUE)
ON DUPLICATE KEY UPDATE 
    full_name = 'Manager Admin',
    role = 'manager',
    is_active = TRUE;

-- Si l'utilisateur existe mais n'a pas de mot de passe, le mettre à jour
-- Désactiver temporairement le mode safe update
SET SQL_SAFE_UPDATES = 0;

UPDATE users 
SET password = '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
WHERE id > 0
  AND email = 'manager@menuiserie.com' 
  AND (password = '' OR password IS NULL);

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- 4. CORRIGER LES CHEMINS D'IMAGES DES PRODUITS
-- =====================================================

-- Désactiver temporairement le mode safe update pour permettre les mises à jour
SET SQL_SAFE_UPDATES = 0;

-- Mettre à jour les chemins d'images pour qu'ils pointent vers /images/products/
UPDATE products 
SET image_url = CONCAT('/images/products/', SUBSTRING_INDEX(image_url, '/', -1))
WHERE id > 0
  AND image_url IS NOT NULL 
  AND image_url != '' 
  AND image_url NOT LIKE '/images/products/%'
  AND image_url LIKE '%/%';

-- Corriger les chemins qui commencent par /images/ mais pas /images/products/
UPDATE products 
SET image_url = REPLACE(image_url, '/images/', '/images/products/')
WHERE id > 0
  AND image_url LIKE '/images/%'
  AND image_url NOT LIKE '/images/products/%';

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- 5. NETTOYER LES TOKENS EXPIRÉS
-- =====================================================

-- Désactiver temporairement le mode safe update
SET SQL_SAFE_UPDATES = 0;

DELETE FROM api_tokens 
WHERE id > 0
  AND expires_at IS NOT NULL 
  AND expires_at < NOW();

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- =====================================================
-- 6. VÉRIFICATION ET AFFICHAGE DES RÉSULTATS
-- =====================================================

-- Vérifier que tout est en place
SELECT '✅ Vérification de la configuration' AS etape;

-- Afficher les informations sur api_tokens
SELECT 
    'Table api_tokens' AS element,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Existe'
        ELSE '❌ Manquante'
    END AS statut,
    COUNT(*) AS colonnes
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = DATABASE() AND table_name = 'api_tokens';

-- Afficher les informations sur image_url
SELECT 
    'Colonne image_url' AS element,
    CASE 
        WHEN COUNT(*) > 0 THEN '✅ Existe'
        ELSE '❌ Manquante'
    END AS statut,
    data_type,
    is_nullable
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = DATABASE() 
  AND table_name = 'products' 
  AND column_name = 'image_url';

-- Afficher l'utilisateur manager
SELECT 
    'Utilisateur manager' AS element,
    CASE 
        WHEN COUNT(*) > 0 AND password != '' AND password IS NOT NULL THEN '✅ Configuré'
        WHEN COUNT(*) > 0 THEN '⚠️ Existe mais sans mot de passe'
        ELSE '❌ Manquant'
    END AS statut,
    COUNT(*) AS nombre
FROM users
WHERE email = 'manager@menuiserie.com' AND role = 'manager';

-- Afficher les produits avec leurs images
SELECT 
    id, 
    name, 
    image_url,
    CASE 
        WHEN image_url IS NULL OR image_url = '' THEN '⚠️ Pas d\'image'
        WHEN image_url LIKE '/images/products/%' THEN '✅ Chemin correct'
        ELSE '⚠️ Chemin à corriger'
    END AS statut_image
FROM products
ORDER BY id;

SELECT '✅ Configuration terminée! Vous pouvez maintenant uploader des images.' AS message;
SELECT '📝 Identifiants de connexion:' AS info;
SELECT '   Email: manager@menuiserie.com' AS identifiant;
SELECT '   Mot de passe: password' AS mot_de_passe;

