<?php
include("businesslogic/simpleLogic.php");

$request = $_SERVER['REQUEST_METHOD']; // Holt den type vom Client
$method = "";
$param = "";
$body = "";

if ($request == "POST") {
    $method = isset($_POST["method"]) ? $_POST["method"] : "";
    $param = isset($_POST["param"]) ? $_POST["param"] : "";
    $body = isset($_POST["body"]) ? $_POST["body"] : "";
} else {
    $method = isset($_GET["method"]) ? $_GET["method"] : "";
    $param = isset($_GET["param"]) ? $_GET["param"] : "";
    $body = isset($_GET["body"]) ? $_GET["body"] : "";
}

$logic = new SimpleLogic(); // Erstellt eine Instanz der Klasse SimpleLogic
$result = $logic->handleRequest($method, $param, $body);

if ($result == null) {
    response($request, 204, null);
}  else {
    response($request, 200, $result);
}

function response($request, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($request) {
        case "GET":
        case "POST":
        case "DELETE":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;
        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
