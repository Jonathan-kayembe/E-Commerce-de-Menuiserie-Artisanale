-- =====================================================
-- CORRIGER LES IMAGES DES PRODUITS EXISTANTS
-- =====================================================

USE `e-commerce_db`;

-- Désactiver temporairement le mode safe update
SET SQL_SAFE_UPDATES = 0;

-- Mettre à jour l'image de la table en chêne massif (id = 1)
UPDATE products 
SET image_url = '/images/products/table-chene.jpg'
WHERE id = 1;

-- Mettre à jour l'image de la chaise design (id = 2)
UPDATE products 
SET image_url = '/images/products/chaise-design.jpg'
WHERE id = 2;

-- Réactiver le mode safe update
SET SQL_SAFE_UPDATES = 1;

-- Vérifier les résultats
SELECT 
    id,
    name,
    image_url,
    CASE 
        WHEN image_url = '/images/products/table-chene.jpg' OR image_url = '/images/products/chaise-design.jpg' THEN '✅ Image configurée'
        WHEN image_url IS NULL OR image_url = '' THEN '❌ Pas d\'image'
        ELSE '⚠️ Autre image'
    END AS statut
FROM products
WHERE id IN (1, 2)
ORDER BY id;

SELECT '✅ Images mises à jour!' AS message;
SELECT '📝 Vérifiez que les images s\'affichent sur http://localhost:8000/images/products/table-chene.jpg' AS info;
SELECT '📝 Vérifiez que les images s\'affichent sur http://localhost:8000/images/products/chaise-design.jpg' AS info;

