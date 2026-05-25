import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Oval extends Shape {
  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;

  constructor(x1: number = -80, y1: number = -60, x2: number = 80, y2: number = 60, id?: string) {
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.strokeWidth = 5;
  }

  get radiusX(): number {
    return Math.abs(this.x2 - this.x1) / 2;
  }

  get radiusY(): number {
    return Math.abs(this.y2 - this.y1) / 2;
  }

  get centerX(): number {
    return (this.x1 + this.x2) / 2;
  }

  get centerY(): number {
    return (this.y1 + this.y2) / 2;
  }

  getLocalBounds(): Bounds {
    return {
      minX: this.x1,
      minY: this.y1,
      maxX: this.x2,
      maxY: this.y2,
    };
  }

  draw(renderer: RasterRenderer): void {
    const segments = 32;
    const points: Point[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = this.centerX + Math.cos(angle) * this.radiusX;
      const y = this.centerY + Math.sin(angle) * this.radiusY;
      const worldPoint = this.transformPointToWorld(x, y);
      points.push(worldPoint);
    }

    const fillColor = { r: 59, g: 130, b: 246, a: Math.floor(this.fillOpacity * 255) };
    const strokeColor = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };

    renderer.fillPolygon(points, fillColor);
    if (this.strokeWidth > 0) {
      renderer.strokePolygon(points, strokeColor, this.strokeWidth);
    }
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const dx = (local.x - this.centerX) / this.radiusX;
    const dy = (local.y - this.centerY) / this.radiusY;
    return (dx * dx + dy * dy) <= 1;
  }
  toJSON(): any {
    return {
      ...super.toJSON(),
      x1: this.x1,
      y1: this.y1,
      x2: this.x2,
      y2: this.y2,
    };
  }
}