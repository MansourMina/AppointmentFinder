<?php
class Appointment
{
  public $id;
  public $title;
  public $description;
  public $location;
  public $date;
  public $expiry_date;
  public $start_date;
  public $end_date;
  public $organizer;
  public $duration;
  public $votes;

  function __construct($id, $title, $description, $location, $date, $expiry_date, $start_date, $end_date, $organizer, $duration, $votes)
  {
    $this->id = $id;
    $this->title = $title;
    $this->description = $description;
    $this->location = $location;
    $this->date = $date;
    $this->expiry_date = $expiry_date;
    $this->start_date = $start_date;
    $this->end_date = $end_date;
    $this->organizer = $organizer;
    $this->duration = $duration;
    $this->votes = $votes;
  }
}
