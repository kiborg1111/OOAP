// src/shapes/Bezier.ts
import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Bezier extends Shape {
  public p0x: number = -80;
  public p0y: number = 0;
  public p1x: number = 0;
  public p1y: number = -90;
  public p2x: number = 80;
  public p2y: number = 0;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 7;
  }

  private evalLocal(t: number): Point {
    const x = (1 - t) * (1 - t) * this.p0x + 2 * (1 - t) * t * this.p1x + t * t * this.p2x;
    const y = (1 - t) * (1 - t) * this.p0y + 2 * (1 - t) * t * this.p1y + t * t * this.p2y;
    return { x, y };
  }

  getLocalBounds(): Bounds {
    return { minX: -100, minY: -110, maxX: 100, maxY: 30 };
  }

  draw(renderer: RasterRenderer): void {
    const segments = 40;
    const points: Point[] = [];

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      points.push(this.transformPointToWorld(this.evalLocal(t).x, this.evalLocal(t).y));
    }

    const color = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };
    renderer.strokePolygon(points, color, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX - 20 && local.x <= b.maxX + 20 &&
           local.y >= b.minY - 20 && local.y <= b.maxY + 20;
  }

  resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const newWidth = maxX - minX;
    const newHeight = maxY - minY;
    
    if (newWidth > 10 && newHeight > 10) {
      const currentBounds = this.getLocalBounds();
      const currentWidth = currentBounds.maxX - currentBounds.minX;
      const currentHeight = currentBounds.maxY - currentBounds.minY;
      
      const scaleX = newWidth / currentWidth;
      const scaleY = newHeight / currentHeight;
      
      this.p0x = this.p0x * scaleX;
      this.p0y = this.p0y * scaleY;
      this.p1x = this.p1x * scaleX;
      this.p1y = this.p1y * scaleY;
      this.p2x = this.p2x * scaleX;
      this.p2y = this.p2y * scaleY;
    
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
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