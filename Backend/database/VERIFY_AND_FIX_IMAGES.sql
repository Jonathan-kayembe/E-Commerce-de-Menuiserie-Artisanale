-- =====================================================
-- VÉRIFIER ET CORRIGER LES IMAGES DES PRODUITS
-- =====================================================

USE `e-commerce_db`;

-- 1. Vérifier les produits et leurs images actuelles
SELECT 
    id,
    name,
    image_url,
    CASE 
        WHEN image_url IS NULL OR image_url = '' THEN '❌ Pas d\'image'
        WHEN image_url LIKE '/images/products/%' THEN '✅ Chemin correct'
        ELSE '⚠️ Chemin à corriger'
    END AS statut_image
FROM products
ORDER BY id;

-- 2. Mettre à jour les images pour les produits existants
-- Désactiver temporairement le mode safe update
SET SQL_SAFE_UPDATES = 0;

-- Table en chêne massif (id = 1)
UPDATE products 
SET image_url = '/images/products/table-chene.jpg'
WHERE id = 1 
  AND (image_url IS NULL OR image_url != '/images/products/table-chene.jpg');

-- Chaise design (id = 2)
UPDATE products 
SET image_url = '/images/products/chaise-design.jpg'
WHERE id = 2 
  AND (image_url IS NULL OR image_url != '/images/products/chaise-design.jpg');

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- 3. Vérifier les résultats
SELECT 
    id,
    name,
    image_url,
    '✅ Image configurée' AS statut
FROM products
WHERE id IN (1, 2)
ORDER BY id;

-- 4. Afficher tous les produits avec leurs images
SELECT 
    id,
    name,
    image_url,
    CASE 
        WHEN image_url IS NULL OR image_url = '' THEN '❌ Pas d\'image'
        WHEN image_url LIKE '/images/products/%' THEN '✅ Image configurée'
        ELSE '⚠️ Chemin incorrect'
    END AS statut
FROM products
ORDER BY id;

SELECT '✅ Vérification terminée!' AS message;

