import { test, expect } from "vitest";
import { mat3, type Mat3, EPS } from "./mat3";

function expectMatCloseTo(actual: Mat3, expected: Mat3, eps = 1e-9) {
    for (let i = 0; i < 9; i++) {
        expect(actual[i]).toBeCloseTo(expected[i], Math.log10(1 / eps));
    }
}

function expectAffine(m: Mat3) {
    expect(m[6]).toBeCloseTo(0);
    expect(m[7]).toBeCloseTo(0);
    expect(m[8]).toBeCloseTo(1);
}

test("identity: full matrix", () => {
    const I = mat3.identity();
    const expected: Mat3 = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    expectMatCloseTo(I, expected);
    expectAffine(I);
});

test("multiply: identity with translate", () => {
    const I = mat3.identity();
    const T = mat3.translate(10, 5);
    const result = mat3.multiply(T, I);
    expect(result[2]).toBeCloseTo(10);
    expect(result[5]).toBeCloseTo(5);
});

test("translate: exact matrix and transformPoint", () => {
    const tx = 10, ty = -5;
    const T = mat3.translate(tx, ty);
    const expected: Mat3 = [1, 0, tx, 0, 1, ty, 0, 0, 1];
    expectMatCloseTo(T, expected);
    expectAffine(T);
    
    const p = mat3.transformPoint(T, 3, 4);
    expect(p.x).toBeCloseTo(3 + tx);
    expect(p.y).toBeCloseTo(4 + ty);
});

test("scale: exact matrix and point behavior", () => {
    const sx = 2, sy = 0.5;
    const S = mat3.scale(sx, sy);
    const expected: Mat3 = [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    expectMatCloseTo(S, expected);
    expectAffine(S);
    
    const p = mat3.transformPoint(S, 4, 6);
    expect(p.x).toBeCloseTo(4 * sx);
    expect(p.y).toBeCloseTo(6 * sy);
});

test("rotate: 0 rad = identity", () => {
    const r0 = mat3.rotate(0);
    expect(r0[0]).toBeCloseTo(1);
    expect(r0[4]).toBeCloseTo(1);
});

test("rotate: 90° transforms (1,0) to (0,1)", () => {
    const r90 = mat3.rotate(Math.PI / 2);
    const p = mat3.transformPoint(r90, 1, 0);
    expect(p.x).toBeCloseTo(0);
    expect(p.y).toBeCloseTo(1);
});

test("invert: translate matrix", () => {
    const T = mat3.translate(10, 20);
    const T_inv = mat3.invert(T);
    expect(T_inv).not.toBeNull();
    
    if (T_inv) {
        const identity = mat3.multiply(T, T_inv);
        expect(identity[0]).toBeCloseTo(1);
        expect(identity[4]).toBeCloseTo(1);
        expect(identity[8]).toBeCloseTo(1);
    }
});

test("invert: scale matrix", () => {
    const S = mat3.scale(2, 3);
    const S_inv = mat3.invert(S);
    expect(S_inv).not.toBeNull();
    
    if (S_inv) {
        const identity = mat3.multiply(S, S_inv);
        expect(identity[0]).toBeCloseTo(1);
        expect(identity[4]).toBeCloseTo(1);
    }
});

test("invert: degenerate matrix returns null", () => {
    expect(mat3.invert(mat3.scale(0, 1))).toBeNull();
    expect(mat3.invert(mat3.scale(1, 0))).toBeNull();
});

test("fromTransform: composition works", () => {
    const M = mat3.fromTransform(100, 50, Math.PI / 4, 2, 1);
    expectAffine(M);
    
    const p = mat3.transformPoint(M, 1, 0);
    // После масштаба: (2, 0)
    // После поворота 45°: (2*cos45, 2*sin45) ≈ (1.414, 1.414)
    // После перемещения: (101.414, 51.414)
    expect(p.x).toBeCloseTo(100 + 2 * Math.cos(Math.PI / 4));
    expect(p.y).toBeCloseTo(50 + 2 * Math.sin(Math.PI / 4));
});

test("transformPoint: direct calculation", () => {
    const M: Mat3 = [2, 0, 5, 0, 3, 7, 0, 0, 1];
    const p = mat3.transformPoint(M, 1, 1);
    expect(p.x).toBeCloseTo(7);
    expect(p.y).toBeCloseTo(10);
});