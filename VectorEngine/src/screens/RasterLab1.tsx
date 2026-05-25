import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

import { Shape } from '../core/Shape';
import { getShapePoints, setShapePoint } from '../utils/shapeEditor';

import { Rect } from '../shapes/Rect';
import { Line } from '../shapes/Line';
import { Oval } from '../shapes/Oval';
import { Triangle } from '../shapes/Triangle';
import { Bezier } from '../shapes/Bezier';
import { CubicBezier } from '../shapes/CubicBezier';
import { PathBezier } from '../shapes/PathBezier';

export default function RasterLab1() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<RasterRenderer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const shapesRef = useRef<Shape[]>([
    new Rect(),
    new Oval(),
    new Line(),
    new Triangle(),
    new Bezier(),
    new CubicBezier(),
    new PathBezier(),
  ]);

  const draggingRef = useRef<{ shape: Shape; index: number } | null>(null);

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
  
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = new RasterRenderer(canvas);
    }
    
    draw();
  };

  useEffect(() => {
    const s = shapesRef.current;
    s[0].transform.x = 250; s[0].transform.y = 150; // Rect
    s[1].transform.x = 800; s[1].transform.y = 100; // Oval
    s[2].transform.x = 500; s[2].transform.y = 400; // Line
    s[3].transform.x = 250; s[3].transform.y = 600; // Triangle
    s[4].transform.x = 1000; s[4].transform.y = 400; // Bezier
    s[5].transform.x = 1400; s[5].transform.y = 150; // CubicBezier
    s[6].transform.x = 1400; s[6].transform.y = 600; // PathBezier
  }, []);

  const draw = () => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.beginFrame(true);
    shapesRef.current.forEach(s => s.draw(renderer));

    shapesRef.current.forEach(shape => {
      const pts = getShapePoints(shape);
      pts.forEach(p => {
        const wx = shape.transform.x + p.x;
        const wy = shape.transform.y + p.y;
        renderer.fillCircle(wx, wy, 11, { r: 255, g: 255, b: 0, a: 255 });
      });
    });

    renderer.commit();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const shapes = shapesRef.current;

    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      if (shape.hitTest(mx, my)) {
        const localX = mx - shape.transform.x;
        const localY = my - shape.transform.y;

        const points = getShapePoints(shape);

        for (let j = 0; j < points.length; j++) {
          const dx = points[j].x - localX;
          const dy = points[j].y - localY;
          if (dx * dx + dy * dy < 900) {
            draggingRef.current = { shape, index: j };
            return;
          }
        }
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const drag = draggingRef.current;
    if (!drag) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;

    const localX = mx - drag.shape.transform.x;
    const localY = my - drag.shape.transform.y;

    setShapePoint(drag.shape, drag.index, localX, localY);
    draw();
  };

  const handleMouseUp = () => {
    draggingRef.current = null;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new RasterRenderer(canvas);
    rendererRef.current = renderer;

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let rafId: number;
    const animate = () => {
      draw();
      rafId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resizeCanvas);
      renderer.dispose();
    };
  }, []);

  return (
  <div
    style={{
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#000000",
    }}
  >
    <header
      style={{
        height: "56px",
        borderBottom: "1px solid #4a4a4a",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <button
        onClick={() => navigate(-1)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <ArrowLeft size={18} />
        Назад
      </button>

      <button
        onClick={() => {
          const data = shapesRef.current.map(shape => shape.toJSON?.() || {});
          console.log("📤 JSON всех фигур:");
          console.log(JSON.stringify(data, null, 2));

          const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'lab6_figures.json';
          a.click();
          URL.revokeObjectURL(url);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: '#22c55e',
          color: '#ffffff',
          border: 'none',
          padding: '8px 20px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#16a34a';
          e.currentTarget.style.transform = 'scale(1.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#22c55e';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Сохранить в JSON
      </button>
    </header>

    <div 
      ref={containerRef}
      style={{ 
        flex: 1, 
        position: 'relative',
        backgroundColor: '#0a0f1c'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          backgroundColor: '#0f172a',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  </div>
);
}