<?php
include("db/dataHandler.php");

class SimpleLogic //deklariert die Klasse SimpleLogic
{
    private $dh; //deklariert eine private Variable $dh
    function __construct()
    {
        $this->dh = new DataHandler(); //erstellt DataHandler und weist dh zu
    }

    function handleRequest($method, $param, $body)
    {
        switch ($method) {
            case "queryAppointments":
                $res = $this->dh->queryAppointments();
                break;
            case "querySlotsByAppointmentId":
                $res = $this->dh->querySlotsByAppointmentId($param);
                break;
            case "queryVotesBySlotId":
                $res = $this->dh->queryVotesBySlotId($param);
                break;
            case "queryUserFromAppointment":
                $res = $this->dh->queryUserFromAppointment($param);
                break;
            case "addSlotsByAppointmentId":
                $res = $this->dh->addSlotsByAppointmentId($body);
                break;
            case "createAppointment":
                $res = $this->dh->createAppointment($body);
                break;
            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);
                break;
            default:
                $res = null;
                break;
        }
        return $res;
    }
}
