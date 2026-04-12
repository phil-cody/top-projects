const canvas = document.querySelector("#canvas");
const dimensionsText = document.querySelector(".dimensions");
const resetButton = document.querySelector("#reset");
const chooseInput = document.querySelector("#choose");
const editDimensionsButton = document.querySelector("#edit-dimensions");
const randomColorButton = document.querySelector("#random-color");
const darkeningCheckbox = document.querySelector("#darkening");
const eraserButton = document.querySelector("#eraser");

let w = 16;
let h = 16;

let modes = {
  modeChoose: { on: true, button: chooseInput.parentElement },
  modeRandom: { on: false, button: randomColorButton },
  modeEraser: { on: false, button: eraserButton },
};

let activePen = false;

let lastToolMode = modes.modeChoose;

function toggleActivePen() {
  if (activePen) {
    activePen = false;
    canvas.classList.remove('brush-active');
  } else {
    activePen = true;
    canvas.classList.add('brush-active');
  }
}

function showActiveMode() {
  Object.values(modes).forEach((mode) => {
    if (mode.on) {
      mode.button.style.backgroundColor = "#c0c0c0";
    } else {
      mode.button.style.backgroundColor = "#fff";
    }
  });
}

function disableTools() {
  Object.values(modes).forEach((mode) => (mode.on = false));
}

function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777216).toString(16)}`;
}

function addPixels(canvas) {
  let canvasGap = 0;
  let canvasBorder = 0;
  let lineWidth =
    canvas.getBoundingClientRect().width -
    parseInt(getComputedStyle(canvas).padding) * 2 -
    canvasBorder * 2;
  let widthBlock = (lineWidth - canvasGap * (w - 1)) / w;

  for (let i = 0; i < h; i++) {
    const line = document.createElement("div");
    line.classList.add("canvas-line");

    for (let j = 0; j < w; j++) {
      const block = document.createElement("div");
      line.style.height =
        block.style.height =
        block.style.width =
          `${widthBlock}px`;
      block.style.aspectRatio = "1 / 1";
      block.classList.add("pixel");
      block.dataset.color = "null";
      block.dataset.opacity = "0";

      line.appendChild(block);
    }

    canvas.appendChild(line);
  }

  dimensionsText.textContent = `${w} x ${h}`;
  showActiveMode();
}

function getDimensions() {
  let w = +prompt("Enter canvas size (0 < value <= 100): ", 1);

  if (w <= 0 || w > 100) {
    w = +prompt(
      "The size value must be greater than 0 and less than or equal to 100",
      1,
    );
  }

  return w;
}

function clearCanvas() {
  const lines = document.querySelectorAll(".canvas-line");

  lines.forEach((line) => {
    canvas.removeChild(line);
  });
}

function reset() {
  const pixels = Array.from(document.querySelectorAll(".pixel"));

  pixels.forEach((pixel) => {
    pixel.style.backgroundColor = "rgba(0, 0, 0, 0)";
    pixel.dataset.color = "null";
    pixel.dataset.opacity = "0";
  });

  modes.modeEraser.on = false;
  modes.modeRandom.on = false;
  modes.modeChoose.on = true;

  showActiveMode();
}

function addHoverEffect() {
  const pixels = Array.from(document.querySelectorAll(".pixel"));

  pixels.forEach((pixel) => {
    pixel.addEventListener("click", () => {
      toggleActivePen();
    });

    pixel.addEventListener("mouseenter", () => {
      if (activePen) pixelHandle(pixel);
    });
  });
}

function pixelHandle(pixel) {
  let opacity = +pixel.dataset.opacity;

  if (modes.modeEraser.on) {
    if (opacity > 0) opacity = Math.round(opacity * 10 - 1) / 10;
  } else {
    if (pixel.dataset.color === "null") {
      let color;

      if (modes.modeRandom.on) {
        color = getRandomColor();
      } else {
        color = chooseInput.value;
      }

      pixel.style.backgroundColor = color;
      pixel.dataset.color = color;
    }

    if (darkeningCheckbox.checked) {
      if (opacity < 1) {
        opacity = Math.round(opacity * 10 + 1) / 10;
      }
    } else {
      if (opacity === 0) {
        opacity = 1;
      }
    }
  }

  pixel.dataset.opacity = `${opacity}`;
  pixel.style.opacity = opacity;

  if (!opacity) {
    pixel.dataset.color = "null";
    pixel.style.backgroundColor = "rgba(0, 0, 0, 0)";
  }
}

function onDraw() {}

editDimensionsButton.addEventListener("click", () => {
  w = h = getDimensions();

  clearCanvas();
  addPixels(canvas);
  addHoverEffect();
});

resetButton.addEventListener("click", reset);

randomColorButton.addEventListener("click", () => {
  disableTools();
  modes.modeRandom.on = true;

  lastToolMode = modes.modeRandom;
  showActiveMode();
});

chooseInput.addEventListener("click", () => {
  disableTools();
  modes.modeChoose.on = true;

  lastToolMode = modes.modeChoose;
  showActiveMode();
});

darkeningCheckbox.addEventListener("change", () => {
  if (modes.modeEraser.on) {
    disableTools();
    lastToolMode.on = true;
  }

  showActiveMode();
});

eraserButton.addEventListener("click", () => {
  disableTools();
  modes.modeEraser.on = true;

  showActiveMode();
});

addPixels(canvas);
addHoverEffect();
