import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class CubicBezier extends Shape {
  public p0x: number = -90;
  public p0y: number = 0;
  public p1x: number = -30;
  public p1y: number = -80;
  public p2x: number = 30;
  public p2y: number = 80;
  public p3x: number = 90;
  public p3y: number = 0;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 8;
  }

  private evalLocal(t: number): Point {
    const u = 1 - t;
    const x = u*u*u * this.p0x + 3*u*u*t * this.p1x + 3*u*t*t * this.p2x + t*t*t * this.p3x;
    const y = u*u*u * this.p0y + 3*u*u*t * this.p1y + 3*u*t*t * this.p2y + t*t*t * this.p3y;
    return { x, y };
  }

  getLocalBounds(): Bounds {
    return { minX: -110, minY: -100, maxX: 110, maxY: 90 };
  }

  draw(renderer: RasterRenderer): void {
    const segments = 50;
    const points: Point[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const p = this.evalLocal(t);
      points.push(this.transformPointToWorld(p.x, p.y));
    }

    const color = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };
    renderer.strokePolygon(points, color, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX - 25 && local.x <= b.maxX + 25 &&
           local.y >= b.minY - 25 && local.y <= b.maxY + 25;
  }
  toJSON(): any {
    return {
      ...super.toJSON(),
      p0x: this.p0x,
      p0y: this.p0y,
      p1x: this.p1x,
      p1y: this.p1y,
      p2x: this.p2x,
      p2y: this.p2y,
    };
  }
}