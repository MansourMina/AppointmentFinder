<?php
include("businesslogic/simpleLogic.php");

$request = $_SERVER['REQUEST_METHOD'];
$method = "";
$param = "";
$body = "";


$method = isset($_GET["method"]) ? $_GET["method"] : "";
$param = isset($_GET["param"]) ? $_GET["param"] : "";
$body = isset($_GET["body"]) ? $_GET["body"] : "";

$logic = new SimpleLogic();
$result = $logic->handleRequest($method, $param, $body);

// if ($request == "GET") {
if ($result == null) {
    response("GET", 400, null);
} else {
    response("GET", 200, $result);
}
// }

function response($request, $httpStatus, $data)
{
    header('Content-Type: application/json');
    switch ($request) {
        case "GET":
            http_response_code($httpStatus);
            echo (json_encode($data));
            break;

        default:
            http_response_code(405);
            echo ("Method not supported yet!");
    }
}
