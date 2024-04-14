<?php
include("./models/appointments.php");
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
        $demodata = [
            [new Appointment(1, "Soccer", "Vienna", " ", "2024-10-02", "2024-10-12", "8", "10")],
            [new Appointment(2, "Basketball", "Linz", " ", "2024-03-02", "2024-03-07", "10", "11")],
            [new Appointment(3, "Party", "Berlin", " ", "2024-07-15", "2024-07-20", "15", "17")],
            [new Appointment(4, "Baseball", "London", " ", "2024-08-02", "2024-08-10", "12", "13")],
            [new Appointment(5, "Birtday", "New York", " ", "2024-08-10", "2024-08-20", "14", "15")],
        ];
        return $demodata;
    }
}
