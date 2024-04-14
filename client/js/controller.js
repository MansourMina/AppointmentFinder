//Starting point for JQuery init
$(document).ready(function () {
  // $("#searchResult").hide();
  // $("#btn_Search").click(function (e) {
  //    loaddata($("#seachfield").val());
  // });
  loaddata();
});

function createSlot(data) {
  tableHeadRow.append(
    '<th scope="col" class="text-center"><p>APR</p><p>13</p><p>SAT</p><p>09:00 AM</p><p>- 10:00 AM</p><p>1h</p><p>2</p></th>',
  );
}

function test(data) {
  var cardDiv = $('<div>').addClass('card');
  var cardHeader = $('<div>').addClass('card-header');
  var cardTitle = $('<h5>').addClass('card-title').text(data.title);
  var cardText = $('<p>').addClass('card-text').text('Vote');
  var table = $('<table>').addClass('table');
  var thead = $('<thead>');
  var theadRow = $('<tr>');
  // let emptySlot = $('<th>').addClass('col');
  // theadRow.append('<th>');
  let slot = createSlot(app);
  theadRow.append(slot);

  tableHeadRow.append(
    '<th scope="col" class="text-center"><i class="fa fa-star"></i><p>APR</p><p>13</p><p>SAT</p><p>09:00 AM</p><p>- 10:00 AM</p><p>1h</p><p>2</p></th>',
  );
  tableHeadRow.append(
    '<th scope="col" class="text-center"><p>APR</p><p>13</p><p>SAT</p><p>09:00 AM</p><p>- 10:00 AM</p><p>1h</p><p>2</p></th>',
  );
  thead.append(tableHeadRow);

  tbody.append(
    '<tr><th>Bertan</th><td class="bg-success" onclick="test()"></td><td class="bg-danger"></td><td class="bg-danger"></td></tr>',
  );
  tbody.append(
    '<tr><th>Mina</th><td class="bg-success"></td><td class="bg-danger"></td><td class="bg-success"></td></tr>',
  );
  tbody.append(
    '<tr><th>Mina</th><td class="bg-success"></td><td class="bg-success"></td><td class="bg-success"></td></tr>',
  );

  var tbody = $('<tbody>');
  table.append(thead);
  table.append(tbody);

  cardHeader.append(cardTitle);
  cardHeader.append(cardText);
  cardHeader.append(table);

  var cardBody = $('<div class="card-body" style="text-align: right"></div>');
  var voteLink = $('<a href="#" class="btn card-link">Vote</a>');
  cardBody.append(voteLink);

  cardDiv.append(cardHeader);
  cardDiv.append(cardBody);
  $('.appointments').append(cardDiv);
}

function showAppointments(data) {
  data.forEach((app) => {
    // let appointment = $('#appointments').append(appointment);
  });
}

function loaddata() {
  $.ajax({
    type: 'GET',
    url: '../../server/serviceHandler.php',
    cache: false,
    data: { method: 'queryAppointments' },
    dataType: 'json',
    success: function (response) {
      showAppointments(response);
    },
  });
}
