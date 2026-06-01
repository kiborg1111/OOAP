import { Shape } from '../core/Shape';

export type InteractionMode = 'select' | 'move' | 'resize' | 'rotate';

export class InteractionManager {
  private selectedShape: Shape | null = null;
  private isDragging = false;
  private lastMousePos = { x: 0, y: 0 };
  private dragType: 'move' | 'resize' | 'rotate' = 'move';
  private resizeIndex = -1;
  private initialBounds: { minX: number; minY: number; maxX: number; maxY: number } | null = null;
  private initialMousePos = { x: 0, y: 0 };
  private initialRotation: number = 0;
  private initialCenter: { x: number; y: number } = { x: 0, y: 0 };

  constructor(
    private shapes: Shape[],
    private drawCallback: () => void
  ) {}

  setSelected(shape: Shape | null) {
    this.selectedShape = shape;
    this.drawCallback();
  }

  getSelected() {
    return this.selectedShape;
  }

  private rotatePoint(x: number, y: number, centerX: number, centerY: number, angleDeg: number) {
    const angleRad = (angleDeg * Math.PI) / 180;
    const dx = x - centerX;
    const dy = y - centerY;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  }

  handleMouseDown(x: number, y: number): boolean {
    this.isDragging = false;

    if (this.selectedShape) {
      const bounds = this.selectedShape.getBounds();
      const center = this.selectedShape.getCenter();
      const rotation = this.selectedShape.transform.rotation || 0;
      const pad = 15;

      const localCorners = [
        { x: bounds.minX - pad - center.x, y: bounds.minY - pad - center.y },
        { x: bounds.maxX + pad - center.x, y: bounds.minY - pad - center.y },
        { x: bounds.maxX + pad - center.x, y: bounds.maxY + pad - center.y },
        { x: bounds.minX - pad - center.x, y: bounds.maxY + pad - center.y },
      ];

      const rotatedCorners = localCorners.map(corner => 
        this.rotatePoint(corner.x + center.x, corner.y + center.y, center.x, center.y, rotation)
      );

      const handles = [
        { point: rotatedCorners[0], index: 0 }, // LT
        { point: rotatedCorners[1], index: 1 }, // RT
        { point: rotatedCorners[2], index: 2 }, // RB
        { point: rotatedCorners[3], index: 3 }, // LB
      ];

      for (const h of handles) {
        if (Math.hypot(x - h.point.x, y - h.point.y) < 20) {
          this.dragType = 'resize';
          this.resizeIndex = h.index;
          this.isDragging = true;
          this.lastMousePos = { x, y };
          this.initialMousePos = { x, y };
          this.initialBounds = { ...bounds };
          this.drawCallback();
          return true;
        }
      }

      const localRotateHandle = { x: 0, y: -(bounds.maxY - bounds.minY) / 2 - pad - 20 };
      const rotatedRotateHandle = this.rotatePoint(
        center.x + localRotateHandle.x,
        center.y + localRotateHandle.y,
        center.x,
        center.y,
        rotation
      );
      
      if (Math.hypot(x - rotatedRotateHandle.x, y - rotatedRotateHandle.y) < 15) {
        this.dragType = 'rotate';
        this.isDragging = true;
        this.lastMousePos = { x, y };
        this.initialMousePos = { x, y };
        this.initialRotation = this.selectedShape.transform.rotation || 0;
        this.initialCenter = { x: center.x, y: center.y };
        this.drawCallback();
        return true;
      }
    }

    for (let i = this.shapes.length - 1; i >= 0; i--) {
      if (this.shapes[i].hitTest(x, y)) {
        this.selectedShape = this.shapes[i];
        this.dragType = 'move';
        this.isDragging = true;
        this.lastMousePos = { x, y };
        this.drawCallback();
        return true;
      }
    }

    this.selectedShape = null;
    this.drawCallback();
    return false;
  }

  handleMouseMove(x: number, y: number) {
    if (!this.isDragging || !this.selectedShape) return;

    const dx = x - this.lastMousePos.x;
    const dy = y - this.lastMousePos.y;

    if (this.dragType === 'move') {
      this.selectedShape.move(dx, dy);
      this.lastMousePos = { x, y };
    } 
    else if (this.dragType === 'rotate' && this.initialCenter) {
      // Вычисляем угол поворота относительно центра фигуры
      const angle1 = Math.atan2(
        this.initialMousePos.y - this.initialCenter.y,
        this.initialMousePos.x - this.initialCenter.x
      );
      const angle2 = Math.atan2(
        y - this.initialCenter.y,
        x - this.initialCenter.x
      );
      let deltaAngle = (angle2 - angle1) * 180 / Math.PI;
      let newRotation = this.initialRotation + deltaAngle;
      
      newRotation = ((newRotation % 360) + 360) % 360;
      
      this.selectedShape.transform.rotation = newRotation;
    }
    else if (this.dragType === 'resize' && this.resizeIndex !== -1 && this.initialBounds) {
      const bounds = this.initialBounds;
      const center = this.selectedShape.getCenter();
      const rotation = this.selectedShape.transform.rotation || 0;
      
      // Переводим точку мыши в локальные координаты фигуры (без поворота)
      const localMouse = this.rotatePoint(x, y, center.x, center.y, -rotation);
      const initialLocalMouse = this.rotatePoint(this.initialMousePos.x, this.initialMousePos.y, center.x, center.y, -rotation);
      
      const deltaX = localMouse.x - initialLocalMouse.x;
      const deltaY = localMouse.y - initialLocalMouse.y;

      let newMinX = bounds.minX;
      let newMinY = bounds.minY;
      let newMaxX = bounds.maxX;
      let newMaxY = bounds.maxY;

      const minWidth = 30;
      const minHeight = 30;

      switch (this.resizeIndex) {
        case 0: // Left Top
          newMinX = Math.min(bounds.maxX - minWidth, bounds.minX + deltaX);
          newMinY = Math.min(bounds.maxY - minHeight, bounds.minY + deltaY);
          break;
        case 1: // Right Top
          newMaxX = Math.max(bounds.minX + minWidth, bounds.maxX + deltaX);
          newMinY = Math.min(bounds.maxY - minHeight, bounds.minY + deltaY);
          break;
        case 2: // Right Bottom
          newMaxX = Math.max(bounds.minX + minWidth, bounds.maxX + deltaX);
          newMaxY = Math.max(bounds.minY + minHeight, bounds.maxY + deltaY);
          break;
        case 3: // Left Bottom
          newMinX = Math.min(bounds.maxX - minWidth, bounds.minX + deltaX);
          newMaxY = Math.max(bounds.minY + minHeight, bounds.maxY + deltaY);
          break;
      }

      if (this.selectedShape.resizeFromBounds) {
        this.selectedShape.resizeFromBounds(newMinX, newMinY, newMaxX, newMaxY);
      }
    }

    this.drawCallback();
  }

  handleMouseUp() {
    this.isDragging = false;
    this.resizeIndex = -1;
    this.initialBounds = null;
  }

  deleteSelected(): boolean {
    if (!this.selectedShape) return false;
    const index = this.shapes.findIndex(s => s.id === this.selectedShape!.id);
    if (index !== -1) {
      this.shapes.splice(index, 1);
      this.selectedShape = null;
      this.drawCallback();
      return true;
    }
    return false;
  }
}