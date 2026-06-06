import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Triangle extends Shape {
  public x1: number;
  public y1: number;
  public x2: number;
  public y2: number;
  public x3: number;
  public y3: number;

  constructor(x1 = 70, y1 = 65, x2 = -70, y2 = 65, x3 = 0, y3 = -75, id?: string) {
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
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

  resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const newWidth = maxX - minX;
    const newHeight = maxY - minY;
  
    if (newWidth > 10 && newHeight > 10) {
      const currentBounds = this.getLocalBounds();
      const currentWidth = currentBounds.maxX - currentBounds.minX;
      const currentHeight = currentBounds.maxY - currentBounds.minY;
    
      const scaleX = newWidth / currentWidth;
      const scaleY = newHeight / currentHeight;
    
      this.x1 = this.x1 * scaleX;
      this.y1 = this.y1 * scaleY;
      this.x2 = this.x2 * scaleX;
      this.y2 = this.y2 * scaleY;
      this.x3 = this.x3 * scaleX;
      this.y3 = this.y3 * scaleY;
    
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
  }

toJSON(): any {
  return {
    ...super.toJSON(),
    type: 'Triangle',
    x1: this.x1,
    y1: this.y1,
    x2: this.x2,
    y2: this.y2,
    x3: this.x3,
    y3: this.y3,
  };
}
}