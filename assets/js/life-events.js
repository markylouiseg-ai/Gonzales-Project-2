(function () {
  "use strict";

  const events = [
    {
      id: "hiraya-dspc-2026",
      title: "HIRAYA: KCCians Rise, Shine, and Conquer DSPC 2026!",
      date: "2026-10-31",
      dateLabel: "October 31, 2026",
      category: "Student activities",
      description: "The KCC Herald celebrated its campus journalists following their participation in the Division Schools Press Conference 2026.",
      cover: "assets/img/event/KCCHERALD.jpg",
      photos: [
        {
          src: "assets/img/event/KCCHERALD.jpg",
          alt: "KCC Herald student journalism feature"
        }
      ]
    },
    {
      id: "pcg-icare",
      title: "PCG i-CARE Program",
      date: "2026-10-26",
      dateLabel: "October 26, 2026",
      category: "Academic & formation",
      description: "A learning session introduced students to maritime awareness, environmental protection, career opportunities, and water safety.",
      cover: "assets/img/event/Criminology.jpg",
      photos: [
        {
          src: "assets/img/event/Criminology.jpg",
          alt: "KCC College of Criminology event artwork"
        }
      ]
    },
    {
      id: "campus-peace-symposium",
      title: "Campus Peace Symposium",
      date: "2026-09-21",
      dateLabel: "September 21–22, 2026",
      category: "Academic & formation",
      description: "Held at the KCC Gymnasium, the symposium featured sessions on peace-building, conflict resolution, youth leadership, and responsible decision-making.",
      cover: "assets/img/event/PeaceSymposium.jpg",
      photos: [
        {
          src: "assets/img/event/PeaceSymposium.jpg",
          alt: "KCC Campus Peace Symposium artwork"
        }
      ]
    },
    {
      id: "hinugyaw-festival",
      title: "Hinugyaw Festival",
      date: "2015",
      dateLabel: "2015",
      category: "School celebrations",
      description: "A celebration of student performance and community spirit at Hinugyaw Festival.",
      cover: "assets/img/event/Hinugyaw.jpg",
      photos: [
        {
          src: "assets/img/event/Hinugyaw.jpg",
          alt: "KCC students performing at Hinugyaw Festival 2015"
        }
      ]
    }
  ];

  const eventsGrid = document.getElementById("events-grid");
  const filters = document.getElementById("event-filters");
  const emptyState = document.getElementById("events-empty");
  const eventDialog = document.getElementById("event-dialog");
  const detailContent = document.getElementById("event-dialog-content");
  const photoDialog = document.getElementById("photo-dialog");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const previousPhotoButton = document.querySelector("[data-photo-prev]");
  const nextPhotoButton = document.querySelector("[data-photo-next]");
  let activeFilter = "all";
  let activeEvent = null;
  let activePhotoIndex = 0;

  if (!eventsGrid || !filters || !eventDialog || !detailContent || !photoDialog) {
    return;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#39;"
      }[character];
    });
  }

  function getCategories() {
    return Array.from(new Set(events.map(function (event) {
      return event.category;
    })));
  }

  function renderFilters() {
    getCategories().forEach(function (category) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "life-event-filter";
      button.dataset.eventFilter = category;
      button.textContent = category;
      button.setAttribute("aria-pressed", "false");
      filters.appendChild(button);
    });
  }

  function renderEvents() {
    const visibleEvents = events.filter(function (event) {
      return activeFilter === "all" || event.category === activeFilter;
    });

    eventsGrid.innerHTML = visibleEvents.map(function (event, index) {
      const dateTime = /^\d{4}-\d{2}-\d{2}$/.test(event.date)
        ? " datetime=\"" + escapeHtml(event.date) + "\""
        : "";

      return [
        "<article class=\"life-event-card\">",
        "<div class=\"life-event-cover\">",
        "<img src=\"", escapeHtml(event.cover), "\" alt=\"", escapeHtml(event.photos[0].alt), "\" loading=\"lazy\">",
        "<span class=\"life-event-category\">", escapeHtml(event.category), "</span>",
        "</div>",
        "<div class=\"life-event-content\">",
        "<div class=\"life-event-date\"><i class=\"bi bi-calendar3\" aria-hidden=\"true\"></i><time", dateTime, ">", escapeHtml(event.dateLabel), "</time></div>",
        "<h3>", escapeHtml(event.title), "</h3>",
        "<p>", escapeHtml(event.description), "</p>",
        "<button type=\"button\" class=\"life-event-open\" data-event-id=\"", escapeHtml(event.id), "\">Explore this story <i class=\"bi bi-arrow-right\" aria-hidden=\"true\"></i></button>",
        "</div>",
        "</article>"
      ].join("");
    }).join("");

    if (emptyState) {
      emptyState.hidden = visibleEvents.length > 0;
    }
  }

  function renderDetails(event) {
    const dateTime = /^\d{4}-\d{2}-\d{2}$/.test(event.date)
      ? " datetime=\"" + escapeHtml(event.date) + "\""
      : "";

    detailContent.innerHTML = [
      "<div class=\"life-event-detail-header\">",
      "<span class=\"section-kicker\">", escapeHtml(event.category), "</span>",
      "<h2 id=\"event-dialog-title\">", escapeHtml(event.title), "</h2>",
      "<time", dateTime, ">", escapeHtml(event.dateLabel), "</time>",
      "</div>",
      "<p class=\"life-event-detail-description\">", escapeHtml(event.description), "</p>",
      "<div class=\"life-event-photo-grid\" aria-label=\"Event gallery\">",
      event.photos.map(function (photo, index) {
        return "<button type=\"button\" class=\"life-event-photo\" data-photo-index=\"" + index + "\" aria-label=\"Enlarge photograph " + (index + 1) + "\"><img src=\"" + escapeHtml(photo.src) + "\" alt=\"" + escapeHtml(photo.alt) + "\" loading=\"lazy\"></button>";
      }).join(""),
      "</div>"
    ].join("");

    eventDialog.showModal();
  }

  function showPhoto(index) {
    if (!activeEvent || activeEvent.photos.length === 0) {
      return;
    }

    activePhotoIndex = (index + activeEvent.photos.length) % activeEvent.photos.length;
    const photo = activeEvent.photos[activePhotoIndex];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.alt;
    previousPhotoButton.disabled = activeEvent.photos.length < 2;
    nextPhotoButton.disabled = activeEvent.photos.length < 2;

    if (!photoDialog.open) {
      photoDialog.showModal();
    }
  }

  filters.addEventListener("click", function (event) {
    const button = event.target.closest("[data-event-filter]");
    if (!button) {
      return;
    }

    activeFilter = button.dataset.eventFilter;
    filters.querySelectorAll("[data-event-filter]").forEach(function (filter) {
      const isActive = filter === button;
      filter.classList.toggle("is-active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });
    renderEvents();
  });

  eventsGrid.addEventListener("click", function (event) {
    const button = event.target.closest("[data-event-id]");
    if (!button) {
      return;
    }

    activeEvent = events.find(function (item) {
      return item.id === button.dataset.eventId;
    });
    if (activeEvent) {
      renderDetails(activeEvent);
    }
  });

  detailContent.addEventListener("click", function (event) {
    const button = event.target.closest("[data-photo-index]");
    if (button) {
      showPhoto(Number(button.dataset.photoIndex));
    }
  });

  document.querySelector("[data-close-event]").addEventListener("click", function () {
    eventDialog.close();
  });

  document.querySelector("[data-close-photo]").addEventListener("click", function () {
    photoDialog.close();
  });

  previousPhotoButton.addEventListener("click", function () {
    showPhoto(activePhotoIndex - 1);
  });

  nextPhotoButton.addEventListener("click", function () {
    showPhoto(activePhotoIndex + 1);
  });

  photoDialog.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      showPhoto(activePhotoIndex - 1);
    } else if (event.key === "ArrowRight") {
      showPhoto(activePhotoIndex + 1);
    }
  });

  [eventDialog, photoDialog].forEach(function (dialog) {
    dialog.addEventListener("click", function (event) {
      if (event.target === dialog) {
        dialog.close();
      }
    });
  });

  renderFilters();
  renderEvents();
})();
