let checkedSlots = [{ slots: null }];

$(document).ready(function () {
  $(document).on('click', '.new-user-button', function (e) {
    new_user(e); // Bei Klick, neuer Nutzer Formular anzeigen
  });
  $(document).on('click', '.slot', function (e) {
    check_slot(e.currentTarget.id); // Toggled Checked und Uncheck vom Slot
    slots(e); // Aktualisiert die Slots-Auswahl im globalen Array.
  });
  $(document).on('click', '.toggle-slots-info', function (e) {
    showSlots(e.currentTarget.id.split('-')[1]); // Blendet Slot-Informationen ein/aus.
  });
  $(document).on('click', '.comment', function (e) {
    // Erweitert oder kürzt Kommentar-Anzeige.
    $(e.currentTarget).toggleClass('text-truncate');
  });
});

// Überprüft, ob Eingabefelder ausgefüllt sind und setzt entsprechend den Zustand des Vote-Buttons.
function check_disability(appointment_id) {
  // Wählt Input-Elemente und Vote-Button für eine spezifische Appointment-ID.
  let input = $(`input.new-user-input[data-id=${appointment_id}]`);
  let voteButton = $(`button.vote-button[data-id=${appointment_id}]`);
  let slotWithSameAppointment = checkedSlots.find(
    (el) => el.appointment_id === appointment_id,
  );
  // Disabled oder Enabled den Vote-Button basierend auf dem Input-Wert und verfügbaren Slots.
  if (input.length > 0 && voteButton.length > 0) {
    if (input.val().trim().length > 0 && slotWithSameAppointment) {
      if (slotWithSameAppointment.slots.length > 0)
        voteButton.prop('disabled', false);
    } else {
      voteButton.prop('disabled', true);
    }
  }
}

// Ersetzt den "Neuer Nutzer"-Button durch ein Formular
function new_user(e) {
  let appointment_id = $(e.currentTarget).data('id');
  // Formular-Elemente erstellen.
  let userField = $('<div>').addClass('row');
  let input = $('<input>')
    .attr({ type: 'text', placeholder: 'Your name', 'data-id': appointment_id })
    .addClass('form-control new-user-input px-2 col-4');
  let comment = $('<input>')
    .attr({ type: 'text', placeholder: 'Comment (optional)' })
    .addClass('form-control new-user-input px-2 col-4 mt-2');
  let form = $('<form>').attr('id', 'voteForm');
  let voteButton = $('<button>')
    .addClass('btn btn-secondary d-block w-50 mt-3 mx-auto vote-button')
    .text('Vote')
    .attr({
      disabled: true,
      'data-id': appointment_id,
      form: 'voteForm',
      type: 'submit',
    });
  form.append(voteButton);
  input.on('input', function () {
    // Überprüft nach jeder Eingabe, ob der Vote-Button enabled werden kann
    check_disability(appointment_id);
  });
  form.on('submit', async function (event) {
    event.preventDefault(); // Um die Seite nach einem Submit nicht neuzuladen.
    // Speichert die Daten und lädt die Ansicht neu.
    let slots = checkedSlots.filter(
      (app) => app.appointment_id === appointment_id,
    );
    await add_slots(slots, input.val(), comment.val());
    clear_user_inputs(input, comment, slots, appointment_id); // Leert die Eingabefelder und die Seite.
    // Lädt Termine neu;
    clear_page();
    await load_appointments();
    showSlots(appointment_id); // Zeigt aktualisierte Slots;
  });
  userField.append(input, comment, form);
  $(e.currentTarget).replaceWith(userField);
}

// Leert die Benutzereingaben und entfernt das Appointments sowie die Slots
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

// Toggelt die Klasse eines Slot-Elements und aktualisiert das Icon.
function check_slot(id) {
  let currentElement = $(`#${id}`);
  currentElement.toggleClass('bg-warning');
  let checkbox = currentElement.find('i.checkbox');
  checkbox.toggleClass('unchecked checked');
}

// Toggelt die Slot-Informationen.
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

// Aktualisiert die Auswahl der Slots.
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


// Sendet eine Anfrage an den Server, um Slots für einen Termin hinzuzufügen.
async function add_slots(appointmentSlots, name, comment) {
  try {
    await $.ajax({
      type: 'POST',
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
