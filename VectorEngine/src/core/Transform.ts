export class Transform {
  constructor(
    public x: number = 0,
    public y: number = 0,
    public rotation: number = 0,
    public scaleX: number = 1,
    public scaleY: number = 1
  ) {}

  clone(): Transform {
    return new Transform(this.x, this.y, this.rotation, this.scaleX, this.scaleY);
  }
}