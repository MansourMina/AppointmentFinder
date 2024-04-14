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
            [new Appointment(1, "Soccer", "Fussball wird gespielt", "Wien", "2024-10-02", "2024-10-12", "8", "10", "Mina", 1, array(
                (object) [
                    "name" => "Mina",
                ],
                (object) [
                    "name" => "Bertan"
                ]
            ))],
            [new Appointment(2, "Basketball", "Basketball wird gespielt", "Linz", "2024-03-02", "2024-03-07", "10", "11", "Mina", 2,  array(
                (object) [
                    "name" => "Mina"
                ]
            ))],
            [new Appointment(3, "Party", "Party wird gemacht", "Hamburg", "2024-07-15", "2024-07-20", "15", "17", "Bertan", 3,  array(
                (object) [
                    "name" => "Mina"
                ]
            ))],
            [new Appointment(4, "Baseball", "Baseball wird gespielt", "Bayern", "2024-08-02", "2024-08-10", "12", "13", "Mina", 3,  array(
                (object) [
                    "name" => "Mina"
                ]
            ))],
            [new Appointment(5, "Birtday", "Birtday wird gemacht", "New York", "2024-08-10", "2024-08-20", "14", "15", "Bertan", 3,  array(
                (object) [
                    "name" => "Mina"
                ]
            ))],
        ];
        return $demodata;
    }
}
