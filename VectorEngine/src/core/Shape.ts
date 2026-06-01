import { Transform } from './Transform';
import { Bounds, Point } from './types';
import { mat3 } from '../lib/math/mat3';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

export abstract class Shape {
  public id: string;
  public transform: Transform = new Transform();

  public fillStyle: string = "#3b82f6";
  public fillOpacity: number = 1;
  public strokeStyle: string = "#1e40af";
  public strokeWidth: number = 3;
  public strokeOpacity: number = 1;

  constructor(id?: string) {
    this.id = id || `shape_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  }

  abstract getLocalBounds(): Bounds;
  abstract draw(renderer: RasterRenderer): void;
  abstract hitTest(screenX: number, screenY: number): boolean;
  
  abstract resizeFromBounds(minX: number, minY: number, maxX: number, maxY: number): void;

  resizeFromDeviceAABB(minX: number, minY: number, maxX: number, maxY: number) {
    this.resizeFromBounds(minX, minY, maxX, maxY);
  }

  protected getLocalToWorldMatrix() {
    const { x, y, rotation, scaleX, scaleY } = this.transform;
    const rotationRad = (rotation * Math.PI) / 180;
    return mat3.fromTransform(x, y, rotationRad, scaleX, scaleY);
  }

  protected getWorldToLocalMatrix() {
    const m = this.getLocalToWorldMatrix();
    return mat3.invert(m) || mat3.identity();
  }

  protected transformPointToWorld(x: number, y: number): Point {
    const m = this.getLocalToWorldMatrix();
    return mat3.transformPoint(m, x, y);
  }

  protected transformPointToLocal(screenX: number, screenY: number): Point {
    const m = this.getWorldToLocalMatrix();
    return mat3.transformPoint(m, screenX, screenY);
  }

  public getLocalPoint(screenX: number, screenY: number): Point {
    return this.transformPointToLocal(screenX, screenY);
  }

  public getWorldPoint(localX: number, localY: number): Point {
    return this.transformPointToWorld(localX, localY);
  }

  getBounds(): Bounds {
    const local = this.getLocalBounds();
    const cx = this.transform.x;
    const cy = this.transform.y;

    return {
      minX: cx + local.minX,
      minY: cy + local.minY,
      maxX: cx + local.maxX,
      maxY: cy + local.maxY,
    };
  }

  getCenter(): Point {
    const bounds = this.getBounds();
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2
    };
  }

  move(dx: number, dy: number) {
    this.transform.x += dx;
    this.transform.y += dy;
  }

  clone(): this {
    const cloned = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(cloned, this);
    cloned.transform = this.transform.clone();
    cloned.id = `clone_${this.id}`;
    return cloned;
  }
  
  // Сериализация фигуры в JSON
  toJSON(): any {
    return {
      type: this.constructor.name,
      id: this.id,
      transform: {
        x: this.transform.x,
        y: this.transform.y,
        rotation: this.transform.rotation ?? 0,
        scaleX: this.transform.scaleX ?? 1,
        scaleY: this.transform.scaleY ?? 1,
      },
      fillStyle: this.fillStyle,
      fillOpacity: this.fillOpacity,
      strokeStyle: this.strokeStyle,
      strokeWidth: this.strokeWidth,
      strokeOpacity: this.strokeOpacity,
    };
  }
}