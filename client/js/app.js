let checkedSlots = [{ slots: null }];

$(document).ready(function () {
  $(document).on('click', '.new-user-button', function (e) {
    new_user(e);
  });
  $(document).on('click', '.slot', function (e) {
    check_slot(e.currentTarget.id);
    slots(e);
  });
  $(document).on('click', '.toggle-slots-info', function (e) {
    showSlots(e.currentTarget.id.split('-')[1]);
  });
  $(document).on('click', '.comment', function (e) {
    $(e.currentTarget).toggleClass('text-truncate');
  });
});

function check_disability(appointment_id) {
  let input = $(`input.new-user-input[data-id=${appointment_id}]`);
  let voteButton = $(`button.vote-button[data-id=${appointment_id}]`);
  let slotWithSameAppointment = checkedSlots.find(
    (el) => el.appointment_id === appointment_id,
  );
  if (input.length > 0 && voteButton.length > 0) {
    if (input.val().trim().length > 0 && slotWithSameAppointment) {
      if (slotWithSameAppointment.slots.length > 0)
        voteButton.prop('disabled', false);
    } else {
      voteButton.prop('disabled', true);
    }
  }
}

function new_user(e) {
  let appointment_id = $(e.currentTarget).data('id');

  let userField = $('<div>').addClass('row');
  let input = $('<input>')
    .attr({ type: 'text', placeholder: 'Your name', 'data-id': appointment_id })
    .addClass('form-control new-user-input px-2 col');
  let comment = $('<input>')
    .attr({ type: 'text', placeholder: 'Comment (optional)' })
    .addClass('form-control new-user-input px-2 col');
  let voteButton = $('<div>').append(
    $('<button>')
      .addClass('btn btn-secondary d-block w-50 mt-3 mx-auto vote-button')
      .text('Vote')
      .attr({ disabled: true, 'data-id': appointment_id }),
  );
  input.on('input', function () {
    check_disability(appointment_id);
  });
  voteButton.on('click', async function () {
    let slots = checkedSlots.filter(
      (app) => app.appointment_id === appointment_id,
    );
    await add_slots(appointment_id, slots, input.val(), comment.val());
    clear_user_inputs(input, comment, slots, appointment_id);
    clear_page();
    await load_appointments();
    showSlots(appointment_id);
  });
  userField.append(input, comment, voteButton);
  $(e.currentTarget).replaceWith(userField);
}

function clear_user_inputs(input, comment, slots, appointment_id) {
  input.val('');
  comment.val('');
  if (slots[0]) {
    slots[0].slots.forEach((slot) => {
      check_slot(`slot-${slot}`);
    });
  }

  checkedSlots = checkedSlots.filter(
    (slot) => slot.appointment_id != appointment_id,
  );
}

function check_slot(id) {
  let currentElement = $(`#${id}`);
  currentElement.toggleClass('bg-warning');
  let checkbox = currentElement.find('i.checkbox');
  checkbox.toggleClass('unchecked checked');
}

function showSlots(id) {
  $(`#toggleSlotInfo-${id}`)
    .find('i')
    .toggleClass('show-slot-info hide-slot-info');
  let info = $(`#slotsInfo-${id}`);
  if (!info.is(':visible')) {
    info.slideDown();
  } else {
    info.slideUp();
  }
}

function slots(e) {
  let slot_id = e.currentTarget.id.split('-')[1];
  var appointment_id = $(e.currentTarget).closest('[data-id]').data('id');
  let targetAppointment = checkedSlots.find(
    (el) => el.appointment_id == appointment_id,
  );
  if (targetAppointment) {
    let foundSlotIndex = targetAppointment.slots.indexOf(slot_id);
    if (foundSlotIndex !== -1) {
      targetAppointment.slots.splice(foundSlotIndex, 1);
    } else {
      targetAppointment.slots.push(slot_id);
    }
  } else {
    checkedSlots.push({ appointment_id: appointment_id, slots: [slot_id] });
  }
  check_disability(appointment_id);
}

async function add_slots(appointment_id, appointmentSlots, name, comment) {
  try {
    await $.ajax({
      type: 'GET',
      url: '../../server/serviceHandler.php',
      cache: false,
      data: {
        method: 'addSlotsByAppointmentId',
        body: {
          slots: appointmentSlots[0].slots,
          name: name,
          comment: comment,
        },
      },
      dataType: 'json',
    });
  } catch (error) {}
}
