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
  $('#showDeadline').show();
  $('#toggleCreateAppointment').on('click', function () {
    toggle_create_button($(this));
    $('#newAppointmentField').slideToggle();
    $('#appointments').slideToggle();
  });
  $('.addTime').on('click', function () {
    create_time($('#duration').val());
  });

  $('#duration').on('change', function () {
    if ($(this).val() >= 5) {
      $('#times').empty();
      $('.time').remove();
      create_date($(this).val());
      create_time($(this).val());
      createDeadline($('.date').val());
    } else {
      hideTimes();
    }
  });
  if ($('#duration').val() >= 5) {
    create_date($(this).val());
  }

  $('#times').on('change', '.time', function () {
    if ($('#duration').val() >= 5) {
      add_time_slots($(this), $('#duration').val());
    }
  });
  $('#expiry_date').on('change', '.deadline', function () {
    choosenSlots.deadline = date_from_picker($(this).val());
  });
  $('#times').on('change', '.date', function () {
    choosenSlots.deadline = date_from_picker($(this).val());
    createDeadline($(this).val());
    choosenSlots.appointment_date = date_from_picker($(this).val());
  });
  $('#createAppointmentForm').submit(async function (event) {
    event.preventDefault();
    clear_page();
    await create_appointment();
    reset_new_appointment();
    await load_appointments();
  });
});

function hideTimes() {
  $('#expiry_date').empty();
  $('#times').empty();
  $('.addTime').addClass('d-none');
}

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

function create_time_picker(withTime, time, duration, maxDate) {
  if (maxDate != 0) maxDate = date_from_picker(maxDate);
  time.datetimepicker({
    format: 'Y-m-dTH:i',
    inline: true,
    datepicker: !withTime,
    timepicker: withTime,
    lang: 'ru',
    step: Number(duration),
    minDate: 0,
    maxDate: maxDate == 0 ? false : maxDate,
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
  const pad = (num) => num.toString().padStart(2, '0');
  const hour = pad(selectedDate.getHours());
  const minute = pad(selectedDate.getMinutes());
  const second = pad(selectedDate.getSeconds());

  var startDate = new Date(choosenSlots.appointment_date);
  startDate.setHours(hour);
  startDate.setMinutes(minute);
  startDate.setSeconds(second);
  if (
    choosenSlots.slots.find((el) => el.start.getTime() === startDate.getTime())
  )
    return;

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
  $('#times').on('change', '.time', validate_fields);
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
    choosenSlots.deadline &&
    choosenSlots.slots.length > 0
  ) {
    $('#createAppointment').attr('disabled', false);

    return true;
  } else {
    return false;
  }
}

function adjust_dates() {
  const formatDate = (date) => {
    const pad = (num) => num.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
  };
  if (choosenSlots.deadline > choosenSlots.appointment_date) {
    choosenSlots.deadline = choosenSlots.appointment_date;
  }
  choosenSlots.appointment_date = formatDate(
    new Date(choosenSlots.appointment_date),
  );
  choosenSlots.deadline = formatDate(new Date(choosenSlots.deadline));

  choosenSlots.slots.forEach((slot) => {
    slot.start = formatDate(new Date(slot.start));
    slot.end = formatDate(new Date(slot.end));
  });
}

function reset_new_appointment() {
  $('#name').val('');
  $('#title').val('');
  $('#description').val('');
  $('#location').val('');
  $('#times').empty();
  $('.time').remove();
  $('#expiry_date').empty();
  $('.addTime').addClass('d-none');
  choosenSlots = {
    appointment_date: null,
    slots: [],
    deadline: null,
  };
  $('#duration').val('');
  toggle_create_button($('#toggleCreateAppointment'));
  $('#newAppointmentField').slideToggle();
  $('#appointments').slideToggle();
}

function push_storage(appointment_id) {
  let oldAppointmentsStorage = JSON.parse(localStorage.getItem('appointments'));
  oldAppointmentsStorage;

  if (oldAppointmentsStorage != null) {
    oldAppointmentsStorage.push(appointment_id);
    localStorage.setItem(
      'appointments',
      JSON.stringify(oldAppointmentsStorage),
    );
  } else {
    localStorage.setItem('appointments', JSON.stringify([appointment_id]));
  }
}

function get_storage() {
  let storage = JSON.parse(localStorage.getItem('appointments'));
  return storage ? storage : [];
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
    let appointment_id = await $.ajax({
      type: 'POST',
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
    push_storage(appointment_id);
  } catch (error) {
    error;
  }
}
