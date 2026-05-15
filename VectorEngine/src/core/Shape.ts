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

  getBounds(): Bounds {
    const local = this.getLocalBounds();
    const cx = this.transform.x;
    const cy = this.transform.y;
    return {
      minX: cx - 200,
      minY: cy - 200,
      maxX: cx + 200,
      maxY: cy + 200,
    };
  }

  getCenter(): Point {
    const bounds = this.getBounds();
    return {
      x: (bounds.minX + bounds.maxX) / 2,
      y: (bounds.minY + bounds.maxY) / 2
    };
  }

  resizeFromDeviceAABB(minX: number, minY: number, maxX: number, maxY: number) {
    this.transform.x = (minX + maxX) / 2;
    this.transform.y = (minY + maxY) / 2;
  }

  setBounds(minX: number, minY: number, maxX: number, maxY: number) {
    this.resizeFromDeviceAABB(minX, minY, maxX, maxY);
  }

  getLocalToDeviceMatrix() {
    return this.getLocalToWorldMatrix();
  }

  getDeviceToLocalMatrix() {
    return this.getWorldToLocalMatrix();
  }

  transformPointToDevice(px: number, py: number): Point {
    return this.transformPointToWorld(px, py);
  }

  clone(): this {
    const cloned = Object.create(Object.getPrototypeOf(this)) as this;
    Object.assign(cloned, this);
    cloned.transform = this.transform.clone();
    cloned.id = `clone_${this.id}`;
    return cloned;
  }
}