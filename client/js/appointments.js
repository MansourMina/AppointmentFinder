$(document).ready(function () {
  // $("#searchResult").hide();
  // $("#btn_Search").click(function (e) {
  //    loaddata($("#seachfield").val());
  // });
  loaddata();
});

function appointmentSlots(appointments) {
  var tRow = $('<tr>').addClass('text-center');
  let emptySlot = $('<th>').attr('scope', 'col');
  var slot = $('<th>').attr('scope', 'col');
  var thead = $('<thead>');
  var headerContent = [
    { class: '', text: 'SAT' },
    { class: 'slot-date', text: '13' },
    { class: '', text: 'April' },
    { class: '', text: '09:00 AM - 10:00 AM' },
    { class: '', text: '1h' },
    {
      class: 'fa-solid fa-people-group me-2',
      text: appointments.votes.length,
      icon: true,
    },
  ];
  headerContent.forEach((item) => {
    var element = $('<p>');
    if (item.icon) element.append($('<i>').addClass(item.class));
    else if (item.class.length > 0) element.addClass(item.class);
    element.append($('<span>').text(item.text));
    slot.append(element);
  });
  var voteButton = $('<i>').addClass('unchecked');
  slot.append(voteButton);
  tRow.append(emptySlot, slot);
  thead.append(tRow);
  return thead;
}

function votes(appointments) {
  var tbody = $('<tbody>');
  appointments.votes.forEach((vote) => {
    var tRow = $('<tr>');
    var vote = $('<th>')
      .append($('<i>').addClass('fa-regular fa-user me-2'))
      .append($('<span>').text(vote.name));
    var entry = $('<td>').addClass('bg-success');
    tRow.append(vote, entry);
    tbody.append(tRow);
  });
  return tbody;
}

function appointmentHeader(appointments) {
  var cardText = $('<div>').addClass('card-text');

  var headerContent = [
    {
      class: 'fa-solid fa-user-tag me-2',
      text: `${appointments.organizer} is the organizer`,
    },
    { class: 'fa-solid fa-clock me-2', text: `${appointments.duration} hour` },
    {
      class: 'fa-solid fa-location-dot me-2',
      text: `${appointments.location}`,
    },
    {
      class: 'fa-solid fa-align-left me-2',
      text: `${appointments.description}`,
    },
  ];

  var title = $('<h2>').addClass('card-title').text('Fussball');
  cardText.append(title);
  headerContent.forEach((item) => {
    var element = $('<p>')
      .append($('<i>').addClass(item.class))
      .append($('<span>').text(item.text));
    cardText.append(element);
  });
  return cardText;
}

function showAppointments(appointments) {
  appointments.forEach((app) => {
    app = app[0];
    var card = $('<div>').addClass('card');
    var cardHeader = $('<div>').addClass('card-header');
    var cardBody = $('<div>').addClass('card-body');
    var table = $('<table>').addClass('table');
    var voteBody = $('<div>').addClass('card-body mt-0');
    voteBody.append($('<button>').addClass('btn').text('Vote'));

    table.append(appointmentSlots(app), votes(app));

    cardHeader.append(appointmentHeader(app));
    cardBody.append(table);
    card.append(cardHeader, cardBody, voteBody);
    $('#appointments').append(card.addClass('my-5'));
  });
}

function appointments(data) {
  showAppointments(data);
}

function loaddata() {
  $.ajax({
    type: 'GET',
    url: '../../server/serviceHandler.php',
    cache: false,
    data: { method: 'queryAppointments' },
    dataType: 'json',
    success: function (response) {
      appointments(response);
    },
  });
}
