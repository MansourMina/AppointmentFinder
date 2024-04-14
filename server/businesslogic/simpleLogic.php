<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "queryAppintmentsByDate":
                $res = $this->dh->queryAppintmentsByDate($param);
                break;
            case "queryAppointmentsById":
                $res = $this->dh->queryAppointmentsById($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
