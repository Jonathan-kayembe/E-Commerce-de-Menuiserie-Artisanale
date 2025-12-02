<?php
// Script pour générer un hash de mot de passe
// Exécutez: php generate_password_hash.php

require __DIR__ . '/../vendor/autoload.php';

$password = 'manager123';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "Mot de passe: $password\n";
echo "Hash généré: $hash\n";
echo "\n";
echo "SQL à utiliser:\n";
echo "INSERT INTO users (full_name, email, password, role, is_active) VALUES\n";
echo "('Manager Admin', 'manager@menuiserie.com', '$hash', 'manager', TRUE);\n";

