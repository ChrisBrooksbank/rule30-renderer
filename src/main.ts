import { centeredSeed, clampRule, generateRows, randomSeed, type Cell } from "./automaton";
import "./styles.css";

type AppState = {
  rule: number;
  columns: number;
  generations: number;
  cellSize: number;
  animate: boolean;
  visibleRows: number;
  seed: Cell[];
};

const state: AppState = {
  rule: 30,
  columns: 241,
  generations: 180,
  cellSize: 4,
  animate: true,
  visibleRows: 1,
  seed: centeredSeed(241),
};

const app = document.querySelector<HTMLElement>("#app");

if (!app) {
  throw new Error("App root not found");
}

app.innerHTML = `
  <section class="workspace" aria-label="Rule 30 renderer">
    <aside class="panel">
      <div>
        <p class="eyebrow">Elementary Cellular Automata</p>
        <h1>Rule 30 Renderer</h1>
      </div>

      <div class="control-grid">
        <label>
          <span>Rule</span>
          <input id="rule" type="number" min="0" max="255" value="${state.rule}" />
        </label>

        <label>
          <span>Columns</span>
          <input id="columns" type="range" min="41" max="401" step="2" value="${state.columns}" />
          <output id="columnsValue">${state.columns}</output>
        </label>

        <label>
          <span>Generations</span>
          <input id="generations" type="range" min="40" max="320" value="${state.generations}" />
          <output id="generationsValue">${state.generations}</output>
        </label>

        <label>
          <span>Cell Size</span>
          <input id="cellSize" type="range" min="2" max="8" value="${state.cellSize}" />
          <output id="cellSizeValue">${state.cellSize}px</output>
        </label>
      </div>

      <div class="button-row">
        <button id="playPause" type="button">Pause</button>
        <button id="reset" type="button">Reset</button>
        <button id="randomSeed" type="button">Random Seed</button>
        <button id="export" type="button">Export PNG</button>
      </div>

      <p class="meta" id="ruleBits"></p>
    </aside>

    <section class="stage" aria-label="Rendered automaton">
      <canvas id="ruleCanvas"></canvas>
    </section>
  </section>
`;

const canvasElement = document.querySelector<HTMLCanvasElement>("#ruleCanvas");
const canvasContext = canvasElement?.getContext("2d");

if (!canvasElement || !canvasContext) {
  throw new Error("Canvas not available");
}

const canvas = canvasElement;
const context = canvasContext;

const controls = {
  rule: document.querySelector<HTMLInputElement>("#rule"),
  columns: document.querySelector<HTMLInputElement>("#columns"),
  generations: document.querySelector<HTMLInputElement>("#generations"),
  cellSize: document.querySelector<HTMLInputElement>("#cellSize"),
  columnsValue: document.querySelector<HTMLOutputElement>("#columnsValue"),
  generationsValue: document.querySelector<HTMLOutputElement>("#generationsValue"),
  cellSizeValue: document.querySelector<HTMLOutputElement>("#cellSizeValue"),
  playPause: document.querySelector<HTMLButtonElement>("#playPause"),
  reset: document.querySelector<HTMLButtonElement>("#reset"),
  randomSeed: document.querySelector<HTMLButtonElement>("#randomSeed"),
  export: document.querySelector<HTMLButtonElement>("#export"),
  ruleBits: document.querySelector<HTMLParagraphElement>("#ruleBits"),
};

let animationFrame = 0;
let lastTick = 0;

function normalizeOdd(value: number): number {
  const rounded = Math.trunc(value);
  return rounded % 2 === 0 ? rounded + 1 : rounded;
}

function resizeSeed(nextColumns: number): void {
  state.columns = normalizeOdd(nextColumns);
  state.seed = centeredSeed(state.columns);
  state.visibleRows = 1;
}

function updateLabels(): void {
  if (controls.columnsValue) controls.columnsValue.value = String(state.columns);
  if (controls.generationsValue) controls.generationsValue.value = String(state.generations);
  if (controls.cellSizeValue) controls.cellSizeValue.value = `${state.cellSize}px`;
  if (controls.playPause) controls.playPause.textContent = state.animate ? "Pause" : "Play";
  if (controls.ruleBits) {
    controls.ruleBits.textContent = `Rule ${state.rule}: ${state.rule
      .toString(2)
      .padStart(8, "0")} for neighborhoods 111 to 000.`;
  }
}

function draw(): void {
  const rows = generateRows(state.rule, state.seed, state.generations);
  const width = state.columns * state.cellSize;
  const height = state.generations * state.cellSize;
  const displayRows = Math.min(state.visibleRows, rows.length);

  canvas.width = width;
  canvas.height = height;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  context.fillStyle = "#f5f7f2";
  context.fillRect(0, 0, width, height);

  context.fillStyle = "#101319";
  for (let rowIndex = 0; rowIndex < displayRows; rowIndex += 1) {
    const row = rows[rowIndex];
    for (let columnIndex = 0; columnIndex < row.length; columnIndex += 1) {
      if (row[columnIndex] === 1) {
        context.fillRect(
          columnIndex * state.cellSize,
          rowIndex * state.cellSize,
          state.cellSize,
          state.cellSize,
        );
      }
    }
  }
}

function tick(timestamp: number): void {
  if (state.animate && timestamp - lastTick > 18) {
    state.visibleRows = Math.min(state.generations, state.visibleRows + 2);
    lastTick = timestamp;
    draw();
  }

  animationFrame = window.requestAnimationFrame(tick);
}

function restartAnimation(): void {
  state.visibleRows = state.animate ? 1 : state.generations;
  updateLabels();
  draw();
}

controls.rule?.addEventListener("input", (event) => {
  const input = event.currentTarget as HTMLInputElement;
  state.rule = clampRule(Number(input.value));
  input.value = String(state.rule);
  restartAnimation();
});

controls.columns?.addEventListener("input", (event) => {
  const columns = Number((event.currentTarget as HTMLInputElement).value);
  resizeSeed(columns);
  restartAnimation();
});

controls.generations?.addEventListener("input", (event) => {
  state.generations = Number((event.currentTarget as HTMLInputElement).value);
  restartAnimation();
});

controls.cellSize?.addEventListener("input", (event) => {
  state.cellSize = Number((event.currentTarget as HTMLInputElement).value);
  restartAnimation();
});

controls.playPause?.addEventListener("click", () => {
  state.animate = !state.animate;
  state.visibleRows = state.animate ? Math.min(state.visibleRows, state.generations) : state.generations;
  updateLabels();
  draw();
});

controls.reset?.addEventListener("click", () => {
  state.seed = centeredSeed(state.columns);
  restartAnimation();
});

controls.randomSeed?.addEventListener("click", () => {
  state.seed = randomSeed(state.columns);
  restartAnimation();
});

controls.export?.addEventListener("click", () => {
  state.visibleRows = state.generations;
  draw();

  const link = document.createElement("a");
  link.download = `rule-${state.rule}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
});

restartAnimation();
animationFrame = window.requestAnimationFrame(tick);

window.addEventListener("beforeunload", () => {
  window.cancelAnimationFrame(animationFrame);
});
