import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Triangle extends Shape {
  public x1: number = -70;
  public y1: number = -65;
  public x2: number = 70;
  public y2: number = -65;
  public x3: number = 0;
  public y3: number = 75;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 5;
  }

  getLocalBounds(): Bounds {
    return {
      minX: Math.min(this.x1, this.x2, this.x3),
      minY: Math.min(this.y1, this.y2, this.y3),
      maxX: Math.max(this.x1, this.x2, this.x3),
      maxY: Math.max(this.y1, this.y2, this.y3),
    };
  }

  draw(renderer: RasterRenderer): void {
    const p1 = this.transformPointToWorld(this.x1, this.y1);
    const p2 = this.transformPointToWorld(this.x2, this.y2);
    const p3 = this.transformPointToWorld(this.x3, this.y3);

    const points: Point[] = [p1, p2, p3];

    const fillColor = {
      r: 59,
      g: 130,
      b: 246,
      a: Math.floor(this.fillOpacity * 255)
    };

    const strokeColor = {
      r: 30,
      g: 64,
      b: 175,
      a: Math.floor(this.strokeOpacity * 255)
    };

    renderer.fillPolygon(points, fillColor);
    renderer.strokePolygon(points, strokeColor, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX - 20 && local.x <= b.maxX + 20 &&
           local.y >= b.minY - 20 && local.y <= b.maxY + 20;
  }
}