import { Shape } from '../core/Shape';
import { Point } from '../core/types';

import { Triangle } from '../shapes/Triangle';
import { Bezier } from '../shapes/Bezier';
import { CubicBezier } from '../shapes/CubicBezier';
import { Line } from '../shapes/Line';
import { PathBezier } from '../shapes/PathBezier';

export const getShapePoints = (shape: Shape): Point[] => {
  const s = shape as any;
  
  if (s instanceof Triangle) {
    return [
      { x: s.x1 ?? 0, y: s.y1 ?? 0 },
      { x: s.x2 ?? 0, y: s.y2 ?? 0 },
      { x: s.x3 ?? 0, y: s.y3 ?? 0 }
    ];
  }
  
  if (s instanceof Bezier) {
    return [
      { x: s.p0x ?? 0, y: s.p0y ?? 0 },
      { x: s.p1x ?? 0, y: s.p1y ?? 0 },
      { x: s.p2x ?? 0, y: s.p2y ?? 0 }
    ];
  }

  if (s instanceof CubicBezier) {
    return [
      { x: s.p0x ?? 0, y: s.p0y ?? 0 },
      { x: s.p1x ?? 0, y: s.p1y ?? 0 },
      { x: s.p2x ?? 0, y: s.p2y ?? 0 },
      { x: s.p3x ?? 0, y: s.p3y ?? 0 }
    ];
  }

  if (s instanceof Line) {
    return [
      { x: s.x1 ?? 0, y: s.y1 ?? 0 },
      { x: s.x2 ?? 0, y: s.y2 ?? 0 }
    ];
  }

  if (s instanceof PathBezier) {
    return s.points || [];
  }
  
  return [];
};

export const setShapePoint = (shape: Shape, index: number, localX: number, localY: number) => {
  const s = shape as any;
  console.log(`setShapePoint: ${shape.constructor.name}, точка ${index} → (${localX.toFixed(1)}, ${localY.toFixed(1)})`);

  if (s instanceof Triangle) {
    if (index === 0) { s.x1 = localX; s.y1 = localY; }
    if (index === 1) { s.x2 = localX; s.y2 = localY; }
    if (index === 2) { s.x3 = localX; s.y3 = localY; }
  }
  else if (s instanceof Bezier) {
    if (index === 0) { s.p0x = localX; s.p0y = localY; }
    if (index === 1) { s.p1x = localX; s.p1y = localY; }
    if (index === 2) { s.p2x = localX; s.p2y = localY; }
  }
  else if (s instanceof CubicBezier) {
    if (index === 0) { s.p0x = localX; s.p0y = localY; }
    if (index === 1) { s.p1x = localX; s.p1y = localY; }
    if (index === 2) { s.p2x = localX; s.p2y = localY; }
    if (index === 3) { s.p3x = localX; s.p3y = localY; }
  }
  else if (s instanceof Line) {
    if (index === 0) { s.x1 = localX; s.y1 = localY; }
    if (index === 1) { s.x2 = localX; s.y2 = localY; }
  }
  else if (s instanceof PathBezier) {
    if (s.points && index < s.points.length) {
      s.points[index] = { x: localX, y: localY };
    }
  }
  console.log(`После изменения: p0x=${s.p0x}, x1=${s.x1}`);
};