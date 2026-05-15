import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Oval extends Shape {
  public radiusX: number = 90;
  public radiusY: number = 60;

  constructor(id?: string) {
    super(id);
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
    const segments = 32;
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
    return (dx * dx + dy * dy) <= 1;
  }
}