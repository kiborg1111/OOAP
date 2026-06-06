// src/screens/Gallery.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, FolderOpen, LayoutGrid, Clock, Shapes } from 'lucide-react';
import { loadProjectIndex, ProjectData } from '../lib/projectStorage';

export default function Gallery() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const projectList = await loadProjectIndex();
      console.log('Загружено проектов:', projectList.length);
      setProjects(projectList);
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const createNewProject = () => {
    navigate('/editor/new');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#000000',
    }}>
      <header style={{
        height: '56px',
        borderBottom: '1px solid #4a4a4a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        backgroundColor: '#000000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '600' }}>
            Лабораторная работа
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          <Link
            to="/raster"
            style={{ textDecoration: 'none' }}
          >
            <button
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
              <LayoutGrid size={18} />
              Растризатор
            </button>
          </Link>

          <Link
            to="/shapes"
            style={{ textDecoration: 'none' }}
          >
            <button
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
              <Shapes size={18} />
              Система фигур
            </button>
          </Link>

          <button
            onClick={createNewProject}
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
            <Plus size={18} />
            Создать проект
          </button>

        </div>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: '32px' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#ffffff', marginBottom: '8px' }}>
            Мои проекты
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Здесь хранятся все ваши работы. Нажмите на проект чтобы продолжить редактирование.
          </p>
        </div>

        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            color: '#9ca3af'
          }}>
            Загрузка проектов...
          </div>
        ) : projects.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '20px',
          }}>
            {projects.map((project) => (
              <Link to={`/editor/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
                <div
                  style={{
                    border: '1px solid #4a4a4a',
                    borderRadius: '12px',
                    backgroundColor: '#0a0a0a',
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0,0,0,0.5)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#4a4a4a';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    height: '160px',
                    backgroundColor: '#ffffff',
                    borderBottom: '1px solid #4a4a4a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundImage: 'radial-gradient(circle at 25% 40%, rgba(0,0,0,0.05) 2%, transparent 2.5%)',
                    backgroundSize: '24px 24px',
                  }}>
                    <FolderOpen size={48} color="#9ca3af" />
                  </div>
                  
                  <div style={{ padding: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
                      {project.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                      <Clock size={14} color="#6b7280" />
                      <span style={{ color: '#6b7280', fontSize: '12px' }}>{formatDate(project.updatedAt)}</span>
                    </div>
                    <div style={{
                      color: '#3b82f6',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}>
                      Открыть проект
                      <span style={{ fontSize: '14px' }}>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '64px',
            border: '2px dashed #4a4a4a',
            borderRadius: '12px',
            backgroundColor: '#0a0a0a',
          }}>
            <FolderOpen size={64} color="#4a4a4a" style={{ marginBottom: '16px' }} />
            <p style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '8px' }}>
              У вас пока нет проектов
            </p>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '24px' }}>
              Создайте первый проект чтобы начать работу
            </p>
            <button
              onClick={createNewProject}
              style={{
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: '8px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
            >
              Создать первый проект
            </button>
          </div>
        )}
      </div>
    </div>
  );
}