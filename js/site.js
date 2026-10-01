(function () {
  "use strict";

  /* Page hits: public beacon to Jake's Mini (no secret in the page).
   * Logs path + source fields. Mini WhatsApps Jake only for home=1.
   * Easy to disable: remove this block or return 204 from /site-hit.
   */
  (function trackHit() {
    var endpoint = "https://jakes-mac-mini2.tail98d8ce.ts.net/site-hit";
    var path = window.location.pathname || "/";
    var home = path === "/" || path === "/index.html";
    var params = new URLSearchParams(window.location.search || "");
    var ref = document.referrer || "";
    var utmKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
    var parts = [
      "path=" + encodeURIComponent(path),
      "home=" + (home ? "1" : "0"),
      "ref=" + encodeURIComponent(ref.slice(0, 500)),
      "lang=" + encodeURIComponent((navigator.language || "").slice(0, 32)),
      "landing=" + encodeURIComponent((window.location.search || "").slice(0, 300)),
      "t=" + Date.now()
    ];
    utmKeys.forEach(function (k) {
      var v = (params.get(k) || "").trim();
      if (v) parts.push(k + "=" + encodeURIComponent(v.slice(0, 120)));
    });
    try {
      var img = new Image();
      img.referrerPolicy = "no-referrer";
      img.src = endpoint + "?" + parts.join("&");
    } catch (e) { /* ignore */ }
  })();

  /* Mobile nav */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Contribution / improvement forms */
  function setStatus(el, message, isError) {
    if (!el) return;
    el.hidden = false;
    el.textContent = message;
    el.classList.toggle("is-error", !!isError);
  }

  function clearFieldErrors(form) {
    form.querySelectorAll(".field-error").forEach(function (n) { n.remove(); });
    form.querySelectorAll("[aria-invalid]").forEach(function (n) {
      n.removeAttribute("aria-invalid");
    });
  }

  function requireFields(form, names) {
    clearFieldErrors(form);
    var ok = true;
    names.forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      var value = (field.value || "").trim();
      if (!value) {
        ok = false;
        field.setAttribute("aria-invalid", "true");
        var err = document.createElement("div");
        err.className = "field-error";
        err.textContent = "This field is required.";
        field.parentNode.appendChild(err);
      }
    });
    return ok;
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("sent") === "1") {
    var banner = document.createElement("div");
    banner.className = "note-box";
    banner.setAttribute("role", "status");
    banner.textContent = "Thanks. Your message was sent to info@sharedabundance.world.";
    var main = document.getElementById("main");
    if (main && main.firstElementChild) {
      main.insertBefore(banner, main.firstElementChild.nextSibling);
    }
  }

  var typeParam = params.get("type");
  if (typeParam) {
    var contribArea = document.getElementById("contrib-area");
    var proposalType = document.getElementById("proposal-type");
    var map = {
      "business-idea": { contrib: "Business ideas and customer research", proposal: "Business idea" },
      "rule-improvement": { contrib: "Legal and operating setup", proposal: "Rule improvement" },
      "economic-model": { contrib: "Money model", proposal: "Economic model" },
      "safeguard": { contrib: "Legal and operating setup", proposal: "Operational safeguard" }
    };
    var mapped = map[typeParam];
    if (mapped) {
      if (contribArea) contribArea.value = mapped.contrib;
      if (proposalType) proposalType.value = mapped.proposal;
      var target = document.getElementById("proposal-form");
      if (target && typeParam.indexOf("rule") === 0) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  var contribForm = document.getElementById("contribution-form");
  if (contribForm) {
    var contribStatus = document.getElementById("contrib-status");
    contribForm.addEventListener("submit", function (e) {
      if (!requireFields(contribForm, ["email", "area", "title", "offer"])) {
        e.preventDefault();
        setStatus(contribStatus, "Please complete the required fields before sending.", true);
        return;
      }
      var subj = contribForm.querySelector('input[name="_subject"]');
      if (subj) subj.value = "Shared Abundance · Contribution: " + contribForm.title.value.trim();
      setStatus(contribStatus, "Sending…", false);
    });
  }

  var proposalForm = document.getElementById("proposal-form-el");
  if (proposalForm) {
    var proposalStatus = document.getElementById("proposal-status");
    var preview = document.getElementById("proposal-preview");

    function buildProposalText() {
      return [
        "Improvement type: " + proposalForm.type.value.trim(),
        "Title: " + proposalForm.title.value.trim(),
        "",
        "Problem:",
        proposalForm.problem.value.trim(),
        "",
        "Suggested change:",
        proposalForm.change.value.trim(),
        "",
        "Expected benefit:",
        proposalForm.benefit.value.trim(),
        "",
        "Trade-offs / open questions:",
        (proposalForm.tradeoffs.value || "").trim() || "(not provided)"
      ].join("\n");
    }

    var previewBtn = document.getElementById("proposal-preview-btn");
    if (previewBtn) {
      previewBtn.addEventListener("click", function () {
        if (!requireFields(proposalForm, ["email", "type", "title", "problem", "change", "benefit"])) {
          setStatus(proposalStatus, "Please complete the required fields before previewing.", true);
          return;
        }
        preview.hidden = false;
        preview.textContent = buildProposalText();
        setStatus(proposalStatus, "Preview ready below.", false);
      });
    }

    proposalForm.addEventListener("submit", function (e) {
      if (!requireFields(proposalForm, ["email", "type", "title", "problem", "change", "benefit"])) {
        e.preventDefault();
        setStatus(proposalStatus, "Please complete the required fields before sending.", true);
        return;
      }
      var subj = proposalForm.querySelector('input[name="_subject"]');
      if (subj) subj.value = "Shared Abundance · Improvement: " + proposalForm.title.value.trim();
      setStatus(proposalStatus, "Sending…", false);
    });
  }
})();
