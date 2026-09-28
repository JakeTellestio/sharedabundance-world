(function () {
  "use strict";

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

  /* Contribution / improvement email tools */
  var CONTACT_EMAIL = "info@sharedabundance.world";

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

  function openMailto(subject, body) {
    var url = "mailto:" + CONTACT_EMAIL
      + "?subject=" + encodeURIComponent(subject)
      + "&body=" + encodeURIComponent(body);
    window.location.href = url;
  }

  var params = new URLSearchParams(window.location.search);
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
      e.preventDefault();
      if (!requireFields(contribForm, ["area", "title", "offer"])) {
        setStatus(contribStatus, "Please complete the required fields before sending.", true);
        return;
      }
      var data = {
        area: contribForm.area.value.trim(),
        title: contribForm.title.value.trim(),
        offer: contribForm.offer.value.trim(),
        context: (contribForm.context.value || "").trim()
      };
      var body = [
        "Shared Abundance · Contribution",
        "",
        "Contribution area: " + data.area,
        "Title: " + data.title,
        "",
        "What I can offer:",
        data.offer,
        "",
        "Availability / context:",
        data.context || "(not provided)",
        "",
        "(Please keep your reply address so we can respond.)"
      ].join("\n");
      openMailto("Contribution: " + data.title, body);
      setStatus(
        contribStatus,
        "Your email app should open with a message to info@sharedabundance.world. Send it from there.",
        false
      );
    });
  }

  var proposalForm = document.getElementById("proposal-form-el");
  if (proposalForm) {
    var proposalStatus = document.getElementById("proposal-status");
    var preview = document.getElementById("proposal-preview");

    function buildProposalText() {
      return [
        "Shared Abundance · Improvement suggestion",
        "",
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
        (proposalForm.tradeoffs.value || "").trim() || "(not provided)",
        "",
        "(Please keep your reply address so we can respond.)"
      ].join("\n");
    }

    var previewBtn = document.getElementById("proposal-preview-btn");
    if (previewBtn) {
      previewBtn.addEventListener("click", function () {
        if (!requireFields(proposalForm, ["type", "title", "problem", "change", "benefit"])) {
          setStatus(proposalStatus, "Please complete the required fields before previewing.", true);
          return;
        }
        preview.hidden = false;
        preview.textContent = buildProposalText();
        setStatus(proposalStatus, "Preview ready below.", false);
      });
    }

    proposalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!requireFields(proposalForm, ["type", "title", "problem", "change", "benefit"])) {
        setStatus(proposalStatus, "Please complete the required fields before sending.", true);
        return;
      }
      var text = buildProposalText();
      preview.hidden = false;
      preview.textContent = text;
      openMailto("Improvement: " + proposalForm.title.value.trim(), text);
      setStatus(
        proposalStatus,
        "Your email app should open with a message to info@sharedabundance.world. Send it from there.",
        false
      );
    });
  }
})();
