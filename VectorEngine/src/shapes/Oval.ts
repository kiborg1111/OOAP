import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Oval extends Shape {
  public radiusX: number;
  public radiusY: number;

  constructor(radiusX = 80, radiusY = 60, id?: string) {
    super(id);
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.strokeWidth = 5;
  }

  getLocalBounds(): Bounds {
    return {
      minX: -this.radiusX,
      minY: -this.radiusY,
      maxX: this.radiusX,
      maxY: this.radiusY,
    };
  }

  draw(renderer: RasterRenderer): void {
    const segments = 40;
    const points: Point[] = [];

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * this.radiusX;
      const y = Math.sin(angle) * this.radiusY;
      points.push(this.transformPointToWorld(x, y));
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
    const dx = local.x / this.radiusX;
    const dy = local.y / this.radiusY;
    return (dx * dx + dy * dy) <= 1.05;
  }

  // Новый метод для изменения размера
  resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const newRadiusX = (maxX - minX) / 2;
    const newRadiusY = (maxY - minY) / 2;
    
    if (newRadiusX > 5 && newRadiusY > 5) { 
      this.radiusX = newRadiusX;
      this.radiusY = newRadiusY;
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
  }

  toJSON(): any {
    return {
      ...super.toJSON(),
      radiusX: this.radiusX,
      radiusY: this.radiusY,
    };
  }
}