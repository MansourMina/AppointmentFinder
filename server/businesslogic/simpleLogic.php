<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
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
