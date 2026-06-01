import { useEffect, useRef, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Square, Circle, Triangle, Save, Trash2 } from 'lucide-react'; 

import { RasterRenderer } from '../lib/raster/RasterRenderer';
import { Shape } from '../core/Shape';
import { InteractionManager } from '../utils/InteractionManager';

import { Rect } from '../shapes/Rect';
import { Oval } from '../shapes/Oval';
import { Triangle as TriangleShape } from '../shapes/Triangle';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<RasterRenderer | null>(null);
  const interactionRef = useRef<InteractionManager | null>(null);

  const shapesRef = useRef<Shape[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const saveAndGoHome = () => {
  };

  const addShape = (type: 'rect' | 'oval' | 'triangle') => {
    let newShape: Shape;
    const centerX = 600 + Math.random() * 200;
    const centerY = 350 + Math.random() * 150;

    switch (type) {
      case 'rect': 
        newShape = new Rect(160, 110); 
        break;
      case 'oval': 
        newShape = new Oval(85, 60); 
        break;
      case 'triangle': 
        newShape = new TriangleShape(); 
        break;
      default: 
        return;
    }

    newShape.transform.x = centerX;
    newShape.transform.y = centerY;
    newShape.fillStyle = '#3b82f6';
    newShape.fillOpacity = 0.8;
    newShape.strokeStyle = '#1e40af';
    newShape.strokeWidth = 3;
    newShape.strokeOpacity = 1;

    shapesRef.current.push(newShape);
    interactionRef.current?.setSelected(newShape);
    setSelectedShapeId(newShape.id);
    draw();
  };

  const deleteSelectedShape = () => {
    if (interactionRef.current?.deleteSelected()) {
      setSelectedShapeId(null);
      draw();
    }
  };

  const rotatePoint = (x: number, y: number, centerX: number, centerY: number, angleDeg: number) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const dx = x - centerX;
    const dy = y - centerY;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return {
      x: centerX + dx * cos - dy * sin,
      y: centerY + dx * sin + dy * cos
    };
  };

  const drawCircle = (renderer: RasterRenderer, cx: number, cy: number, radius: number, color: { r: number; g: number; b: number; a: number }) => {
    const segments = 24;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      points.push({ x, y });
    }
    renderer.fillPolygon(points, color);
  };

  const draw = useCallback(() => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    renderer.beginFrame(true);
    shapesRef.current.forEach(shape => shape.draw(renderer));

    const selected = interactionRef.current?.getSelected();
    if (selected) {
      setSelectedShapeId(selected.id);
      const bounds = selected.getBounds();
      const center = selected.getCenter();
      const rotation = selected.transform.rotation || 0;
      const pad = 15;

      const localCorners = [
        { x: bounds.minX - pad - center.x, y: bounds.minY - pad - center.y },
        { x: bounds.maxX + pad - center.x, y: bounds.minY - pad - center.y },
        { x: bounds.maxX + pad - center.x, y: bounds.maxY + pad - center.y },
        { x: bounds.minX - pad - center.x, y: bounds.maxY + pad - center.y },
      ];

      const rotatedCorners = localCorners.map(corner => 
        rotatePoint(corner.x + center.x, corner.y + center.y, center.x, center.y, rotation)
      );
      renderer.strokePolygon(rotatedCorners, { r: 204, g: 204, b: 206, a: 255 }, 3);

      rotatedCorners.forEach(handle => {
        drawCircle(renderer, handle.x, handle.y, 6.5, { r: 134, g: 136, b: 138, a: 255 });
      });

      const localRotateHandle = { x: 0, y: -(bounds.maxY - bounds.minY) / 2 - pad - 20 };
      const rotatedRotateHandle = rotatePoint(
        center.x + localRotateHandle.x, 
        center.y + localRotateHandle.y, 
        center.x, 
        center.y, 
        rotation
      );
      
      drawCircle(renderer, rotatedRotateHandle.x, rotatedRotateHandle.y, 8, { r: 34, g: 197, b: 94, a: 255 });
    } else {
      setSelectedShapeId(null);
    }

    renderer.commit();
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    interactionRef.current?.handleMouseDown(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    interactionRef.current?.handleMouseMove(x, y);
  };

  const handleMouseUp = () => {
    interactionRef.current?.handleMouseUp();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = 1200 * dpr;
    canvas.height = 780 * dpr;
    canvas.style.width = '1200px';
    canvas.style.height = '780px';

    rendererRef.current = new RasterRenderer(canvas);
    interactionRef.current = new InteractionManager(shapesRef.current, draw);

    draw();
  }, [draw]);

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: '#000000' 
    }}>
      <header style={{ 
        height: '56px', 
        borderBottom: '1px solid #4a4a4a', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 16px', 
        backgroundColor: '#000000' 
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#ffffff',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '14px',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2a2a2a';
            e.currentTarget.style.color = '#60a5fa';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <ArrowLeft size={20} />
          <span>Назад</span>
        </button>
        
        <div style={{ flex: 1, textAlign: 'center' }}>
          <span style={{ color: '#ffffff', fontWeight: '600' }}>
            Редактирование проекта {id === 'new' ? '(новый)' : `№${id}`}
          </span>
        </div>
        
        <div style={{ width: '80px' }}></div>
      </header>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <aside style={{ 
          width: '80px', 
          borderRight: '1px solid #4a4a4a', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: '24px 0', 
          gap: '16px', 
          backgroundColor: '#000000' 
        }}>
          <button
            onClick={() => addShape('rect')}
            style={{
              padding: '12px',
              backgroundColor: '#2a2a2a',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Square size={22} />
          </button>
          
          <button
            onClick={() => addShape('oval')}
            style={{
              padding: '12px',
              backgroundColor: '#2a2a2a',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Circle size={22} />
          </button>
          
          <button
            onClick={() => addShape('triangle')}
            style={{
              padding: '12px',
              backgroundColor: '#2a2a2a',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#2a2a2a';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Triangle size={22} />
          </button>
          
          <div style={{ width: '40px', height: '1px', backgroundColor: '#4a4a4a', margin: '8px 0' }}></div>
          
          <button
            onClick={saveAndGoHome}
            style={{
              padding: '12px',
              backgroundColor: '#22c55e',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: 'auto',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#16a34a';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#22c55e';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <Save size={22} />
          </button>
        </aside>

        <main style={{ 
          flex: 1, 
          backgroundColor: '#FFFFFF', 
          padding: '24px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{ 
            backgroundColor: '#FFFFFF', 
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            width: '100%', 
            height: '100%', 
            maxWidth: '1200px', 
            maxHeight: '85vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '2px solid #d1d5db',
            borderRadius: '2px'
          }}>
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ 
                width: '100%', 
                height: '100%', 
                cursor: 'default',
                borderRadius: '8px'
              }}
            />
          </div>
        </main>

        <aside style={{ 
          width: '288px', 
          borderLeft: '1px solid #4a4a4a', 
          padding: '20px', 
          backgroundColor: '#000000' 
        }}>
          <h3 style={{ 
            fontWeight: '600', 
            color: '#ffffff', 
            fontSize: '18px', 
            marginBottom: '20px', 
            paddingBottom: '8px', 
            borderBottom: '1px solid #4a4a4a' 
          }}>
            Свойства
          </h3>
          
          {selectedShapeId ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Цвет
                </label>
                <input 
                  type="color" 
                  style={{ width: '100%', height: '40px', borderRadius: '8px', backgroundColor: '#1f1f1f', border: '1px solid #4a4a4a', cursor: 'pointer' }}
                  defaultValue="#3b82f6"
                />
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Размер кисти
                </label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  style={{ width: '100%' }}
                  defaultValue="10"
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                  <span>1px</span>
                  <span>50px</span>
                  <span>100px</span>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '14px', color: '#9ca3af', display: 'block', marginBottom: '8px', fontWeight: '500' }}>
                  Непрозрачность
                </label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  style={{ width: '100%' }}
                  defaultValue="100"
                />
              </div>
              
              <button
                onClick={deleteSelectedShape}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '10px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s',
                  marginTop: '10px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#dc2626';
                  e.currentTarget.style.transform = 'scale(1.02)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ef4444';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Trash2 size={18} />
                Удалить фигуру
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              padding: '40px 20px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#9ca3af', marginBottom: '8px' }}>Фигура не выбрана</p>
              <p style={{ color: '#6b7280', fontSize: '12px' }}>Нажмите на фигуру, чтобы редактировать</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}