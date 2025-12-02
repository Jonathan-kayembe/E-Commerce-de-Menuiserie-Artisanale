-- =====================================================
-- BASE DE DONNÉES : e-commerce_db
-- Description : Base de données pour l'e-commerce de menuiserie
-- Type : MySQL/MariaDB
-- Version corrigée : Toutes les clés étrangères vérifiées et corrigées
-- =====================================================

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS `e-commerce_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `e-commerce_db`;

-- =====================================================
-- DÉSACTIVER LES VÉRIFICATIONS DE CLÉS ÉTRANGÈRES
-- =====================================================
-- Nécessaire pour pouvoir supprimer les tables sans erreur
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- SUPPRESSION DES TABLES (dans l'ordre inverse des dépendances)
-- =====================================================
-- Supprimer d'abord les tables qui dépendent d'autres tables
DROP TABLE IF EXISTS api_tokens;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS cart_items;
DROP TABLE IF EXISTS carts;
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS users;

-- =====================================================
-- RÉACTIVER LES VÉRIFICATIONS DE CLÉS ÉTRANGÈRES
-- =====================================================
SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- TABLE 1: users - Utilisateurs (TABLE DE BASE - PAS DE DÉPENDANCES)
-- =====================================================
CREATE TABLE users (
    id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'manager') NOT NULL DEFAULT 'client',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    remember_token VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 2: categories - Catégories de produits (TABLE DE BASE - PAS DE DÉPENDANCES)
-- =====================================================
CREATE TABLE categories (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT NULL,
    slug VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_categories_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 3: products - Produits (DÉPEND DE: categories)
-- =====================================================
CREATE TABLE products (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT NULL,
    material VARCHAR(100) NULL,
    color VARCHAR(100) NULL,
    finish VARCHAR(100) NULL,
    price DECIMAL(10,2) NOT NULL CHECK(price >= 0),
    stock INT NOT NULL DEFAULT 0 CHECK(stock >= 0),
    category_id INT UNSIGNED NOT NULL,
    image_url VARCHAR(255) NULL,
    slug VARCHAR(200) UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_products_category_id (category_id),
    INDEX idx_products_is_active (is_active),
    INDEX idx_products_slug (slug),
    CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 4: addresses - Adresses utilisateurs (DÉPEND DE: users)
-- =====================================================
CREATE TABLE addresses (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_addresses_user_id (user_id),
    CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 5: carts - Paniers (DÉPEND DE: users)
-- =====================================================
CREATE TABLE carts (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_carts_user_id (user_id),
    UNIQUE INDEX unique_cart_user (user_id),
    CONSTRAINT fk_carts_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 6: cart_items - Articles du panier (DÉPEND DE: carts, products)
-- =====================================================
CREATE TABLE cart_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    cart_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK(quantity > 0),
    customization JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cart_items_cart_id (cart_id),
    INDEX idx_cart_items_product_id (product_id),
    CONSTRAINT fk_cart_items_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_cart_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 7: orders - Commandes (DÉPEND DE: users, addresses)
-- =====================================================
CREATE TABLE orders (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    status ENUM('en préparation', 'payée', 'expédiée', 'livrée', 'annulée') NOT NULL DEFAULT 'en préparation',
    total_price DECIMAL(10,2) NOT NULL CHECK(total_price >= 0),
    shipping_address_id INT UNSIGNED NULL,
    billing_address_id INT UNSIGNED NULL,
    tracking_number VARCHAR(100) NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_status (status),
    INDEX idx_orders_user_status (user_id, status),
    INDEX idx_orders_shipping_address_id (shipping_address_id),
    INDEX idx_orders_billing_address_id (billing_address_id),
    CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_orders_shipping_address FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_orders_billing_address FOREIGN KEY (billing_address_id) REFERENCES addresses(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 8: order_items - Articles de commande (DÉPEND DE: orders, products)
-- =====================================================
CREATE TABLE order_items (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    quantity INT NOT NULL CHECK(quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    customization JSON NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_items_order_id (order_id),
    INDEX idx_order_items_product_id (product_id),
    CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_order_items_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 9: payments - Paiements (DÉPEND DE: orders)
-- =====================================================
CREATE TABLE payments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNSIGNED NOT NULL UNIQUE,
    method ENUM('carte_bancaire', 'virement', 'cheque') NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK(amount >= 0),
    status ENUM('en attente', 'réussi', 'échoué', 'annulé') NOT NULL DEFAULT 'en attente',
    transaction_id VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 10: reviews - Avis clients (DÉPEND DE: users, products)
-- =====================================================
CREATE TABLE reviews (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    product_id INT UNSIGNED NOT NULL,
    rating INT NOT NULL CHECK(rating >= 1 AND rating <= 5),
    comment TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_reviews_user_id (user_id),
    INDEX idx_reviews_product_id (product_id),
    UNIQUE INDEX unique_user_product (user_id, product_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reviews_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- TABLE 11: api_tokens - Tokens d'authentification API (DÉPEND DE: users)
-- =====================================================
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

-- =====================================================
-- DONNÉES D'EXEMPLE (OPTIONNEL)
-- =====================================================

-- Insérer des catégories d'exemple
INSERT INTO categories (name, description, slug) VALUES
('Tables', 'Tables en bois massif', 'tables'),
('Chaises', 'Chaises artisanales', 'chaises'),
('Armoires', 'Armoires sur mesure', 'armoires')
ON DUPLICATE KEY UPDATE name=name;

-- Insérer des produits d'exemple
INSERT INTO products (name, description, material, color, price, stock, category_id, image_url, slug, is_active) VALUES
('Table en chêne massif', 'Table artisanale 6 places', 'chêne', 'naturel', 599.99, 10, 1, '/images/table-chene.jpg', 'table-chene-massif', TRUE),
('Chaise design', 'Chaise ergonomique en pin', 'pin', 'blanc', 89.99, 25, 2, '/images/chaise-design.jpg', 'chaise-design', TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- =====================================================
-- UTILISATEUR MANAGER PAR DÉFAUT
-- =====================================================
-- Créer un utilisateur manager pour l'administration
-- Email: manager@menuiserie.com
-- Note: Le mot de passe doit être défini manuellement après la création
-- Pour définir le mot de passe, utilisez Laravel ou générez un hash bcrypt

INSERT INTO users (full_name, email, password, role, is_active) VALUES
('Manager Admin', 'manager@menuiserie.com', '', 'manager', TRUE)
ON DUPLICATE KEY UPDATE 
    full_name = 'Manager Admin',
    role = 'manager',
    is_active = TRUE;

-- Pour définir le mot de passe après la création, exécutez:
-- UPDATE users SET password = '$2y$10$...' WHERE email = 'manager@menuiserie.com';
-- 
-- Pour générer un hash de mot de passe, utilisez:
-- cd Backend
-- php -r "echo password_hash('votre_mot_de_passe', PASSWORD_BCRYPT);"
