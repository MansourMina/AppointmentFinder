<?php
include("db/dataHandler.php");

class SimpleLogic
{
    private $dh;
    function __construct()
    {
        $this->dh = new DataHandler();
    }

    function handleRequest($method, $param, $data)
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
                $res = $this->dh->addSlotsByAppointmentId($data);
                break;
            case "createAppointment":
                $res = $this->dh->createAppointment($data);
                break;
            case "deleteAppointment":
                $res = $this->dh->deleteAppointment($param);
                break;
            default:
                $res = -1;
                break;
        }
        return $res;
    }
}
