import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Rect extends Shape {
  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;
  public x3: number;
  public y3: number;
  public x4: number;
  public y4: number;

  constructor(x1 = -80, y1 = -60, x2 = 80, y3 = 60, id?: string) {
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y1; 
    this.x3 = x2;
    this.y3 = y3;
    this.x4 = x1;
    this.y4 = y3; 
    this.strokeWidth = 5;
  }

  getLocalBounds(): Bounds {
    return {
      minX: Math.min(this.x1, this.x2, this.x3, this.x4),
      minY: Math.min(this.y1, this.y2, this.y3, this.y4),
      maxX: Math.max(this.x1, this.x2, this.x3, this.x4),
      maxY: Math.max(this.y1, this.y2, this.y3, this.y4),
    };
  }

  draw(renderer: RasterRenderer): void {
    const p1 = this.transformPointToWorld(this.x1, this.y1);
    const p2 = this.transformPointToWorld(this.x2, this.y2);
    const p3 = this.transformPointToWorld(this.x3, this.y3);
    const p4 = this.transformPointToWorld(this.x4, this.y4);

    const points: Point[] = [p1, p2, p3, p4];

    const fillColor = {
      r: 59, g: 130, b: 246,
      a: Math.floor(this.fillOpacity * 255)
    };

    const strokeColor = {
      r: 30, g: 64, b: 175,
      a: Math.floor(this.strokeOpacity * 255)
    };

    renderer.fillPolygon(points, fillColor);
    renderer.strokePolygon(points, strokeColor, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();

    return local.x >= b.minX - 15 && local.x <= b.maxX + 15 &&
           local.y >= b.minY - 15 && local.y <= b.maxY + 15;
  }
  toJSON(): any {
    return {
      ...super.toJSON(),
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
      x3: this.x3,
      y3: this.y3,
      x4: this.x4,
      y4: this.y4,
    };
  }
}