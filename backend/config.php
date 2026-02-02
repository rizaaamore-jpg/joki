<?php
// Database configuration (if using MySQL)
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'eliteboost_db');

// Create data directory if not exists
if (!file_exists('data')) {
    mkdir('data', 0777, true);
}

// Create orders.json if not exists
if (!file_exists('data/orders.json')) {
    file_put_contents('data/orders.json', '[]');
}

// Set timezone
date_default_timezone_set('Asia/Jakarta');
?>
