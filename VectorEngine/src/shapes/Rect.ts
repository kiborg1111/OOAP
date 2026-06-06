import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Rect extends Shape {
  public width: number;
  public height: number;

  constructor(width = 160, height = 110, id?: string) {
    super(id);
    this.width = width;
    this.height = height;
    this.strokeWidth = 5;
  }

  getLocalBounds(): Bounds {
    return {
      minX: -this.width / 2,
      minY: -this.height / 2,
      maxX: this.width / 2,
      maxY: this.height / 2,
    };
  }

  draw(renderer: RasterRenderer): void {
    const points: Point[] = [
      this.transformPointToWorld(-this.width / 2, -this.height / 2),
      this.transformPointToWorld( this.width / 2, -this.height / 2),
      this.transformPointToWorld( this.width / 2,  this.height / 2),
      this.transformPointToWorld(-this.width / 2,  this.height / 2),
    ];

    const fillColor = { r: 59, g: 130, b: 246, a: Math.floor(this.fillOpacity * 255) };
    const strokeColor = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };

    renderer.fillPolygon(points, fillColor);
    if (this.strokeWidth > 0) {
      renderer.strokePolygon(points, strokeColor, this.strokeWidth);
    }
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const hw = this.width / 2;
    const hh = this.height / 2;
    return Math.abs(local.x) <= hw && Math.abs(local.y) <= hh;
  }

  resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const newWidth = maxX - minX;
    const newHeight = maxY - minY;
    
    if (newWidth > 10 && newHeight > 10) {
      this.width = newWidth;
      this.height = newHeight;
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
  }

  toJSON(): any {
  return {
    ...super.toJSON(),
    type: 'Rect',
    width: this.width,
    height: this.height,
  };
}
}