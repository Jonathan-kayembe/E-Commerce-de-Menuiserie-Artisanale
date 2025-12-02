-- =====================================================
-- Script pour corriger les chemins d'images vers products/
-- =====================================================
-- Exécutez ce script dans phpMyAdmin

USE `e-commerce_db`;

-- Mettre à jour l'image de la "Table en chêne massif"
-- Votre fichier s'appelle : table-chene.jpg dans products/
UPDATE products 
SET image_url = '/images/products/table-chene.jpg'
WHERE name = 'Table en chêne massif' OR id = 1;

-- Mettre à jour l'image de la "Chaise design"
-- Votre fichier s'appelle : chaise-design.jpg dans products/
UPDATE products 
SET image_url = '/images/products/chaise-design.jpg'
WHERE name = 'Chaise design' OR id = 2;

-- Vérifier les mises à jour
SELECT id, name, image_url FROM products WHERE id IN (1, 2);
