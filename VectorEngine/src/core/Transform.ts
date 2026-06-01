export class Transform {
  public x: number = 0;
  public y: number = 0;
  public rotation: number = 0; // в градусах
  public scaleX: number = 1;
  public scaleY: number = 1;

  constructor(x?: number, y?: number, rotation?: number, scaleX?: number, scaleY?: number) {
    if (x !== undefined) this.x = x;
    if (y !== undefined) this.y = y;
    if (rotation !== undefined) this.rotation = rotation;
    if (scaleX !== undefined) this.scaleX = scaleX;
    if (scaleY !== undefined) this.scaleY = scaleY;
  }

  clone(): Transform {
    return new Transform(this.x, this.y, this.rotation, this.scaleX, this.scaleY);
  }
}