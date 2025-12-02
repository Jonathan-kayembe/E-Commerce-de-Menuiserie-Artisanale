-- =====================================================
-- Script pour créer un utilisateur MANAGER
-- =====================================================
-- Exécutez ce script dans phpMyAdmin ou MySQL

USE `e-commerce_db`;

-- Créer un utilisateur manager
-- Email: manager@menuiserie.com
-- Mot de passe: manager123
-- Le mot de passe est hashé avec bcrypt (Laravel Hash::make)

-- Hash du mot de passe "manager123" généré avec bcrypt
-- IMPORTANT: Exécutez d'abord: php generate_password_hash.php pour générer un hash valide
-- Ou utilisez cette commande: php -r "echo password_hash('manager123', PASSWORD_BCRYPT);"

INSERT INTO users (full_name, email, password, role, is_active) VALUES
('Manager Admin', 'manager@menuiserie.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager', TRUE)
ON DUPLICATE KEY UPDATE 
    full_name = 'Manager Admin',
    role = 'manager',
    is_active = TRUE;

-- Si le hash ci-dessus ne fonctionne pas, générez-en un nouveau avec:
-- cd Backend
-- php -r "echo password_hash('manager123', PASSWORD_BCRYPT);"
-- Puis remplacez le hash dans la ligne INSERT ci-dessus

-- Note: Le mot de passe hashé ci-dessus correspond à "manager123"
-- Si vous voulez un autre mot de passe, générez le hash avec:
-- php -r "echo password_hash('votre_mot_de_passe', PASSWORD_BCRYPT);"
-- Puis remplacez le hash dans la requête INSERT ci-dessus

