import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Square, Circle, Type, Save } from 'lucide-react';

export default function Editor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const goBack = () => navigate(-1);
  const saveAndGoHome = () => navigate('/', { replace: true });

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
          onClick={goBack}
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
          <button style={{
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
          }}>
            <Square size={22} />
          </button>
          
          <button style={{
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
          }}>
            <Circle size={22} />
          </button>
          
          <button style={{
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
          }}>
            <Type size={22} />
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
            borderRadius: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '18px', fontWeight: '500', marginBottom: '8px' }}>
                Холст для рисования
              </p>
              <p style={{ color: '#9ca3af', fontSize: '14px' }}>
                Нажмите и рисуйте
              </p>
            </div>
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
          </div>
        </aside>
      </div>
    </div>
  );
}