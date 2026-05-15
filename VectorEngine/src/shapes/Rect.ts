import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export class Rect extends Shape {
  public width: number;
  public height: number;

  constructor(width: number = 160, height: number = 100, id?: string) {
    super(id);
    this.width = width;
    this.height = height;
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
      { x: -this.width/2, y: -this.height/2 },
      { x: this.width/2, y: -this.height/2 },
      { x: this.width/2, y: this.height/2 },
      { x: -this.width/2, y: this.height/2 }
    ];

    const worldPoints = points.map(p => this.transformPointToWorld(p.x, p.y));

    const fill = { r: 59, g: 130, b: 246, a: Math.floor(this.fillOpacity * 255) };
    const stroke = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };

    renderer.fillPolygon(worldPoints, fill);
    if (this.strokeWidth > 0) {
      renderer.strokePolygon(worldPoints, stroke, this.strokeWidth);
    }
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX && local.x <= b.maxX && 
           local.y >= b.minY && local.y <= b.maxY;
  }
}