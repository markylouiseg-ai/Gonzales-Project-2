
/**
 * KCC Website - Main JavaScript
 * Based on the Bootstrap Mentor template.
 * Includes navigation, scroll effects, and smooth animations.
 */

(function () {
  "use strict";

  // Header scroll effect
  function toggleScrolled() {
    const body = document.body;
    const header = document.querySelector("#header");

    if (!header) return;

    if (
      header.classList.contains("scroll-up-sticky") ||
      header.classList.contains("sticky-top") ||
      header.classList.contains("fixed-top")
    ) {
      body.classList.toggle("scrolled", window.scrollY > 100);
    }
  }

  window.addEventListener("scroll", toggleScrolled, { passive: true });
  window.addEventListener("load", toggleScrolled);

  // Mobile navigation
  const mobileNavToggleBtn = document.querySelector(".mobile-nav-toggle");

  function toggleMobileNav() {
    if (!mobileNavToggleBtn) return;

    document.body.classList.toggle("mobile-nav-active");
    mobileNavToggleBtn.classList.toggle("bi-list");
    mobileNavToggleBtn.classList.toggle("bi-x");
  }

  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener("click", toggleMobileNav);
  }

  // Close mobile navigation after selecting a section
  document.querySelectorAll("#navmenu a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (document.body.classList.contains("mobile-nav-active")) {
        toggleMobileNav();
      }
    });
  });

  // Mobile dropdowns
  document.querySelectorAll(".navmenu .toggle-dropdown").forEach(function (item) {
    item.addEventListener("click", function (event) {
      event.preventDefault();

      const parent = this.parentNode;
      const submenu = parent.nextElementSibling;

      parent.classList.toggle("active");

      if (submenu) {
        submenu.classList.toggle("dropdown-active");
      }

      event.stopPropagation();
    });
  });

  // Preloader
  const preloader = document.querySelector("#preloader");

  if (preloader) {
    window.addEventListener("load", function () {
      preloader.remove();
    });
  }

  // Scroll-to-top button
  const scrollTop = document.querySelector(".scroll-top");

  function toggleScrollTop() {
    if (scrollTop) {
      scrollTop.classList.toggle("active", window.scrollY > 100);
    }
  }

  if (scrollTop) {
    scrollTop.addEventListener("click", function (event) {
      event.preventDefault();

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  window.addEventListener("load", toggleScrollTop);
  window.addEventListener("scroll", toggleScrollTop, { passive: true });

  // Animate sections when they enter the screen
  function aosInit() {
    if (typeof AOS === "undefined") return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    AOS.init({
      duration: 750,
      easing: "ease-out-cubic",
      once: true,
      mirror: false,
      offset: 75,
      disable: reduceMotion
    });
  }

  window.addEventListener("load", aosInit);

  // GLightbox
  if (typeof GLightbox !== "undefined") {
    GLightbox({
      selector: ".glightbox"
    });
  }

  // Pure Counter
  if (typeof PureCounter !== "undefined") {
    new PureCounter();
  }

  // Swiper sliders
  function initSwiper() {
    if (typeof Swiper === "undefined") return;

    document.querySelectorAll(".init-swiper").forEach(function (element) {
      const configElement = element.querySelector(".swiper-config");

      if (!configElement) return;

      try {
        const config = JSON.parse(configElement.innerHTML.trim());

        if (
          element.classList.contains("swiper-tab") &&
          typeof initSwiperWithCustomPagination === "function"
        ) {
          initSwiperWithCustomPagination(element, config);
        } else {
          new Swiper(element, config);
        }
      } catch (error) {
        console.error("Unable to initialize Swiper:", error);
      }
    });
  }

  window.addEventListener("load", initSwiper);

})();
