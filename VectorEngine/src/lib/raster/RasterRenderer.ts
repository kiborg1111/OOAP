export type RGBA = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type LineAlg = "bresenham" | "wu";

export function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)));
}

export function hexToRGBA(hex: string, alpha = 255): RGBA {
  let h = hex.replace("#", "").trim();

  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const num = parseInt(h, 16);

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: alpha,
  };
}

export class RasterRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private imageData!: ImageData;
  private buf!: Uint8ClampedArray;

  width = 0;
  height = 0;
  dpr = 1;

  private lineAlg: LineAlg = "bresenham";
  private _onResize: () => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("2D context not found");

    this.ctx = ctx;

    this._onResize = () => this.resize();
    window.addEventListener("resize", this._onResize);

    this.resize();
  }

  dispose() {
    window.removeEventListener("resize", this._onResize);
  }

  setLineAlgorithm(a: LineAlg) {
    this.lineAlg = a;
  }

  getLineAlgorithm(): LineAlg {
    return this.lineAlg;
  }

  private idx(x: number, y: number): number {
    return (y * this.width + x) * 4;
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();

    this.dpr = window.devicePixelRatio || 1;

    this.width = Math.max(1, Math.floor(rect.width * this.dpr));
    this.height = Math.max(1, Math.floor(rect.height * this.dpr));

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.imageData = this.ctx.createImageData(this.width, this.height);
    this.buf = this.imageData.data;
  }

  beginFrame(clear = true) {
    if (clear) this.buf.fill(0);
  }

  commit() {
    this.ctx.putImageData(this.imageData, 0, 0);
  }

  setPixel(x: number, y: number, color: RGBA) {
    x = Math.round(x);
    y = Math.round(y);

    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;

    const i = this.idx(x, y);

    this.buf[i] = color.r;
    this.buf[i + 1] = color.g;
    this.buf[i + 2] = color.b;
    this.buf[i + 3] = color.a;
  }

  private blendPixel(
    x: number,
    y: number,
    color: RGBA,
    alphaFactor = 1
  ) {
    x = Math.round(x);
    y = Math.round(y);

    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;

    const i = this.idx(x, y);

    const srcA = (color.a / 255) * alphaFactor;
    const dstA = this.buf[i + 3] / 255;

    const outA = srcA + dstA * (1 - srcA);

    if (outA <= 0) return;

    const srcR = color.r / 255;
    const srcG = color.g / 255;
    const srcB = color.b / 255;

    const dstR = this.buf[i] / 255;
    const dstG = this.buf[i + 1] / 255;
    const dstB = this.buf[i + 2] / 255;

    const outR =
      (srcR * srcA + dstR * dstA * (1 - srcA)) / outA;
    const outG =
      (srcG * srcA + dstG * dstA * (1 - srcA)) / outA;
    const outB =
      (srcB * srcA + dstB * dstA * (1 - srcA)) / outA;

    this.buf[i] = clampByte(outR * 255);
    this.buf[i + 1] = clampByte(outG * 255);
    this.buf[i + 2] = clampByte(outB * 255);
    this.buf[i + 3] = clampByte(outA * 255);
  }

  drawLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: RGBA
  ) {
    if (this.lineAlg === "wu") {
      this.drawLineWu(x0, y0, x1, y1, color);
    } else {
      this.drawLineBrassenham(x0, y0, x1, y1, color);
    }
  }

  drawLineBrassenham(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: RGBA
  ) {
    x0 = Math.round(x0);
    y0 = Math.round(y0);
    x1 = Math.round(x1);
    y1 = Math.round(y1);

    let dx = Math.abs(x1 - x0);
    let dy = -Math.abs(y1 - y0);

    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;

    let err = dx + dy;
    while (true) {
      this.blendPixel(x0, y0, color);

      if (x0 === x1 && y0 === y1) break;

      const e2 = 2 * err;

      if (e2 >= dy) {
        err += dy;
        x0 += sx;
      }

      if (e2 <= dx) {
        err += dx;
        y0 += sy;
      }
    }
  }

  drawLineWu(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: RGBA
) {
  const ipart = (x: number) => Math.floor(x);
  const round = (x: number) => Math.round(x);
  const fpart = (x: number) => x - Math.floor(x);
  const rfpart = (x: number) => 1 - fpart(x);

  const plot = (x: number, y: number, a: number) => {
    this.blendPixel(x, y, color, a);
  };

  let steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);

  if (steep) {
    [x0, y0] = [y0, x0];
    [x1, y1] = [y1, x1];
  }

  if (x0 > x1) {
    [x0, x1] = [x1, x0];
    [y0, y1] = [y1, y0];
  }

  const dx = x1 - x0;
  const dy = y1 - y0;
  const gradient = dx === 0 ? 1 : dy / dx;

  let xend = round(x0);
  let yend = y0 + gradient * (xend - x0);
  let xgap = rfpart(x0 + 0.5);
  let xpxl1 = xend;
  let ypxl1 = ipart(yend);

  if (steep) {
    plot(ypxl1, xpxl1, rfpart(yend) * xgap);
    plot(ypxl1 + 1, xpxl1, fpart(yend) * xgap);
  } else {
    plot(xpxl1, ypxl1, rfpart(yend) * xgap);
    plot(xpxl1, ypxl1 + 1, fpart(yend) * xgap);
  }

  let intery = yend + gradient;

  xend = round(x1);
  yend = y1 + gradient * (xend - x1);
  xgap = fpart(x1 + 0.5);
  const xpxl2 = xend;
  const ypxl2 = ipart(yend);

  if (steep) {
    plot(ypxl2, xpxl2, rfpart(yend) * xgap);
    plot(ypxl2 + 1, xpxl2, fpart(yend) * xgap);
  } else {
    plot(xpxl2, ypxl2, rfpart(yend) * xgap);
    plot(xpxl2, ypxl2 + 1, fpart(yend) * xgap);
  }

  for (let x = xpxl1 + 1; x < xpxl2; x++) {
    if (steep) {
      plot(ipart(intery), x, rfpart(intery));
      plot(ipart(intery) + 1, x, fpart(intery));
    } else {
      plot(x, ipart(intery), rfpart(intery));
      plot(x, ipart(intery) + 1, fpart(intery));
    }

    intery += gradient;
  }
}

  private drawHSpan(
    y: number,
    x0: number,
    x1: number,
    color: RGBA
  ) {
    y = Math.round(y);
    if (y < 0 || y >= this.height) return;

    let start = Math.round(Math.min(x0, x1));
    let end = Math.round(Math.max(x0, x1));

    start = Math.max(0, start);
    end = Math.min(this.width - 1, end);

    for (let x = start; x <= end; x++) {
      this.blendPixel(x, y, color);
    }
  }

  fillCircle(
    cx: number,
    cy: number,
    radius: number,
    color: RGBA
  ) {
    const r = Math.round(radius);

    for (let y = -r; y <= r; y++) {
      const dx = Math.sqrt(r * r - y * y);
      this.drawHSpan(cy + y, cx - dx, cx + dx, color);
    }
  }

  fillPolygon(
    points: { x: number; y: number }[],
    color: RGBA
  ) {
    if (points.length < 3) return;

    let minY = Infinity;
    let maxY = -Infinity;

    for (const p of points) {
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    }

    for (let y = Math.floor(minY); y <= Math.ceil(maxY); y++) {
      const nodes: number[] = [];

      for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];

        if (
          (a.y < y && b.y >= y) ||
          (b.y < y && a.y >= y)
        ) {
          const x =
            a.x + ((y - a.y) / (b.y - a.y)) * (b.x - a.x);
          nodes.push(x);
        }
      }

      nodes.sort((a, b) => a - b);

      for (let i = 0; i < nodes.length; i += 2) {
        if (i + 1 < nodes.length) {
          this.drawHSpan(y, nodes[i], nodes[i + 1], color);
        }
      }
    }
  }

  strokeLine(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    color: RGBA,
    width = 1
  ) {
    const dx = x1 - x0;
    const dy = y1 - y0;

    const len = Math.sqrt(dx * dx + dy * dy);
    if (len === 0) return;

    const nx = -dy / len;
    const ny = dx / len;

    const h = width / 2;

    const poly = [
      { x: x0 + nx * h, y: y0 + ny * h },
      { x: x0 - nx * h, y: y0 - ny * h },
      { x: x1 - nx * h, y: y1 - ny * h },
      { x: x1 + nx * h, y: y1 + ny * h },
    ];

    this.fillPolygon(poly, color);
    this.fillCircle(x0, y0, h, color);
    this.fillCircle(x1, y1, h, color);
  }

  strokePolygon(
    points: { x: number; y: number }[],
    color: RGBA,
    width = 1
  ) {
    if (points.length < 2) return;

    for (let i = 0; i < points.length; i++) {
      const a = points[i];
      const b = points[(i + 1) % points.length];

      this.strokeLine(a.x, a.y, b.x, b.y, color, width);
    }
  }
}