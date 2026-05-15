import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { RasterRenderer } from '../lib/raster/RasterRenderer';

import { Rect } from '../shapes/Rect';
import { Line } from '../shapes/Line';
import { Oval } from '../shapes/Oval';
import { Triangle } from '../shapes/Triangle';
import { Bezier } from '../shapes/Bezier';

export default function RasterLab1() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<RasterRenderer | null>(null);
  const animationRef = useRef<number | null>(null);

  const [shapes] = useState(() => {
    const rect = new Rect();
    rect.transform.x = 500;
    rect.transform.y = 300;

    const oval = new Oval();
    oval.transform.x = 850;
    oval.transform.y = 320;

    const line = new Line();
    line.transform.x = 650;
    line.transform.y = 520;
    line.strokeWidth = 14;

    const triangle = new Triangle();
    triangle.transform.x = 280;
    triangle.transform.y = 420;

    const bezier = new Bezier();
    bezier.transform.x = 950;
    bezier.transform.y = 420;
    bezier.strokeWidth = 8;

    return [rect, oval, line, triangle, bezier];
  });

  const draw = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.beginFrame(true);
    shapes.forEach(shape => shape.draw(renderer));
    renderer.commit();
  }, [shapes]);

  const animate = useCallback(() => {
    draw();
    animationRef.current = requestAnimationFrame(animate);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor((window.innerHeight - 60) * dpr);

    const renderer = new RasterRenderer(canvas);
    rendererRef.current = renderer;

    animate();

    const handleResize = () => draw();
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      renderer.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, draw]);

  return (
    <div className="w-full h-screen bg-black flex flex-col overflow-hidden">
      <header className="h-14 bg-black border-b border-gray-800 flex items-center px-6">
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
            margin: '8px 8px 8px',
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
      </header>

      <div className="flex-1 relative bg-[#0a0f1c]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{ background: '#ffff' }}
        />
      </div>
    </div>
  );
}