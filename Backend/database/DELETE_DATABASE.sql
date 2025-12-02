-- =====================================================
-- Script pour SUPPRIMER la base de données menuiserie_db
-- ⚠️ ATTENTION : Cette commande supprime TOUTES les données !
-- =====================================================

-- Supprimer la base de données (et toutes ses tables)
DROP DATABASE IF EXISTS menuiserie_db;

-- Vérifier que la base a été supprimée
SHOW DATABASES LIKE 'menuiserie_db';

-- Si aucun résultat n'apparaît, la base a été supprimée avec succès
-- Vous pouvez maintenant exécuter menuiserie_db_schema.sql pour la recréer

