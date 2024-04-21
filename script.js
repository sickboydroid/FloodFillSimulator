const paintArea = document.querySelector(".paint-area");
const pickedColor = document.querySelector(".picked-color");
const redBar = document.querySelector("#red");
const greenBar = document.querySelector("#green");
const blueBar = document.querySelector("#blue");
const clearGrid = document.querySelector("#clear");
const DEFAULT_CELL_SIZE_PIXELS = 20;
let paintGrid = [];

[redBar, greenBar, blueBar].forEach(e =>
  e.addEventListener("input", onPickedColorChange)
);
clearGrid.addEventListener("click", () => resetPaintArea(DEFAULT_CELL_SIZE_PIXELS));
onPickedColorChange();
resetPaintArea(DEFAULT_CELL_SIZE_PIXELS);

function resetPaintArea(cellSizePixels) {
  const width = paintArea.getBoundingClientRect().width;
  const height = paintArea.getBoundingClientRect().height;

  [...paintArea.children].forEach(child => child.remove());

  const numCols = Math.floor(width / cellSizePixels);
  const numRows = Math.floor(height / cellSizePixels);

  paintGrid = Array(numRows)
    .fill()
    .map(e => Array(numCols));

  paintArea.style["grid-template-columns"] = `repeat(${numCols}, ${cellSizePixels}px)`;
  paintArea.style["grid-template-rows"] = `repeat(${numRows}, ${cellSizePixels}px)`;

  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      const cell = document.createElement("div");
      cell.style["grid-area"] = `${r + 1} ${c + 1} ${r + 1} ${c + 1}`;
      cell.addEventListener("mouseover", event => onCellHovered(event, r, c));
      cell.addEventListener("click", () => onCellClicked(r, c));
      paintGrid[r][c] = cell;
      paintArea.appendChild(cell);
    }
  }
}

function onPickedColorChange() {
  pickedColor.style[
    "background-color"
  ] = `rgb(${redBar.value}, ${greenBar.value}, ${blueBar.value}`;
}

function onCellHovered(event, r, c) {
  if (!event.ctrlKey) return;
  setCellColor(r, c, "rgb(255, 0, 0)");
}

function onCellClicked(r, c) {
  floodFill(r, c, pickedColor.style["background-color"]);
}

function setCellColor(r, c, color) {
  paintGrid[r][c].style["background-color"] = color;
}

function getCellColor(r, c) {
  return getComputedStyle(paintGrid[r][c])["background-color"];
}

// Flood fill algorithm
async function floodFill(sr, sc, fillColor) {
  const orgColor = getCellColor(sr, sc);
  const ROWS = paintGrid.length;
  const COLS = paintGrid[0].length;
  const queue = [[sr, sc]];
  const vis = Array(ROWS)
    .fill()
    .map(e => Array(COLS));
  if (fillColor === orgColor) return;
  while (queue.length > 0) {
    const [r, c] = queue.shift();
    await sleep(20);
    paintGrid[r][c].style["background-color"] = fillColor;
    const dirs = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    for (const [dr, dc] of dirs) {
      const [nr, nc] = [r + dr, c + dc];
      if (0 <= nr && nr < ROWS && 0 <= nc && nc < COLS) {
        if (vis[nr][nc]) continue;
        vis[nr][nc] = true;
        if (getCellColor(nr, nc) !== orgColor) continue;
        queue.push([nr, nc]);
      }
    }
  }
}

// helper function for simulating sleep
async function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
