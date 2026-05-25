import { describe, test, expect } from 'vitest';
import { Line } from '../../shapes/Line';
import { Triangle } from '../../shapes/Triangle';
import { Bezier } from '../../shapes/Bezier';
import { CubicBezier } from '../../shapes/CubicBezier';
import { PathBezier } from '../../shapes/PathBezier';
import { Shape } from '../../core/Shape';

describe('Лабораторная №6 — Геометрические фигуры', () => {

  test('Все фигуры имеют обязательные методы', () => {
    const figures: Shape[] = [
      new Line(),
      new Triangle(),
      new Bezier(),
      new CubicBezier(),
      new PathBezier(),
    ];

    figures.forEach(shape => {
      expect(typeof shape.draw).toBe('function');
      expect(typeof shape.hitTest).toBe('function');
      expect(typeof shape.getLocalBounds).toBe('function');
      expect(typeof shape.getBounds).toBe('function');
      expect(typeof shape.toJSON).toBe('function');
    });
  });

  test('Triangle — hitTest и границы', () => {
    const triangle = new Triangle(-50, -50, 50, -50, 0, 70);
    triangle.transform.x = 400;
    triangle.transform.y = 300;
    expect(triangle.hitTest(400, 300)).toBe(true);
    expect(triangle.hitTest(400, 100)).toBe(false);
  });

  test('Bezier (Quadratic) — hitTest', () => {
    const bezier = new Bezier();
    bezier.transform.x = 600;
    bezier.transform.y = 300;
    expect(bezier.hitTest(600, 300)).toBe(true);
  });

  test('CubicBezier — hitTest', () => {
    const cubic = new CubicBezier();
    cubic.transform.x = 700;
    cubic.transform.y = 300;
    expect(cubic.hitTest(700, 300)).toBe(true);
  });

  test('PathBezier — hitTest', () => {
    const path = new PathBezier();
    path.transform.x = 800;
    path.transform.y = 300;
    expect(path.hitTest(800, 300)).toBe(true);
  });

  test('Line — hitTest', () => {
    const line = new Line();
    line.transform.x = 650;
    line.transform.y = 400;
    expect(line.hitTest(650, 400)).toBe(true);
  });

  test('toJSON — корректная сериализация', () => {
    const triangle = new Triangle();
    triangle.transform.x = 150;
    triangle.transform.y = 250;

    const json = triangle.toJSON();
    expect(json.type).toBe('Triangle');
    expect(json.transform.x).toBe(150);
    expect(json.transform.y).toBe(250);
    expect(json.x1).toBeDefined();
  });
});