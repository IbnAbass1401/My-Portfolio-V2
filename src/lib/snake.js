// Snake game helpers: turn the page into a grid of walls.
// Grid cell = 16px. A cell is a wall when its centre lies inside an element's box.

export const CELL = 16;

// elements that become solid blocks
const BOX_SELECTOR = [
  "header",
  "footer",
  "main a[href]",
  "main button",
  "main input",
  "main textarea",
  "main summary",
  "main li",
  "main .rounded-2xl",
  "#about .grid > *",
  "#hero .inline-flex",
].join(",");

// the tech marquee is NOT a wall (so the snake can cross between sections);
// the game's own UI and screen-reader-only text are ignored
const IGNORE_SELECTOR = "[data-game-ui], section[aria-label^='Technologies'], .sr-only";

// true when the element is really on the page: visible, not fixed to the screen, not ignored
function usable(el, cache) {
  if (cache.has(el)) return cache.get(el);
  let ok = true;
  if (el.closest(IGNORE_SELECTOR)) {
    ok = false;
  } else {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || cs.position === "fixed") {
      ok = false;
    } else if (
      el.parentElement &&
      el.parentElement !== document.body &&
      el.parentElement !== document.documentElement
    ) {
      ok = usable(el.parentElement, cache);
    }
  }
  cache.set(el, ok);
  return ok;
}

// page size in pixels
export function measureDoc() {
  const de = document.documentElement;
  return {
    width: de.clientWidth,
    height: Math.max(de.scrollHeight, document.body.scrollHeight),
  };
}

// every wall as [x, y, width, height] in page coordinates.
// boxes = elements, lines = individual lines of real text
export function collectWalls() {
  const sx = window.scrollX;
  const sy = window.scrollY;
  const cache = new Map();
  const boxes = [];
  const lines = [];
  const push = (list, r) => {
    if (r.width >= 4 && r.height >= 4) list.push([r.left + sx, r.top + sy, r.width, r.height]);
  };

  document.querySelectorAll(BOX_SELECTOR).forEach((el) => {
    if (usable(el, cache)) push(boxes, el.getBoundingClientRect());
  });

  // text: one rectangle per line, using a Range
  const range = document.createRange();
  document.querySelectorAll("header, main, footer").forEach((root) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.nodeValue.trim()) continue;
      const parent = node.parentElement;
      if (!parent || !usable(parent, cache)) continue;
      range.selectNodeContents(node);
      for (const r of range.getClientRects()) push(lines, r);
    }
  });

  return { boxes, lines };
}

// turns rectangles into a grid: walls[row * cols + col] = 1 when that cell is solid
export function buildGrid(rects, width, height) {
  const cols = Math.max(1, Math.floor(width / CELL));
  const rows = Math.max(1, Math.ceil(height / CELL));
  const walls = new Uint8Array(cols * rows);

  for (const [x, y, w, h] of rects) {
    // a cell is solid when its centre is inside the rectangle
    const c0 = Math.max(0, Math.ceil(x / CELL - 0.5));
    const c1 = Math.min(cols - 1, Math.floor((x + w) / CELL - 0.5));
    const r0 = Math.max(0, Math.ceil(y / CELL - 0.5));
    const r1 = Math.min(rows - 1, Math.floor((y + h) / CELL - 0.5));
    for (let r = r0; r <= r1; r++) {
      for (let c = c0; c <= c1; c++) walls[r * cols + c] = 1;
    }
  }
  return { cols, rows, walls };
}