import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {RasterRenderer,LineAlg,} from "../lib/raster/RasterRenderer";

export default function RasterLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<RasterRenderer | null>(null);

  const [alg, setAlg] = useState<LineAlg>("bresenham");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new RasterRenderer(canvas);
    renderer.setLineAlgorithm(alg);

    rendererRef.current = renderer;

    let raf = 0;

    const frame = () => {
      renderer.beginFrame(true);

      const red = { r: 255, g: 0, b: 0, a: 180 };
      const blue = { r: 0, g: 100, b: 255, a: 255 };
      const green = { r: 0, g: 255, b: 0, a: 255 };
      const orange = { r: 255, g: 165, b: 0, a: 220 };
      const purple = { r: 160, g: 0, b: 255, a: 255 };

      renderer.fillPolygon(
        [
          { x: 520, y: 150 },
          { x: 700, y: 250 },
          { x: 650, y: 450 },
          { x: 450, y: 420 },
          { x: 380, y: 260 },
        ],
        blue
      );

      renderer.fillCircle(550, 300, 145, red);

      renderer.strokeLine(100, 500, 700, 600, green, 25);

      renderer.strokePolygon(
        [
          { x: 850, y: 150 },
          { x: 1050, y: 220 },
          { x: 980, y: 420 },
          { x: 820, y: 350 },
          { x: 780, y: 240 },
        ],
        orange,
        12
      );

      renderer.drawLine(50, 50, 500, 100, purple);

      renderer.commit();

      raf = requestAnimationFrame(frame);
    };

    frame();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
    };
  }, [alg]);

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
          onClick={() => window.history.back()}
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
            e.currentTarget.style.backgroundColor = "#2563eb";
            e.currentTarget.style.transform = "scale(1.02)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#3b82f6";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <ArrowLeft size={18} />
          Назад
        </button>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => setAlg("bresenham")}
            style={{
              backgroundColor: alg === "bresenham" ? "#3b82f6" : "#111111",
              color: "#ffffff",
              border: "1px solid #4a4a4a",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Bresenham
          </button>

          <button
            onClick={() => setAlg("wu")}
            style={{
              backgroundColor: alg === "wu" ? "#3b82f6" : "#111111",
              color: "#ffffff",
              border: "1px solid #4a4a4a",
              padding: "8px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Wu
          </button>
        </div>
      </header>

      <div style={{ flex: 1 }}>
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#0f172a",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}