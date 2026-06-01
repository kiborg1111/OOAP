import { Shape } from '../core/Shape';
import { Bounds } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Line extends Shape {
  public x1: number = -80;
  public y1: number = 0;
  public x2: number = 80;
  public y2: number = 0;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 8;
  }

  getLocalBounds(): Bounds {
    return {
      minX: Math.min(this.x1, this.x2),
      minY: Math.min(this.y1, this.y2),
      maxX: Math.max(this.x1, this.x2),
      maxY: Math.max(this.y1, this.y2),
    };
  }

  draw(renderer: RasterRenderer): void {
    const start = this.transformPointToWorld(this.x1, this.y1);
    const end = this.transformPointToWorld(this.x2, this.y2);

    const color = {
      r: 30,
      g: 64,
      b: 175,
      a: Math.floor(this.strokeOpacity * 255)
    };

    renderer.strokeLine(start.x, start.y, end.x, end.y, color, this.strokeWidth);
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
    
    if (newWidth > 5 && newHeight > 5) {
      const currentBounds = this.getLocalBounds();
      const currentWidth = currentBounds.maxX - currentBounds.minX;
      const currentHeight = currentBounds.maxY - currentBounds.minY;
      
      const scaleX = newWidth / currentWidth;
      const scaleY = newHeight / currentHeight;
      
      this.x1 = this.x1 * scaleX;
      this.y1 = this.y1 * scaleY;
      this.x2 = this.x2 * scaleX;
      this.y2 = this.y2 * scaleY;
      
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
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