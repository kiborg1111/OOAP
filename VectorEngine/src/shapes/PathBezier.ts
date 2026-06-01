import { Shape } from '../core/Shape';
import { Bounds, Point } from '../core/types';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

type PathMode = 'polyline' | 'bezier' | 'catmull';

export class PathBezier extends Shape {
  public points: Point[] = [];
  public mode: PathMode = 'polyline';
  public closed: boolean = false;

  constructor(id?: string) {
    super(id);
    this.strokeWidth = 7;
    this.points = [
      { x: -100, y: 0 },
      { x: -40, y: -70 },
      { x: 40, y: 60 },
      { x: 100, y: 0 }
    ];
  }

  addPoint(x: number, y: number) {
    this.points.push({ x, y });
  }

  private evalCatmullRom(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
    const t2 = t * t;
    const t3 = t2 * t;
    const x = 0.5 * ((2 * p1.x) + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3);
    const y = 0.5 * ((2 * p1.y) + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3);
    return { x, y };
  }

  private getFlattenedPoints(segmentsPerCurve = 25): Point[] {
    const result: Point[] = [];
    const n = this.points.length;

    if (n < 2) return [];

    if (this.mode === 'polyline') {
      return this.points.map(p => this.transformPointToWorld(p.x, p.y));
    }

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j <= segmentsPerCurve; j++) {
        const t = j / segmentsPerCurve;
        let p: Point;

        if (this.mode === 'catmull' && n >= 4) {
          const idx = (i - 1 + n) % n;
          p = this.evalCatmullRom(
            this.points[idx],
            this.points[i],
            this.points[(i + 1) % n],
            this.points[(i + 2) % n],
            t
          );
        } else {
          p = {
            x: (1 - t) * this.points[i].x + t * this.points[i + 1].x,
            y: (1 - t) * this.points[i].y + t * this.points[i + 1].y
          };
        }
        result.push(this.transformPointToWorld(p.x, p.y));
      }
    }

    if (this.closed && n > 2) {
      result.push(result[0]);
    }

    return result;
  }

  getLocalBounds(): Bounds {
    if (this.points.length === 0) return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    this.points.forEach(p => {
      minX = Math.min(minX, p.x);
      minY = Math.min(minY, p.y);
      maxX = Math.max(maxX, p.x);
      maxY = Math.max(maxY, p.y);
    });
    return { minX: minX - 20, minY: minY - 20, maxX: maxX + 20, maxY: maxY + 20 };
  }

  draw(renderer: RasterRenderer): void {
    const points = this.getFlattenedPoints(30);
    if (points.length < 2) return;

    const color = { r: 30, g: 64, b: 175, a: Math.floor(this.strokeOpacity * 255) };
    renderer.strokePolygon(points, color, this.strokeWidth);
  }

  hitTest(screenX: number, screenY: number): boolean {
    const local = this.transformPointToLocal(screenX, screenY);
    const b = this.getLocalBounds();
    return local.x >= b.minX && local.x <= b.maxX &&
           local.y >= b.minY && local.y <= b.maxY;
  }

  resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void {
    const newWidth = maxX - minX;
    const newHeight = maxY - minY;
    
    if (newWidth > 10 && newHeight > 10 && this.points.length > 0) {
      const currentBounds = this.getLocalBounds();
      const currentWidth = currentBounds.maxX - currentBounds.minX;
      const currentHeight = currentBounds.maxY - currentBounds.minY;
      
      const scaleX = newWidth / currentWidth;
      const scaleY = newHeight / currentHeight;
      
      this.points = this.points.map(p => ({
        x: p.x * scaleX,
        y: p.y * scaleY
      }));
      
      this.transform.x = (minX + maxX) / 2;
      this.transform.y = (minY + maxY) / 2;
    }
  }
}