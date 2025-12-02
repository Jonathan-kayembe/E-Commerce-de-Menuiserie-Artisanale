-- =====================================================
-- SCRIPT DE CORRECTION DE LA TABLE api_tokens
-- =====================================================

USE `e-commerce_db`;

-- Désactiver temporairement le mode safe update
SET SQL_SAFE_UPDATES = 0;

-- Supprimer la table si elle existe avec une mauvaise structure
DROP TABLE IF EXISTS api_tokens;

-- Créer la table avec la bonne structure
CREATE TABLE api_tokens (
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

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- Vérifier que la table est bien créée
SELECT 
    '✅ Table api_tokens créée' AS message,
    COUNT(*) AS nombre_colonnes
FROM INFORMATION_SCHEMA.COLUMNS
WHERE table_schema = DATABASE() 
  AND table_name = 'api_tokens';

-- Afficher la structure de la table
DESCRIBE api_tokens;

SELECT '✅ Table api_tokens prête à être utilisée!' AS message;

