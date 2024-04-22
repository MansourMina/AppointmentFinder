$(document).ready(function () {
  $('#appointments').hide().fadeIn(1000);
  load_appointments();
});

// Berechnet die Dauer des Slots und gibt sie in Stunden oder Minuten zurück.
function get_duration(start, end) {
  let difference = (new Date(end) - new Date(start)) / (1000 * 60 * 60);
  if (difference < 0.5) {
    difference = Math.round(difference * 60);
    return difference + 'min';
  } else {
    return difference.toFixed(1) + 'h';
  }
}

// Erstellt eine Tabelle für die Verfügbarkeit von Slots
function appointmentSlots(isExpired, isEventOver, slots) {
  let tRow = $('<tr>').addClass('text-center');
  let emptySlot = $('<th>').attr('scope', 'col'); // Fügt eine leere Kopfzeile hinzu.
  let thead = $('<thead>');
  tRow.append(emptySlot);
  if (slots && slots.length > 0) {
    slots.forEach((slot) => {
      if (slot.appointment_id) {
        let column = $('<th>')
          .attr({ scope: 'col', id: 'slot-' + slot.slot_id })
          .addClass(`slot ${isExpired || isEventOver ? 'unclickable' : ''}`); // Wenn abgelaufen -> nicht anklickbar

        // Slot Inhalte
        let headerContent = [
          { class: '', text: slot.weekday.toUpperCase() },
          { class: 'slot-date', text: slot.day },
          { class: '', text: slot.month.toUpperCase() },
          {
            class: '',
            text: `${get_time(slot.start)} - ${get_time(slot.end)}`,
          },
          {
            class: '',
            text: get_duration(slot.start, slot.end),
          },
          {
            class: 'fa-solid fa-people-group me-2',
            text: slot.votes.filter((p) => p.participant == true && p.user_id)
              .length,
            icon: true,
          },
        ];
        headerContent.forEach((item) => {
          let element = $('<p>');
          if (item.icon) element.append($('<i>').addClass(item.class));
          else if (item.class.length > 0) element.addClass(item.class);
          element.append($('<span>').text(item.text));
          column.append(element);
        });
        if (!isExpired && !isEventOver) {
          let voteButton = $('<i>').addClass('unchecked checkbox');
          column.append(voteButton);
        }
        tRow.append(column);
      } else {
        let column = $('<th>').attr('scope', 'col');
        let element = $('<p>').text('No Slots yet');
        column.append(element);
        tRow.append(column);
      }
    });
  } else {
    let column = $('<th>').attr('scope', 'col');
    let element = $('<p>').text('No Slots yet');
    column.append(element);
    tRow.append(column);
  }
  thead.append(tRow);
  return thead;
}

// Zeigt die Abstimmungen von User
function votes(slots) {
  let tbody = $('<tbody>');
  if (!slots || slots.length === 0 || slots == null) {
    return tbody.append(
      '<tr><th>No votes</th><td class="bg-danger"></td></tr>',
    );
  }

  let users = []; // Speichert alle Nutzer, die abgestimmt haben.
  slots.forEach((slot) => {
    if (slot.votes[0].user_id) {
      slot.votes.forEach((vote) => {
        if (!users[vote.user_id]) {
          users[vote.user_id] = {
            name: vote.name,
            comment: vote.comment,
            slots: [],
          };
        }
        users[vote.user_id].slots[slot.slot_id] = vote.participant;
      });
    } else {
      tbody.append('<tr><th>No votes</th><td class="bg-danger"></td></tr>');
      return;
    }
  });

  // Erzeugt Zeilen für jeden Nutzer mit seinen Daten und Stimmen
  users.forEach((user) => {
    let tRow = $('<tr>');
    let nameColumn = $('<th>')
      .addClass('')
      .append(
        $('<div>')
          .append($('<i>').addClass('fa-regular fa-user me-2'))
          .append(user.name),
      )
      .append(
        $('<span>')
          .addClass(
            'd-inline-block text-truncate mt-2  mb-0 blockquote-footer comment',
          )
          .css('max-width', '400px')
          .text(user.comment),
      );
    tRow.append(nameColumn);

    slots.forEach((slot) => {
      let participant = user.slots[slot.slot_id];
      let entry = $('<td>');
      if (participant) {
        entry.addClass('bg-success');
      } else {
        entry.addClass('bg-danger');
      }
      tRow.append(entry);
    });

    tbody.append(tRow);
  });
  return tbody;
}

// Erzeugt den Header und zeigt die Informationen des Appointments
function appointmentHeader(isExpired, isEventOver, appointment) {
  let cardText = $('<div>').addClass('card-text');
  let headerContent = [
    {
      class: 'fa-solid fa-calendar-days me-2',
      text: `${appointment.date}`,
    },
    {
      class: 'fa-solid fa-user-tag me-2',
      text: `${appointment.organizer_name} is the organizer`,
    },
    {
      class: 'fa-solid fa-location-dot me-2',
      text: `${appointment.location}`,
    },
  ];

  if (appointment.description) {
    headerContent.push({
      class: 'fa-solid fa-align-left me-2',
      text: appointment.description,
    });
  }
  if (isEventOver) {
    headerContent.push({
      class: 'fa-regular fa-calendar-xmark me-2 text-danger',
      text: 'Event beendet',
    });
  } else if (isExpired) {
    headerContent.push({
      class: 'fa-solid fa-circle-xmark me-2 text-danger',
      text: 'Voting ended',
    });
  } else {
    cardText.append(
      $('<p>')
        .append($('<i>').addClass('fa-solid fa-circle-check me-2 text-success'))
        .append(
          $('<span>').html(
            `Voting until <strong>${appointment.expiry_date}</strong>`,
          ),
        ),
    );
  }

  let title = $('<h4>')
    .addClass('card-title fw-normal')
    .text(appointment.title);
  cardText.append(title);
  headerContent.forEach((item) => {
    let element = $('<p>')
      .append($('<i>').addClass(item.class))
      .append($('<span>').text(item.text));

    cardText.append(element);
  });

  cardText.append(
    $('<p>')
      .append($('<i>').addClass('show-slot-info me-2 click'))
      .append($('<span>').text('Slots'))
      .attr('id', `toggleSlotInfo-${appointment.appointment_id}`)
      .addClass('toggle-slots-info'),
  );
  return cardText;
}

function new_user_button(appointment_id) {
  let button = $('<button>')
    .addClass('btn new-user-button')
    .attr('data-id', appointment_id)
    .append($('<i>').addClass('fa-solid fa-plus me-2'));
  return button;
}

function clear_page() {
  $('#appointments').empty();
}

// Erstellt einen Delete-Button für einen Appointment
function create_delete_button(appointment_id) {
  return $('<button>')
    .addClass('btn px-0 mx-0 mb-3 text-danger')
    .append($('<i>').addClass('fa-regular fa-calendar-minus pe-2'))
    .append($('<span>').text('Delete'))
    .on('click', async function () {
      await delete_appointment(appointment_id);
      clear_page();
      await load_appointments();
    });
}

// Zeigt alle Appointments auf der Seite an
function showAppointments(appointments) {
  appointments.forEach((app) => {
    if (app.slots[0].appointment_id) {
      let isEventOver = new Date(app.date).getDate() < new Date().getDate();
      let isExpired =
        new Date(app.expiry_date).getDate() < new Date().getDate();

      let card = $('<div>')
        .addClass('card ')
        .attr('data-id', app.appointment_id);

      let cardHeader = $('<div>').addClass(
        `card-header ${isEventOver ? 'event-over' : ''}`,
      );

      if (get_storage().find((el) => el === app.appointment_id)) {
        cardHeader.append(create_delete_button(app.appointment_id));
      }
      let cardBody = $('<div>').addClass('card-body ');
      let table = $('<table>').addClass('table ');
      let voteBody = $('<div>').addClass('card-body mt-0 ');

      if (!isExpired && !isEventOver)
        voteBody.append(new_user_button(app.appointment_id));

      table.append(appointmentSlots(isExpired, isEventOver, app.slots));
      if (app.slots.filter((el) => el.votes[0].user_id).length > 0)
        table.append(votes(app.slots));
      else {
        table.append('<tbody><tr><th>No votes</th></tr></tbody>');
      }
      cardHeader.append(appointmentHeader(isExpired, isEventOver, app));
      cardBody
        .append(table)
        .append(voteBody)
        .attr('id', `slotsInfo-${app.appointment_id}`)
        .hide();
      card.append(cardHeader, cardBody);
      $('#appointments').append(card.addClass('my-5'));
    }
  });
}

// Initialisiert die Votes mit den User und ob sie daran teilnehmen
function merge_votes_users(votes, users) {
  let all_participants = [];
  users.forEach((user) => {
    const participant = votes.find((vote_user) => {
      return user.user_id === vote_user.user_id;
    });
    user.participant = participant ? true : false;
    all_participants.push(user);
  });
  return all_participants;
}

// Holt die Votes und die User vom Server
async function get_votes(slot_id, appointment_id) {
  try {
    let votes = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: { method: 'queryVotesBySlotId', param: slot_id },
      dataType: 'json',
    });
    let users = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: { method: 'queryUserFromAppointment', param: appointment_id },
      dataType: 'json',
    });
    all_participants = merge_votes_users(votes, users);
    return all_participants;
  } catch (error) {}
}

// Für das Format einr Zeit: hh:mm
function get_time(time) {
  time = new Date(time);
  let hours = new Date(time).getHours();
  let minutes = new Date(time).getMinutes();
  hours = hours <= 9 ? '0' + hours : hours;
  minutes = minutes <= 9 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}

// Holt die Slots vom Server und passt sie für das Anzeigen an
async function get_slots(appointment_id) {
  const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  try {
    const slots = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: { method: 'querySlotsByAppointmentId', param: appointment_id },
      dataType: 'json',
    });
    for (const slot of slots) {
      slot.votes = await get_votes(slot.slot_id, appointment_id);
      const date = new Date(slot.date);
      slot.weekday = weekday[date.getDay()].slice(0, 3);
      slot.day = date.getDate();
      slot.month = month[date.getMonth()].slice(0, 3);
    }

    return slots;
  } catch (error) {
    return null;
  }
}

async function adjust_data(appointments) {
  for (const current of appointments) {
    current.slots = await get_slots(current.appointment_id);
  }
  return appointments;
}

// Lädt und zeigt die Appointments nach der Anpassung an
async function load_appointments() {
  try {
    const data = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: { method: 'queryAppointments' },
      dataType: 'json',
    });

    let appointments = await adjust_data(data);
    showAppointments(appointments);
  } catch (error) {}
}

// Löscht einen Termin
async function delete_appointment(appointment_id) {
  try {
    await $.ajax({
      type: 'POST',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: {
        method: 'deleteAppointment',
        param: appointment_id,
      },
      dataType: 'json',
    });
    let updatedStorage = get_storage().filter((el) => el != appointment_id);
    localStorage.setItem('appointments', JSON.stringify(updatedStorage));
  } catch (error) {
    error;
  }
}
