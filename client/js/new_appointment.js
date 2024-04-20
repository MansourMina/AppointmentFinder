let choosenSlots = {
  appointment_date: null,
  slots: [],
  deadline: null,
};

let timeCounter = 0;

$(document).ready(function () {
  $('#createAppointment').attr('disabled', true);
  field_validation();
  $('#newAppointmentField').hide();
  $('#showDeadline').hide();
  $('#toggleCreateAppointment').on('click', function () {
    toggle_create_button($(this));
    $('#newAppointmentField').toggle();
    $('#appointments').toggle();
  });
  $('.addTime').on('click', function () {
    create_time($('#duration').val());
  });

  $('#duration').on('change', function () {
    $('#times').empty();
    $('.time').remove();
    create_date($(this).val());
    create_time($('#duration').val());
    createDeadline($('.date').val());
  });

  create_date($('#duration').val());

  $('#times').on('change', '.time', function () {
    add_time_slots($(this), $('#duration').val());
  });
  $('#expiry_date').on('change', '.deadline', function () {
    choosenSlots.deadline = date_from_picker($(this).val());
  });
  $('#times').on('change', '.date', function () {
    choosenSlots.deadline = date_from_picker($(this).val());
    createDeadline($(this).val());
    choosenSlots.appointment_date = date_from_picker($(this).val());
  });
  $('#createAppointment').on('click', function () {
    create_appointment();
  });
});

function toggle_create_button(button) {
  var $button = $(button); // Konvertiere button in ein jQuery-Objekt

  if ($button.hasClass('new')) {
    $button
      .find('i')
      .replaceWith('<i class="fa-solid fa-circle-minus me-2 fa-lg"></i>');
    $button.find('span').text('Cancel Appointment'); // Verwende .text(), um den Text zu aktualisieren
    $button.removeClass('new').addClass('btn-danger');
  } else {
    $button
      .find('i')
      .replaceWith('<i class="fa-solid fa-circle-plus me-2 fa-lg"></i>');
    $button.find('span').text('New Appointment'); // Verwende .text(), um den Text zu aktualisieren
    $button.removeClass('btn-danger').addClass('btn-primary new');
  }
}

function createDeadline(minDate) {
  $('#expiry_date').empty();
  var deadline = $('<input>').addClass('deadline mx-5');
  $('#expiry_date').append(deadline);
  create_time_picker(false, $('.deadline'), duration, minDate);
}

function create_date(duration) {
  if (duration >= 1) {
    var datepickerElement = $('<input>').addClass('date mx-5');
    $('#times').append(datepickerElement);
    create_time_picker(false, $('.date'), duration, 0);
    choosenSlots.appointment_date = new Date();
    choosenSlots.deadline = new Date();
    $('.addTime').removeClass('d-none');
    $('#showDeadline').show();
  }
}

function create_time_picker(withTime, time, duration, minDate) {
  if (minDate != 0) minDate = date_from_picker(minDate);
  time.datetimepicker({
    format: 'Y-m-dTH:i',
    inline: true,
    datepicker: !withTime,
    timepicker: withTime,
    lang: 'de',
    step: Number(duration),
    minDate: minDate,
    minTime: '08:00',
    maxTime: '18:30',
    // Deaktivierung vergangener Tage
    beforeShowDay: function (date) {
      var today = new Date();
      today.setHours(0, 0, 0, 0);
      return date.valueOf() >= today.valueOf() ? [true, ''] : [false, ''];
    },
  });
}

function create_time(duration) {
  var test = $('<input>')
    .addClass('time')
    .attr('id', `timePicker-${timeCounter++}`);
  $('#times').append(test);
  create_time_picker(true, $('.time'), duration, 0);
}

function date_from_picker(date) {
  // date "2024-04-20GMT+020015:20"
  var dateString = date.substring(0, 10); // "2024-04-20"
  var hoursMinutes = date.substring(18); // "15:20"

  // Erstellen des datums
  return new Date(dateString + 'T' + hoursMinutes);
}

function add_time_slots(slot, duration) {
  let selectedDate = date_from_picker(slot.val());
  var startDate = new Date(selectedDate); // Kopie des Startdatums

  var endDate = new Date(startDate.getTime());
  endDate.setMinutes(endDate.getMinutes() + Number(duration));

  let newSlot = { id: slot.attr('id'), start: startDate, end: endDate };
  let index = choosenSlots.slots.findIndex((el) => el.id === newSlot.id);
  if (index !== -1) {
    choosenSlots.slots[index] = newSlot;
  } else {
    choosenSlots.slots.push(newSlot);
  }
}

function field_validation() {
  $('#name').on('change', validate_fields);
  $('#expiry_date').on('change', '.deadline', validate_fields);
  $('#times').on('change', '.date', validate_fields);
  $('#duration').on('change', validate_fields);
  $('#title').on('change', validate_fields);
  $('#description').on('change', validate_fields);
  $('#location').on('change', validate_fields);
}

function validate_fields() {
  var name = $('#name').val();
  var title = $('#title').val();
  var description = $('#description').val();
  var location = $('#location').val();
  // Überprüfen, ob alle Felder ausgefüllt sind
  if (
    name &&
    title &&
    description &&
    location &&
    choosenSlots.appointment_date &&
    choosenSlots.deadline
  ) {
    $('#createAppointment').attr('disabled', false);

    return true;
  } else {
    return false;
  }
}

function adjust_dates() {
  choosenSlots.appointment_date = choosenSlots.appointment_date
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  choosenSlots.deadline = choosenSlots.deadline
    .toISOString()
    .slice(0, 19)
    .replace('T', ' ');
  choosenSlots.slots.forEach((slot) => {
    slot.start = slot.start.toISOString().slice(0, 19).replace('T', ' ');
    slot.end = slot.end.toISOString().slice(0, 19).replace('T', ' ');
  });
}

async function create_appointment() {
  var name = $('#name').val();
  var title = $('#title').val();
  var description = $('#description').val();
  var location = $('#location').val();
  let isValid = validate_fields();
  if (!isValid) return;
  adjust_dates();
  try {
    let adding = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: {
        method: 'createAppointment',
        body: {
          slots: choosenSlots.slots,
          appointment: {
            date: choosenSlots.appointment_date,
            organizer_name: name,
            title,
            description,
            location,
            expiry_date: choosenSlots.deadline,
          },
        },
      },
      dataType: 'json',
    });
    console.log(adding);
  } catch (error) {
    console.log(error);
  }
}
