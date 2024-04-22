<?php
//Bindet die Datei config.php
require_once 'config.php';
ob_start();


try {
    $db = new mysqli($_ENV['DB_HOST'], $_ENV['DB_USER'], $_ENV['DB_PASSWORD'], $_ENV['DB_NAME']);
    if ($db->connect_error) { //Überprüft, ob ein Verbindungsfehler aufgetreten ist
        exit(1); //Falls ein Verbindungsfehler gibt, wird es sofort beendet
    }
    //Konstante
    define('db', $db);
} catch (Exception $e) {

    echo "Website is currently not available!";
    exit;
}
