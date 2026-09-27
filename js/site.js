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

  /* Contribution / improvement draft tools */
  function downloadText(filename, text) {
    var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

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
    var missing = [];
    names.forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      var value = (field.value || "").trim();
      if (!value) {
        missing.push(name);
        field.setAttribute("aria-invalid", "true");
        var err = document.createElement("span");
        err.className = "field-error";
        err.textContent = "Required";
        field.parentNode.appendChild(err);
      }
    });
    return missing.length === 0;
  }

  function slugify(s) {
    return (s || "draft")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "draft";
  }

  /* Preselect from query params */
  var params = new URLSearchParams(window.location.search);
  var typeParam = params.get("type");
  if (typeParam) {
    var contribArea = document.getElementById("contrib-area");
    var proposalType = document.getElementById("proposal-type");
    var map = {
      "business-idea": { contrib: "Business ideas and customer research", proposal: "Business idea" },
      "rule-improvement": { contrib: "Legal and operating structures", proposal: "Rule improvement" },
      "economic-model": { contrib: "Financial modeling", proposal: "Economic model" },
      "safeguard": { contrib: "Legal and operating structures", proposal: "Operational safeguard" }
    };
    var mapped = map[typeParam];
    if (mapped) {
      if (contribArea) contribArea.value = mapped.contrib;
      if (proposalType) proposalType.value = mapped.proposal;
      if (typeParam.indexOf("rule") !== -1 || typeParam.indexOf("business") !== -1) {
        var target = document.getElementById("proposal-form");
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }

  var contribForm = document.getElementById("contribution-form");
  if (contribForm) {
    var contribStatus = document.getElementById("contrib-status");
    contribForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!requireFields(contribForm, ["area", "title", "offer"])) {
        setStatus(contribStatus, "Please complete the required fields before downloading.", true);
        return;
      }
      var data = {
        area: contribForm.area.value.trim(),
        title: contribForm.title.value.trim(),
        offer: contribForm.offer.value.trim(),
        context: (contribForm.context.value || "").trim()
      };
      var body = [
        "Shared Abundance · Contribution draft",
        "Status: Local draft only. Nothing has been sent to the project.",
        "Generated: " + new Date().toISOString(),
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
        "- End of draft -"
      ].join("\n");
      downloadText("sa-contribution-" + slugify(data.title) + ".txt", body);
      setStatus(
        contribStatus,
        "Draft downloaded. Nothing was sent to Shared Abundance. Keep or share the file yourself until a submission service is configured.",
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
        "Shared Abundance · Improvement draft",
        "Status: Local draft only. Not published or submitted.",
        "Generated: " + new Date().toISOString(),
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
        "- End of draft -"
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
        setStatus(proposalStatus, "Preview ready below. This draft has not been submitted.", false);
      });
    }

    proposalForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!requireFields(proposalForm, ["type", "title", "problem", "change", "benefit"])) {
        setStatus(proposalStatus, "Please complete the required fields before downloading.", true);
        return;
      }
      var text = buildProposalText();
      preview.hidden = false;
      preview.textContent = text;
      downloadText("sa-improvement-" + slugify(proposalForm.title.value) + ".md", text);
      setStatus(
        proposalStatus,
        "Improvement draft downloaded as a Markdown file. Nothing was sent or published.",
        false
      );
    });

    var copyBtn = document.getElementById("proposal-copy-btn");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        if (!requireFields(proposalForm, ["type", "title", "problem", "change", "benefit"])) {
          setStatus(proposalStatus, "Please complete the required fields before copying.", true);
          return;
        }
        var text = buildProposalText();
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(function () {
            setStatus(proposalStatus, "Draft copied to clipboard. Nothing was sent to the project.", false);
          }).catch(function () {
            setStatus(proposalStatus, "Clipboard copy failed. Use Download instead.", true);
          });
        } else {
          setStatus(proposalStatus, "Clipboard is unavailable in this browser. Use Download instead.", true);
        }
      });
    }
  }
})();
