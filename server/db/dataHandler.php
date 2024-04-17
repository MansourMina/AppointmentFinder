<?php
include("./models/appointments.php");
include_once 'db.php';

class DataHandler
{
    public function queryAppointments()
    {
        $res =  $this->getAppointments();
        return $res;
    }

    public function queryAppointmentsById($id)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->id == $id) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    public function queryAppintmentsByDate($date)
    {
        $result = array();
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->date == $date) {
                array_push($result, $val);
            }
        }
        return $result;
    }

    private static function getAppointments()
    {
        $sql = "SELECT * FROM slots";
        $stmt = db->prepare($sql);
        $stmt->execute();
        $res = $stmt->get_result();
        $creds = array();
        while (($row = $res->fetch_assoc()) !== null) {
            $creds[] = $row;
        }
        return $creds;
    }
}
