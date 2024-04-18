$(document).ready(function () {
  load_appointments();
});

function appointmentSlots(slots) {
  let tRow = $('<tr>').addClass('text-center');
  let emptySlot = $('<th>').attr('scope', 'col');
  let thead = $('<thead>');
  tRow.append(emptySlot);
  if (slots && slots.length > 0) {
    slots.forEach((slot) => {
      let column = $('<th>')
        .attr({ scope: 'col', id: 'slot-' + slot.slot_id })
        .addClass('slot');
      let headerContent = [
        { class: '', text: slot.weekday.toUpperCase() },
        { class: 'slot-date', text: slot.day },
        { class: '', text: slot.month.toUpperCase() },
        { class: '', text: `${get_time(slot.start)} - ${get_time(slot.end)}` },
        {
          class: '',
          text:
            Number(new Date(slot.end) - new Date(slot.start)) /
              (1000 * 60 * 60) +
            'h',
        },
        {
          class: 'fa-solid fa-people-group me-2',
          text: slot.votes.filter((p) => p.participant == true).length,
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
      let voteButton = $('<i>').addClass('unchecked checkbox');

      column.append(voteButton);
      tRow.append(column);
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

function votes(slots) {
  let tbody = $('<tbody>');

  if (!slots || slots.length === 0) {
    return tbody.append(
      '<tr><th>No votes</th><td class="bg-danger"></td></tr>',
    );
  }

  // alle users holen mit allen slots holen
  let users = [];
  slots.forEach((slot) => {
    slot.votes.forEach((vote) => {
      if (!users[vote.user_id]) {
        users[vote.user_id] = {
          name: vote.firstname + ' ' + vote.lastname,
          slots: [],
        };
      }
      users[vote.user_id].slots[slot.slot_id] = vote.participant;
    });
  });

  users.forEach((user) => {
    let tRow = $('<tr>');
    let nameColumn = $('<th>')
      .append($('<i>').addClass('fa-regular fa-user me-2'))
      .append(user.name);
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

function appointmentHeader(appointment) {
  let cardText = $('<div>').addClass('card-text');

  let headerContent = [
    {
      class: 'fa-solid fa-user-tag me-2',
      text: `${appointment.organizer_firstname} is the organizer`,
    },
    // { class: 'fa-solid fa-clock me-2', text: `${appointments.duration} hour` },
    {
      class: 'fa-solid fa-location-dot me-2',
      text: `${appointment.location}`,
    },
  ];

  let title = $('<h2>').addClass('card-title').text(appointment.title);
  cardText.append(title);
  headerContent.forEach((item) => {
    let element = $('<p>')
      .append($('<i>').addClass(item.class))
      .append($('<span>').text(item.text));

    cardText.append(element);
  });
  if (appointment.description) {
    cardText.append(
      $('<p>')
        .append($('<i>').addClass('fa-solid fa-align-left me-2'))
        .append($('<span>').text(appointment.description)),
    );
  }
  return cardText;
}

function new_user_button(appointment_id) {
  let button = $('<button>')
    .addClass('btn new-user-button')
    .append($('<i>').addClass('fa-solid fa-plus me-2'))
    .attr('id', appointment_id);
  return button;
}

function showAppointments(appointments) {
  appointments.forEach((app) => {
    let card = $('<div>').addClass('card');
    let cardHeader = $('<div>').addClass('card-header');
    let cardBody = $('<div>').addClass('card-body');
    let table = $('<table>').addClass('table');
    let voteBody = $('<div>').addClass('card-body mt-0');
    voteBody.append(new_user_button(app.appointment_id));
    table.append(appointmentSlots(app.slots), votes(app.slots));
    cardHeader.append(appointmentHeader(app));
    cardBody.append(table);
    card.append(cardHeader, cardBody, voteBody);
    $('#appointments').append(card.addClass('my-5'));
  });
}

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
  } catch (error) {
    let users = await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: { method: 'queryUserFromAppointment', param: appointment_id },
      dataType: 'json',
    });
    return [...users].map((user) => ({ ...user, participant: false }));
  }
}

function get_time(time) {
  time = new Date(time);
  let hours = new Date(time).getHours();
  let minutes = new Date(time).getMinutes();
  hours = hours <= 9 ? '0' + hours : hours;
  minutes = minutes <= 9 ? '0' + minutes : minutes;
  return `${hours}:${minutes}`;
}

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
    console.log(appointments);
    showAppointments(appointments);
  } catch (error) {}
}
