let direction = "ltr";
isRtl && (direction = "rtl");

document.addEventListener("DOMContentLoaded", function () {
  function showToast(title, message, type = "info") {
    const toast = new bootstrap.Toast(document.getElementById("liveToast"));
    document.getElementById("toastTitle").textContent = title;
    document.getElementById("toastMessage").textContent = message;

    document
      .getElementById("liveToast")
      .classList.remove("bg-success", "bg-danger", "bg-warning", "bg-info");

    switch (type) {
      case "success":
        document
          .getElementById("liveToast")
          .classList.add("bg-success", "text-white");
        break;
      case "error":
        document
          .getElementById("liveToast")
          .classList.add("bg-danger", "text-white");
        break;
      case "warning":
        document.getElementById("liveToast").classList.add("bg-warning");
        break;
      default:
        document
          .getElementById("liveToast")
          .classList.add("bg-info", "text-white");
    }

    toast.show();
  }
  function showLoader() {
    document.getElementById("loading-overlay").style.display = "flex";
  }

  function hideLoader() {
    document.getElementById("loading-overlay").style.display = "none";
  }

  {
    let e = document.getElementById("calendar"),
      t = document.querySelector(".app-calendar-sidebar"),
      n = document.getElementById("addEventSidebar"),
      a = document.querySelector(".app-overlay"),
      l = {
        Pending: "primary",
        Approved: "success",
        Denied: "danger",
      },
      r = document.querySelector(".offcanvas-title"),
      i = document.querySelector(".btn-toggle-sidebar"),
      d = document.querySelector("#addEventBtn"),
      o = document.querySelector("#delete-btn"),
      s = document.querySelector(".btn-cancel"),
      c = document.querySelector("#event_name"),
      u = document.querySelector("#event_date"),
      v = document.querySelector("#event_end_time"),
      m = document.querySelector("#eventURL"),
      p = $("#eventLabel"),
      g = document.querySelector("#location_id"),
      h = document.querySelector("#room_id"),
      b = document.querySelector("#event_start_time"),
      y = document.querySelector(".select-all"),
      S = [].slice.call(document.querySelectorAll(".input-filter")),
      L = document.querySelector(".inline-calendar"),
      E,
      k = window.fetchEvents,
      w = !1,
      x,
      q = new bootstrap.Offcanvas(n);
    function P(e) {
      return e.id
        ? "<span class='badge badge-dot bg-" +
            $(e.element).data("label") +
            " me-2'> </span>" +
            e.text
        : e.text;
    }
    function M(e) {
      return e.id
        ? "<div class='d-flex flex-wrap align-items-center'><div class='avatar avatar-xs me-2'><img src='" +
            assetsPath +
            "img/avatars/" +
            $(e.element).data("avatar") +
            "' alt='avatar' class='rounded-circle' /></div>" +
            e.text +
            "</div>"
        : e.text;
    }
    var T, A;
    function F() {
      var e = document.querySelector(".fc-sidebarToggle-button");
      for (
        e.classList.remove("fc-button-primary"),
          e.classList.add("d-lg-none", "d-inline-block", "ps-0");
        e.firstChild;

      )
        e.firstChild.remove();
      e.setAttribute("data-bs-toggle", "sidebar"),
        e.setAttribute("data-overlay", ""),
        e.setAttribute("data-target", "#app-calendar-sidebar"),
        e.insertAdjacentHTML(
          "beforeend",
          '<i class="bx bx-menu bx-lg text-heading"></i>'
        );
    }
    p.length &&
      p.wrap('<div class="position-relative"></div>').select2({
        placeholder: "Select value",
        dropdownParent: p.parent(),
        templateResult: P,
        templateSelection: P,
        minimumResultsForSearch: -1,
        escapeMarkup: function (e) {
          return e;
        },
      }),
      u &&
        (T = u.flatpickr({
          enableTime: false,
          dateFormat: "Y-m-d",
          onReady: function (e, t, n) {
            n.isMobile && n.mobileInput.setAttribute("step", null);
          },
        })),
      v &&
        (A = v.flatpickr({
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          time_24hr: true,
          minuteIncrement: 1,
          onReady: function (e, t, n) {
            n.isMobile && n.mobileInput.setAttribute("step", "60");
          },
        })),
      b &&
        (A = b.flatpickr({
          enableTime: true,
          noCalendar: true,
          dateFormat: "H:i",
          time_24hr: true,
          minuteIncrement: 1,
          onReady: function (e, t, n) {
            n.isMobile && n.mobileInput.setAttribute("step", "60");
          },
        })),
      L && (x = L.flatpickr({ monthSelectorType: "static", inline: !0 }));

    let D = new Calendar(e, {
      initialView: "dayGridMonth",

      events: function (info, successCallback, failureCallback) {
        showLoader();
        fetch("display_event.php")
          .then((response) => response.json())
          .then((data) => {
            const selectedFilters = Array.from(
              document.querySelectorAll(".input-filter:checked")
            ).map((checkbox) =>
              checkbox.getAttribute("data-value").toLowerCase()
            );

            const anyFilterChecked =
              selectedFilters.length > 0 ||
              document.querySelector(".select-all").checked;

            if (!anyFilterChecked) {
              successCallback([]);
              return;
            }

            const events = data
              .filter(
                (event) =>
                  selectedFilters.length === 0 ||
                  selectedFilters.includes(event.event_status.toLowerCase())
              )
              .map((event) => ({
                id: event.event_id,
                title: event.event_name,
                start: `${event.event_date}T${event.event_start_time}`,
                end: `${event.event_date}T${event.event_end_time}`,

                extendedProps: {
                  calendar: event.event_status,
                  location_id: event.location_id,
                  room_id: event.room_id,
                },
              }));
            successCallback(events);
            hideLoader();
          })
          .catch((error) => {
            console.error("Error fetching events:", error);
            failureCallback(error);
            hideLoader();
          });
      },

      plugins: [dayGridPlugin, interactionPlugin, listPlugin, timegridPlugin],
      editable: !0,
      dragScroll: !0,
      dayMaxEvents: 2,
      eventResizableFromStart: !0,
      customButtons: { sidebarToggle: { text: "Sidebar" } },
      headerToolbar: {
        start: "sidebarToggle, prev,next, title",
        end: "dayGridMonth,timeGridWeek,timeGridDay,listMonth",
      },
      direction: direction,
      initialDate: new Date(),
      navLinks: !0,

      eventClassNames: function ({ event: e }) {
        return ["fc-event-" + l[e._def.extendedProps.calendar]];
      },
      dateClick: function (e) {
        e = moment(e.date).format("YYYY-MM-DD");
        C(),
          q.show(),
          r && (r.innerHTML = "Add Event"),
          (d.innerHTML = "Add"),
          d.classList.remove("btn-update-event"),
          d.classList.add("btn-add-event"),
          o.classList.add("d-none"),
          (u.value = e),
          (v.value = e);
      },
      eventClick: function (info) {
        const event = info.event;
        console.log("Event clicked:", event);

        const form = document.getElementById("eventForm");
        form.dataset.editing = "true";
        form.dataset.eventId = event.id;

        // Populate form fields
        document.getElementById("event_id").value = event.id;
        document.getElementById("event_name").value = event.title;
        document.getElementById("event_date").value = event.start
          .toISOString()
          .split("T")[0];
        document.getElementById("event_start_time").value = event.start
          .toTimeString()
          .slice(0, 5);
        document.getElementById("event_end_time").value = event.end
          .toTimeString()
          .slice(0, 5);
        document.getElementById("event_status").value =
          event.extendedProps.calendar;

        // Handle button state based on event status
        const updateBtn = document.getElementById("addEventBtn");
        const deleteBtn = document.getElementById("delete-btn");

        const eventStatus = event.extendedProps.calendar.toLowerCase();
        const isApprovedOrDenied =
          eventStatus === "approved" || eventStatus === "denied";

        updateBtn.disabled = isApprovedOrDenied;
        deleteBtn.disabled = isApprovedOrDenied;

        updateBtn.textContent = "Update Event";
        deleteBtn.classList.remove("d-none");

        const locationSelect = document.getElementById("location_id");
        locationSelect.value = event.extendedProps.location_id || "";

        // Fetch rooms for the selected location
        if (locationSelect.value) {
          fetch(`get_rooms.php?location_id=${locationSelect.value}`)
            .then((response) => response.json())
            .then((data) => {
              const roomSelect = document.getElementById("room_id");
              roomSelect.innerHTML = '<option value="">Select Room</option>';
              for (const [id, name] of Object.entries(data)) {
                const option = new Option(name, id);
                if (id == event.extendedProps.room_id) {
                  option.selected = true;
                }
                roomSelect.add(option);
              }
              roomSelect.disabled = false;
            })
            .catch((error) => console.error("Error:", error));
        }

        // Calculate and set duration
        const durationMinutes = (event.end - event.start) / (1000 * 60);
        document.getElementById("event_duration").value = durationMinutes;

        // Show the event sidebar
        bootstrap.Offcanvas.getInstance(
          document.getElementById("addEventSidebar")
        ).show();
      },
      datesSet: function () {
        F();
      },
      viewDidMount: function () {
        F();
      },
    });
    D.render(), F();
    var Y = document.getElementById("eventForm");
    function C() {
      const form = document.getElementById("eventForm");
      form.reset();
      form.dataset.editing = "false";
      form.dataset.eventId = "";

      const updateBtn = document.getElementById("addEventBtn");
      const deleteBtn = document.getElementById("delete-btn");

      updateBtn.textContent = "Add Event";
      updateBtn.style.display = "inline-block";

      deleteBtn.classList.add("d-none");
      deleteBtn.style.display = "none";

      document.getElementById("event_id").value = "";

      if ($.fn.select2) {
        $("#eventLabel").val("").trigger("change");
        $("#eventGuests").val("").trigger("change");
      }
    }

    FormValidation.formValidation(Y, {
      fields: {
        event_name: {
          validators: { notEmpty: { message: "Please enter event title " } },
        },

        event_date: {
          validators: { notEmpty: { message: "Please enter event date" } },
        },
        event_start_time: {
          validators: { notEmpty: { message: "Please enter start time" } },
        },
        event_duration: {
          validators: { notEmpty: { message: "Please select duration" } },
        },
        event_end_time: {
          validators: { notEmpty: { message: "Please enter end time" } },
        },
        location_id: {
          validators: { notEmpty: { message: "Please select a location" } },
        },
        room_id: {
          validators: { notEmpty: { message: "Please select a room" } },
        },
      },
      plugins: {
        trigger: new FormValidation.plugins.Trigger(),
        bootstrap5: new FormValidation.plugins.Bootstrap5({
          eleValidClass: "",
          rowSelector: function (e, t) {
            return ".mb-6";
          },
        }),
        submitButton: new FormValidation.plugins.SubmitButton(),
        autoFocus: new FormValidation.plugins.AutoFocus(),
      },
    })
      .on("core.form.valid", function () {
        w = !0;
      })
      .on("core.form.invalid", function () {
        w = !1;
      }),
      i &&
        i.addEventListener("click", (e) => {
          s.classList.remove("d-none");
        }),
      d.addEventListener("click", (e) => {
        e.preventDefault();

        if (w) {
          showLoader();
          const form = document.getElementById("eventForm");
          const formData = new FormData(form);
          const isEditing = form.dataset.editing === "true";
          const eventId = form.dataset.eventId;

          console.log("Form data:", Object.fromEntries(formData));
          console.log("Is editing:", isEditing, "Event ID:", eventId);

          const url = isEditing
            ? `update_event.php?id=${eventId}`
            : "save_event.php";
          console.log(url);

          fetch(url, {
            method: "POST",
            body: formData,
          })
            .then((response) => {
              console.log("Raw response:", response);
              return response.text().then((text) => {
                console.log("Response text:", text);
                try {
                  return JSON.parse(text);
                } catch (error) {
                  console.error("Error parsing JSON:", error);
                  throw new Error("Received non-JSON response: " + text);
                }
              });
            })
            .then((data) => {
              console.log("Parsed data:", data);
              if (data.status) {
                D.refetchEvents();
                q.hide();
                showToast(
                  "Success",
                  isEditing
                    ? "Event updated successfully"
                    : "Event added successfully",
                  "success"
                );

                form.dataset.editing = "false";
                form.dataset.eventId = "";
                document.querySelector(".btn-add-event").textContent =
                  "Add Event";
                document
                  .querySelector(".btn-delete-event")
                  .classList.add("d-none");
              } else {
                showToast(
                  "Error",
                  data.msg || "Unknown error occurred",
                  "error"
                );
              }
              hideLoader();
            })
            .catch((error) => {
              console.error("Error:", error);
              showToast(
                "Error",
                "An error occurred while saving the event",
                "error"
              );
              hideLoader();
            });
        } else {
          showToast("Error", "Please fill in all required fields", "error");
        }
      }),
      o.addEventListener("click", (e) => {
        showLoader();
        const form = document.getElementById("eventForm");
        const formData = new FormData(form);
        const isEditing = form.dataset.editing === "true";
        const eventId = form.dataset.eventId;

        console.log("Form data:", Object.fromEntries(formData));
        fetch("delete_event.php", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            console.log("Raw response:", response);
            return response.text().then((text) => {
              console.log("Response text:", text);
              try {
                return JSON.parse(text);
              } catch (error) {
                console.error("Error parsing JSON:", error);
                throw new Error("Received non-JSON response: " + text);
              }
            });
          })
          .then((data) => {
            console.log("Parsed data:", data);
            if (data.status) {
              D.refetchEvents();
              q.hide();
              showToast("Success", "Event deleted successfully", "success");
            } else {
              showToast("Error", data.msg || "Unknown error occurred", "error");
            }
            hideLoader();
          })
          .catch((error) => {
            console.error("Error:", error);
            showToast(
              "Error",
              "An error occurred while deleting the event",
              "error"
            );
            hideLoader();
          });
      }),
      n.addEventListener("hidden.bs.offcanvas", function () {
        C();
      }),
      i.addEventListener("click", (e) => {
        r && (r.innerHTML = "Add Event"),
          (d.innerHTML = "Add"),
          d.classList.remove("btn-update-event"),
          d.classList.add("btn-add-event"),
          o.classList.add("d-none"),
          t.classList.remove("show"),
          a.classList.remove("show");
      }),
      y &&
        y.addEventListener("click", (e) => {
          showLoader();
          const isChecked = e.currentTarget.checked;
          document
            .querySelectorAll(".input-filter")
            .forEach((e) => (e.checked = isChecked));
          D.refetchEvents();
        }),
      S &&
        S.forEach((e) => {
          e.addEventListener("click", () => {
            const allChecked =
              document.querySelectorAll(".input-filter:checked").length ===
              S.length;
            y.checked = allChecked;
            D.refetchEvents();
          });
        }),
      y.addEventListener("change", function () {
        S.forEach((checkbox) => {
          checkbox.checked = this.checked;
        });
        const anyChecked = y.checked || Array.from(S).some((c) => c.checked);
        if (anyChecked) {
          D.refetchEvents();
        } else {
          D.removeAllEvents();
        }
        hideLoader();
      });

    S.forEach((checkbox) => {
      checkbox.addEventListener("change", function () {
        showLoader();
        y.checked = Array.from(S).every((c) => c.checked);
        const anyChecked = y.checked || Array.from(S).some((c) => c.checked);
        if (anyChecked) {
          D.refetchEvents();
        } else {
          D.removeAllEvents();
          hideLoader();
        }
      });
    });

    x.config.onChange.push(function (e) {
      D.changeView(D.view.type, moment(e[0]).format("YYYY-MM-DD")),
        F(),
        t.classList.remove("show"),
        a.classList.remove("show");
    });
  }
});
