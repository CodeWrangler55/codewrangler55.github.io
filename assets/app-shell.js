import { calculate } from "./calculators.mjs";

const config = window.projectConfig;
const state = Object.fromEntries(config.controls.map((control) => [control.id, control.value]));

function formatControlValue(control, value) {
  if (control.type === "select") return control.options.find((option) => option.value === value)?.label ?? value;
  if (control.suffix) return `${value}${control.suffix}`;
  if (control.prefix) return `${control.prefix}${Number(value).toLocaleString()}`;
  return String(value);
}

function renderControls() {
  const form = document.querySelector("[data-controls]");
  form.innerHTML = config.controls
    .map((control) => {
      if (control.type === "select") {
        return `<div class="field"><label for="${control.id}">${control.label}<span data-value="${control.id}">${formatControlValue(control, control.value)}</span></label><select id="${control.id}" data-control="${control.id}">${control.options
          .map((option) => `<option value="${option.value}" ${option.value === control.value ? "selected" : ""}>${option.label}</option>`)
          .join("")}</select></div>`;
      }
      return `<div class="field"><label for="${control.id}">${control.label}<span data-value="${control.id}">${formatControlValue(control, control.value)}</span></label><input id="${control.id}" data-control="${control.id}" type="range" min="${control.min}" max="${control.max}" step="${control.step ?? 1}" value="${control.value}"></div>`;
    })
    .join("");
}

function renderResults() {
  const result = calculate(config.kind, state);
  document.querySelector("[data-metrics]").innerHTML = result.metrics
    .map((metric) => `<section class="metric"><span>${metric.label}</span><strong>${metric.value}</strong></section>`)
    .join("");
  document.querySelector("[data-insight-title]").textContent = config.insightTitle;
  document.querySelector("[data-insight-body]").textContent = result.nextMove ?? result.finding ?? config.insightBody;
  document.querySelector("[data-audit]").innerHTML = (result.audit ?? config.audit)
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.querySelector("[data-bars]").innerHTML = config.controls
    .filter((control) => control.type !== "select")
    .map((control) => {
      const raw = Number(state[control.id]);
      const percent = Math.round(((raw - control.min) / (control.max - control.min)) * 100);
      return `<div class="bar-row"><span>${control.shortLabel ?? control.label}</span><div class="bar-track"><div class="bar-fill" style="width:${percent}%"></div></div><strong>${formatControlValue(control, raw)}</strong></div>`;
    })
    .join("");
}

function bindControls() {
  document.querySelector("[data-controls]").addEventListener("input", (event) => {
    const target = event.target;
    const id = target.dataset.control;
    if (!id) return;
    const control = config.controls.find((item) => item.id === id);
    state[id] = control.type === "select" ? target.value : Number(target.value);
    document.querySelector(`[data-value="${id}"]`).textContent = formatControlValue(control, state[id]);
    renderResults();
  });
}

function boot() {
  document.title = config.title;
  document.querySelectorAll("[data-title]").forEach((node) => {
    node.textContent = config.title;
  });
  document.querySelector("[data-subtitle]").textContent = config.subtitle;
  document.querySelector("[data-kicker]").textContent = config.kicker;
  renderControls();
  bindControls();
  renderResults();
}

boot();
