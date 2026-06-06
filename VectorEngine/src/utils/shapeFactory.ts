// src/utils/shapeFactory.ts
import { Shape } from '../core/Shape';
import { Rect } from '../shapes/Rect';
import { Oval } from '../shapes/Oval';
import { Triangle } from '../shapes/Triangle';

export function shapeFromJSON(data: any): Shape | null {
  console.log('shapeFromJSON получил:', data);
  
  let shape: Shape | null = null;
  
  switch (data.type) {
    case 'Rect':
      shape = new Rect(data.width || 160, data.height || 110);
      break;
    case 'Oval':
      shape = new Oval(data.radiusX || 85, data.radiusY || 60);
      break;
    case 'Triangle':
      shape = new Triangle();
      if (data.x1 !== undefined) (shape as any).x1 = data.x1;
      if (data.y1 !== undefined) (shape as any).y1 = data.y1;
      if (data.x2 !== undefined) (shape as any).x2 = data.x2;
      if (data.y2 !== undefined) (shape as any).y2 = data.y2;
      if (data.x3 !== undefined) (shape as any).x3 = data.x3;
      if (data.y3 !== undefined) (shape as any).y3 = data.y3;
      break;
    default:
      console.warn('Неизвестный тип фигуры:', data.type);
      return null;
  }
  
  if (shape && data.transform) {
    shape.transform.x = data.transform.x;
    shape.transform.y = data.transform.y;
    shape.transform.rotation = data.transform.rotation || 0;
    shape.transform.scaleX = data.transform.scaleX || 1;
    shape.transform.scaleY = data.transform.scaleY || 1;
  }
  
  if (shape) {
    shape.fillStyle = data.fillStyle || '#3b82f6';
    shape.fillOpacity = data.fillOpacity ?? 0.8;
    shape.strokeStyle = data.strokeStyle || '#1e40af';
    shape.strokeWidth = data.strokeWidth ?? 3;
    shape.strokeOpacity = data.strokeOpacity ?? 1;
  }
  
  console.log('shapeFromJSON вернул:', shape);
  console.log('transform:', shape?.transform);
  
  return shape;
}