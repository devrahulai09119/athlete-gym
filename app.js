(function () {
  const CONFIG = window.ATHLETE_CONFIG;
  if (!CONFIG) return;

  const reduce = document.documentElement.classList.contains("reduce-motion");
  const header = document.getElementById("site-header");
  const nav = document.getElementById("primary-nav");
  const toggle = document.querySelector(".nav-toggle");
  const progress = document.getElementById("scroll-progress");
  const form = document.getElementById("enquiry-form");
  const main = document.getElementById("content");
  const footer = document.querySelector(".footer");
  const waFloat = document.getElementById("wa-float");

  function digitsOnly(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function whatsappReady() {
    const raw = String(CONFIG.whatsappNumber || "");
    const digits = digitsOnly(raw);
    return digits.length >= 8 && digits.length <= 15 && !/whatsapp_number_here/i.test(raw);
  }

  function whatsappHref(key) {
    const digits = digitsOnly(CONFIG.whatsappNumber);
    const text = (CONFIG.whatsappMessages && CONFIG.whatsappMessages[key]) || CONFIG.whatsappMessages.default;
    return "https://wa.me/" + digits + "?text=" + encodeURIComponent(text);
  }

  function setupWhatsapp() {
    const ready = whatsappReady();
    document.querySelectorAll("[data-whatsapp]").forEach(function (el) {
      const flag = el.querySelector(".pending-flag");
      if (ready) {
        el.href = whatsappHref(el.getAttribute("data-whatsapp") || "default");
        el.target = "_blank";
        el.rel = "noopener noreferrer";
        el.classList.remove("is-pending");
        if (flag) flag.remove();
      } else {
        el.classList.add("is-pending");
        el.addEventListener("click", function (event) {
          event.preventDefault();
          const note = document.getElementById("form-note");
          if (note) {
            note.hidden = false;
            note.textContent = "WhatsApp is not configured yet. Add the gym number in config.js. You can still send an enquiry here.";
          }
          const contact = document.getElementById("contact");
          if (contact) contact.scrollIntoView();
          const name = document.getElementById("name");
          if (name) name.focus();
        });
      }
    });
    const tip = document.getElementById("wa-tip");
    if (tip) tip.textContent = ready ? "Chat on WhatsApp" : "WhatsApp number not set";
  }

  function setupImages() {
    document.querySelectorAll("[data-asset]").forEach(function (img) {
      const src = CONFIG.images && CONFIG.images[img.dataset.asset];
      if (src && img.getAttribute("src") !== src) img.src = src;
    });
  }

  function onScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = "scaleX(" + Math.min(1, Math.max(0, ratio)) + ")";
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  let menuOpen = false;

  function syncNavAccess() {
    if (!nav) return;
    const mobile = window.matchMedia("(max-width: 1079px)").matches;
    const hideLinks = mobile && !menuOpen;
    if (hideLinks) {
      nav.setAttribute("aria-hidden", "true");
      nav.inert = true;
    } else {
      nav.removeAttribute("aria-hidden");
      nav.inert = false;
    }
  }

  function setMenu(open) {
    if (!nav || !toggle) return;
    menuOpen = open;
    nav.classList.toggle("is-open", open);
    header.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    document.body.classList.toggle("nav-lock", open);
    [main, footer, waFloat].forEach(function (el) {
      if (!el) return;
      el.inert = open;
    });
    syncNavAccess();
    if (open) {
      const first = nav.querySelector("a");
      if (first) first.focus();
    } else if (document.activeElement && nav.contains(document.activeElement)) {
      toggle.focus();
    }
  }

  function setupNav() {
    if (!toggle || !nav) return;
    toggle.addEventListener("click", function () {
      setMenu(!menuOpen);
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 1079px)").matches) setMenu(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        setMenu(false);
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = [toggle].concat(Array.from(nav.querySelectorAll("a, button")));
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (menuOpen && window.innerWidth >= 1080) setMenu(false);
      else syncNavAccess();
    });
    syncNavAccess();

    const links = Array.from(document.querySelectorAll(".nav__links a[href^='#']"));
    const sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              const current = link.getAttribute("href") === "#" + entry.target.id;
              if (current) link.setAttribute("aria-current", "true");
              else link.removeAttribute("aria-current");
            });
          });
        },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0.01 }
      );
      sections.forEach(function (section) {
        observer.observe(section);
      });
    }
  }

  function setupEnquire() {
    document.querySelectorAll("[data-enquire]").forEach(function (el) {
      el.addEventListener("click", function () {
        const select = document.getElementById("interest");
        const preferred = document.getElementById("preferred");
        const value = el.getAttribute("data-enquire");
        const focus = el.getAttribute("data-preferred");
        if (select && value) select.value = value;
        if (preferred && focus) preferred.value = focus;
      });
    });
  }

  function setFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(id + "-error");
    if (!input || !error) return;
    if (message) {
      input.setAttribute("aria-invalid", "true");
      error.hidden = false;
      error.textContent = message;
    } else {
      input.removeAttribute("aria-invalid");
      error.hidden = true;
      error.textContent = "";
    }
  }

  function validateForm(data) {
    const errors = {};
    const phone = digitsOnly(data.phone);
    if (data.name.trim().length < 2 || !/[\p{L}]/u.test(data.name)) errors.name = "Enter your full name.";
    if (phone.length < 8 || phone.length > 15) errors.phone = "Enter a phone number with 8 to 15 digits.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) errors.email = "Enter a valid email address.";
    if (!CONFIG.interests.includes(data.interest)) errors.interest = "Choose what you are interested in.";
    if (data.message.trim().length < 10) errors.message = "Add a short message so the gym knows how to help.";
    return errors;
  }

  function setupForm() {
    if (!form) return;
    const started = document.getElementById("startedAt");
    if (started) started.value = String(Date.now());
    const fields = document.getElementById("form-fields");
    const success = document.getElementById("form-success");
    const banner = document.getElementById("form-banner");
    const submit = document.getElementById("form-submit");
    const reset = document.getElementById("form-reset");
    let state = "idle";

    function showBanner(message) {
      if (!banner) return;
      if (!message) {
        banner.hidden = true;
        banner.textContent = "";
        return;
      }
      banner.hidden = false;
      banner.textContent = message;
    }

    ["name", "phone", "email", "interest", "message"].forEach(function (id) {
      setFieldError(id, "");
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (state === "submitting") return;
      const data = {
        name: form.name.value,
        phone: form.phone.value,
        email: form.email.value,
        interest: form.interest.value,
        preferred: form.preferred.value,
        message: form.message.value,
        leave_blank: form.leave_blank.value,
        startedAt: Number(form.startedAt.value)
      };
      const errors = validateForm(data);
      ["name", "phone", "email", "interest", "message"].forEach(function (id) {
        setFieldError(id, errors[id] || "");
      });
      if (Object.keys(errors).length) {
        state = "validating";
        showBanner("Check the highlighted fields.");
        const first = form.querySelector("[aria-invalid='true']");
        if (first) first.focus();
        return;
      }

      state = "submitting";
      showBanner("");
      const label = submit ? submit.querySelector(".btn__label") : null;
      if (submit) {
        submit.disabled = true;
        submit.setAttribute("aria-busy", "true");
        if (label) label.textContent = "Sending…";
      }

      fetch(CONFIG.enquiryEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (response) {
          return response.json().catch(function () {
            return {};
          }).then(function (payload) {
            return { response: response, payload: payload };
          });
        })
        .then(function (result) {
          if (result.response.ok && result.payload && result.payload.ok === true) {
            state = "success";
            if (fields) fields.hidden = true;
            if (success) success.hidden = false;
            showBanner("");
            return;
          }
          state = "error";
          if (result.payload && result.payload.errors) {
            Object.keys(result.payload.errors).forEach(function (key) {
              setFieldError(key, result.payload.errors[key]);
            });
          }
          showBanner((result.payload && result.payload.message) || "This enquiry could not be sent.");
        })
        .catch(function () {
          state = "error";
          showBanner("This enquiry could not be sent. The server did not respond.");
        })
        .finally(function () {
          if (state !== "success" && submit) {
            submit.disabled = false;
            submit.removeAttribute("aria-busy");
            if (label) label.textContent = "Submit enquiry";
          }
        });
    });

    if (reset) {
      reset.addEventListener("click", function () {
        form.reset();
        if (started) started.value = String(Date.now());
        if (fields) fields.hidden = false;
        if (success) success.hidden = true;
        showBanner("");
        state = "idle";
        if (submit) {
          submit.disabled = false;
          submit.removeAttribute("aria-busy");
          if (submit.querySelector(".btn__label")) submit.querySelector(".btn__label").textContent = "Submit enquiry";
        }
        ["name", "phone", "email", "interest", "message"].forEach(function (id) {
          setFieldError(id, "");
        });
      });
    }
  }

  function setupMotion() {
    if (reduce || !window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    function clearTween(target) {
      return function () {
        gsap.set(target, { clearProps: "all" });
      };
    }

    gsap.from(".hero-reveal", {
      y: 22,
      autoAlpha: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.05,
      onComplete: clearTween(".hero-reveal")
    });
    gsap.from(".hero__title .line", {
      yPercent: 110,
      duration: 1,
      stagger: 0.08,
      ease: "power3.out"
    });

    gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      gsap.from(el, {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete: clearTween(el)
      });
    });

    gsap.utils.toArray("[data-stagger]").forEach(function (group) {
      const items = Array.from(group.children);
      gsap.from(items, {
        y: 22,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: group, start: "top 86%", once: true },
        onComplete: clearTween(items)
      });
    });

    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px)", function () {
      gsap.utils.toArray("[data-parallax]").forEach(function (img) {
        const frame = img.closest("section") || img.parentElement;
        gsap.fromTo(img, { yPercent: -6 }, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: { trigger: frame, start: "top bottom", end: "bottom top", scrub: 0.7 }
        });
      });
      gsap.utils.toArray(".energy-card").forEach(function (card, index) {
        const distance = index === 1 ? 42 : 18;
        gsap.fromTo(card, { y: distance }, {
          y: index === 1 ? -18 : 8,
          ease: "none",
          scrollTrigger: {
            trigger: ".energy-board",
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      });
    });

    window.addEventListener("load", function () {
      window.ScrollTrigger.refresh();
    });
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  document.body.classList.add("nav-ready");
  setupImages();
  setupWhatsapp();
  setupNav();
  setupEnquire();
  setupForm();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  setupMotion();
})();
