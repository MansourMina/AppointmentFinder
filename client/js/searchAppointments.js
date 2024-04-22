$(document).ready(function () {
  $('#searchField').on('change', function () {
    search_appointment($(this).val());
  });
});

function search_appointment(search) {
  var searchTerm = search.toLowerCase();
  // Durchläuft alle Elemente mit der Klasse .card
  $('#appointments');
  $('#appointments')
    .find('.card')
    .each(function () {
      var titleText = $(this).find('.card-header').text().toLowerCase();
      if (titleText.indexOf(searchTerm) !== -1) {
        $(this).fadeIn();
      } else {
        $(this).fadeOut();
      }
    });
}
