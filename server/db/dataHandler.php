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

    public function queryVotesBySlotId($slot_id)
    {
        $sql = "SELECT users.* from slots join users_slots using(slot_id) join users using(user_id) where slots.slot_id = ?;";
        $stmt = db->prepare($sql);
        $stmt->bind_param("i", $slot_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $creds = array();
        while (($row = $res->fetch_assoc()) !== null) {
            $creds[] = $row;
        }
        return $creds;
    }

    public function queryUserFromAppointment($appointment_id)
    {
        $sql = "SELECT DISTINCT users.*, (SELECT comment 
             FROM users_slots 
             WHERE users_slots.user_id = users.user_id 
             LIMIT 1) AS comment
            FROM appointments
            JOIN slots ON appointments.appointment_id = slots.appointment_id
            JOIN users_slots ON slots.slot_id = users_slots.slot_id
            JOIN users ON users_slots.user_id = users.user_id
            WHERE appointments.appointment_id = ?;";
        $stmt = db->prepare($sql);
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $creds = array();
        while (($row = $res->fetch_assoc()) !== null) {
            $creds[] = $row;
        }
        return $creds;
    }

    public function querySlotsByAppointmentId($appointment_id)
    {
        $sql = "SELECT slots.* from slots join appointments using(appointment_id) where appointment_id = ?";
        $stmt = db->prepare($sql);
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        $res = $stmt->get_result();
        $creds = array();
        while (($row = $res->fetch_assoc()) !== null) {
            $creds[] = $row;
        }
        return $creds;
    }

    public function addSlotsByAppointmentId($data)
    {

        $user_id = $this->addUser($data["name"]);
        foreach ($data["slots"] as $slot_id) {
            $this->addUserSlots($user_id, $slot_id, $data["comment"]);
        }
    }

    private function addUser($name)
    {
        $sql = "INSERT INTO users(`name`) VALUES (?)";
        $stmt = db->prepare($sql);
        $stmt->bind_param("s", $name);
        $stmt->execute();
        $insertedUserId = $stmt->insert_id;
        return $insertedUserId;
    }

    private function addUserSlots($user_id, $slot_id, $comment)
    {
        $sql = "INSERT INTO users_slots(`user_id`, `slot_id`, `comment`) "
            . "VALUES (?, ?, ?)";
        $stmt = db->prepare($sql);
        $stmt->bind_param("iis", $user_id, $slot_id, $comment);
        $stmt->execute();
        return $stmt;
    }

    private static function getAppointments()
    {
        $sql = "SELECT appointments.*, users.name as organizer_name FROM appointments join users ON appointments.organizer_id = users.user_id";
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
