<?php
// Login database credentials from cred.php
require_once 'cred.php';
ob_start();

// Establish a mysqli database connection. If connection fails, exit with status 1; Otherwise, define a constant 'db'
try {
    $db = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    if ($db->connect_error) {
        exit(1);
    }
    //Konstante
    define('db', $db);
} catch (Exception $e) {
    // Display a message if an exception occurs during database connection
    echo "Website is currently not available!";
    exit;
}
