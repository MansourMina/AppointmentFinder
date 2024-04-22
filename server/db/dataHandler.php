<?php
include_once 'db.php';

class DataHandler //Definiert Klasse DataHandler
{
    public function queryAppointments() 
    {
        $res =  $this->getAppointments(); //Ruft getAppointments auf und speichert das Ergebnis in $res
        return $res; //Gibt die gespeicherten Termine zurück
    }

    public function queryAppointmentsById($id) //Termine werden anhand ihrer ID gefiltert
    {
        $result = array(); //Initialisiert ein leeres Array, um die Ergebnisse zu speichern
        foreach ($this->queryAppointments() as $val) { //Durchläuft alle Termine
            if ($val[0]->id == $id) { //Überprüft, ob die ID des aktuellen Termins mit der gesuchten ID übereinstimmt
                array_push($result, $val); //Wenn die ID´s übereinstimmen, fügt er den Termin zur Ergebnisarray hinzu
            }
        }
        return $result;
    }

    public function queryAppintmentsByDate($date)
    {
        $result = array(); //Hier wird das Datum gefiltert
        foreach ($this->queryAppointments() as $val) {
            if ($val[0]->date == $date) { //Überprüft, ob das Datum des aktuellen Termins mit dem gesuchten Datum übereinstimmt
                array_push($result, $val);
            }
        }
        return $result;
    }
    //Versucht alle Benutzer zu finden, die für einen bestimmten Zeitfenster-Slot gestimmt haben
    public function queryVotesBySlotId($slot_id)
    {
        $sql = "SELECT users.* from slots left join users_slots using(slot_id) left join users using(user_id) where slots.slot_id = ?;";
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

    public function queryUserFromAppointment($appointment_id) //Holt einen Benutzer basierend auf einer Termin-ID
    {
        $sql = "SELECT DISTINCT users.*, (SELECT comment 
             FROM users_slots 
             WHERE users_slots.user_id = users.user_id 
             LIMIT 1) AS comment
            FROM appointments
            left JOIN slots ON appointments.appointment_id = slots.appointment_id
            left JOIN users_slots ON slots.slot_id = users_slots.slot_id
            left JOIN users ON users_slots.user_id = users.user_id
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
        $sql = "SELECT slots.* from slots right join appointments using(appointment_id) where appointment_id = ?";
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
        return $user_id;
    }

    public function createAppointment($data)
    {
        $appointment_id = $this->addAppointment($data["appointment"]);
        foreach ($data["slots"] as $slot) {
            $this->addSlots($appointment_id, $slot["start"], $slot["end"], $data["appointment"]["date"]);
        }
        return $appointment_id;
    }

    public function deleteAppointment($appointment_id)
    {
        $sql = "Delete from appointments where appointment_id = ? ";
        $stmt = db->prepare($sql);
        $stmt->bind_param("i", $appointment_id);
        $stmt->execute();
        return $stmt;
    }

    private function addSlots($appointment_id,  $start, $end, $date)
    {
        $sql = "INSERT INTO `slots`(`appointment_id`, `start`, `end`, `date`) VALUES (?,?,?,?)";
        $stmt = db->prepare($sql);
        $stmt->bind_param("isss", $appointment_id,  $start, $end, $date);
        $stmt->execute();
        return $stmt;
    }

    private function addAppointment($data)
    {

        $sql = "INSERT INTO `appointments`(`title`, `location`, `date`, `expiry_date`, `description`, `organizer_name`) VALUES (?,?,?,?,?,?)";
        $stmt = db->prepare($sql);
        $stmt->bind_param("ssssss", $data["title"], $data["location"], $data["date"], $data["expiry_date"], $data["description"], $data["organizer_name"]);
        $stmt->execute();
        $insertedAppointmentId = $stmt->insert_id;
        return $insertedAppointmentId;
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
        $sql = "SELECT * FROM appointments order by date desc";
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
