import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Bezier extends Shape {
  public x1: number = -90;
  public y1: number = 20;
  public x2: number = 0;
  public y2: number = -90;
  public x3: number = 90;
  public y3: number = 30;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 9;
  }

  getLocalBounds(): Bounds {
    return {
      minX: -110,
      minY: -110,
      maxX: 110,
      maxY: 50,
    };
  }

  draw(renderer: RasterRenderer): void {
    const segments = 40;
    const points: Point[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = (1 - t) * (1 - t) * this.x1 + 2 * (1 - t) * t * this.x2 + t * t * this.x3;
      const y = (1 - t) * (1 - t) * this.y1 + 2 * (1 - t) * t * this.y2 + t * t * this.y3;
      points.push(this.transformPointToWorld(x, y));
    }

    const color = {
      r: 30,
      g: 64,
      b: 175,
      a: Math.floor(this.strokeOpacity * 255)
    };

    renderer.strokePolygon(points, color, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX && local.x <= b.maxX &&
           local.y >= b.minY && local.y <= b.maxY;
  }
}
