/* =====================================================================
   JabVolley - script.js
   Author: Joshua Jabez P. Sagad (BSIT 2nd Year, Holy Angel University)
   Course: INTROWEB WD202

   Features
   1. Hamburger menu (tablet and mobile)
   2. "Learn Volleyball" video pop-up
   3. Contact form validation
   ===================================================================== */
"use strict";

/* ---------- 1. Hamburger menu ---------- */
function initNavigation() {
  const button = document.getElementById("nav-toggle");
  const nav = document.getElementById("site-nav");
  if (!button || !nav) return;

  // Open or close the menu and keep the ARIA attributes in sync.
  function setMenuOpen(isOpen) {
    button.setAttribute("aria-expanded", String(isOpen));
    button.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", isOpen);
  }

  button.addEventListener("click", () => {
    setMenuOpen(button.getAttribute("aria-expanded") !== "true");
  });

  // Close the menu when a link is chosen or Escape is pressed.
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenuOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  // Close it automatically when the window grows to desktop size.
  window.matchMedia("(min-width: 1025px)").addEventListener("change", (query) => {
    if (query.matches) setMenuOpen(false);
  });
}

/* ---------- 2. Video pop-up ---------- */
function initVideoModal() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("lesson-video");
  const openButton = document.querySelector("[data-video-open]");
  if (!modal || !video || !openButton) return;

  function closeModal() {
    video.pause();
    if (modal.open) modal.close();
  }

  openButton.addEventListener("click", () => {
    modal.showModal();
    video.play().catch(() => {}); // the browser may block autoplay; the viewer can press play
  });
  modal.querySelector("[data-video-close]").addEventListener("click", closeModal);
  modal.addEventListener("click", (event) => {
    if (event.target === modal) closeModal(); // click on the dark backdrop
  });
  modal.addEventListener("close", () => video.pause()); // also runs when Esc is pressed
}

/* ---------- 3. Contact form validation ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const status = document.getElementById("form-status");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  // Each rule returns an error message, or "" when the value is valid.
  const rules = {
    name: (value) => (value.trim().length < 2 ? "Please enter your full name." : ""),
    email: (value) => (emailPattern.test(value.trim()) ? "" : "Please enter a valid email address, like name@example.com."),
    message: (value) => (value.trim().length < 10 ? "Your message should be at least 10 characters." : ""),
  };

  // Check one field, show or clear its error, and report whether it is valid.
  function validateField(field) {
    const errorText = rules[field.name](field.value);
    document.getElementById(field.id + "-error").textContent = errorText;
    field.setAttribute("aria-invalid", errorText ? "true" : "false");
    return errorText === "";
  }

  const fields = [...form.querySelectorAll(".form__control")];

  fields.forEach((field) => {
    field.addEventListener("blur", () => validateField(field));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(field);
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    status.hidden = true;

    const results = fields.map(validateField); // validate all so every error shows
    if (results.includes(false)) {
      fields[results.indexOf(false)].focus();
      return;
    }

    // This school project has no backend, so we show a confirmation instead of sending.
    form.reset(); // runs the reset handler, which hides the status, so show the message afterwards
    status.textContent = "Thanks! Your message was sent. We'll get back to you soon.";
    status.hidden = false;
  });

  form.addEventListener("reset", () => {
    fields.forEach((field) => {
      field.setAttribute("aria-invalid", "false");
      document.getElementById(field.id + "-error").textContent = "";
    });
    status.hidden = true;
  });
}

initNavigation();
initVideoModal();
initContactForm();
