$(document).ready(function () {
  $(document).on('click', '.new-user-button', function (e) {
    new_user(e);
  });
  $(document).on('click', '.slot', function (e) {
    check_slot(e);
  });
});

function new_user(e) {
  let userField = $('<div>');
  let input = $('<input>')
    .attr({ type: 'text', placeholder: 'Your name' })
    .addClass('form-control new-user-input');
  let comment = $('<input>')
    .attr({ type: 'text', placeholder: 'Comment (optional)' })
    .addClass('form-control new-user-input my-2');
  let voteButton = $('<button>')
    .addClass('btn')
    .text('Vote')
    .attr('disabled', true);
  userField.append(input, comment, voteButton);
  $(e.currentTarget).replaceWith(userField);
}

function check_slot(e) {
  let currentElement = $(e.currentTarget);
  currentElement.toggleClass('bg-warning');
  let checkbox = currentElement.find('i.checkbox');
  checkbox.toggleClass('unchecked checked');
}
