// src/lib/projectStorage.ts
import { BaseDirectory, mkdir, writeTextFile, readTextFile, readDir } from '@tauri-apps/plugin-fs';

const PROJECTS_DIR = 'VectorEngine/projects';

export interface ProjectData {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  shapes: any[];
}

export async function saveProject(projectId: string, data: ProjectData): Promise<void> {
  try {
    console.log('Сохранение проекта:', projectId);
    console.log('Путь:', PROJECTS_DIR);
    
    await mkdir(PROJECTS_DIR, { 
      baseDir: BaseDirectory.Document,
      recursive: true 
    });
    
    const filePath = `${PROJECTS_DIR}/${projectId}.json`;
    await writeTextFile(filePath, JSON.stringify(data, null, 2), {
      baseDir: BaseDirectory.Document
    });
  } catch (error) {
    throw error;
  }
}

export async function loadProject(projectId: string): Promise<ProjectData | null> {
  try {
    console.log('Загрузка проекта:', projectId);
    
    const filePath = `${PROJECTS_DIR}/${projectId}.json`;
    const content = await readTextFile(filePath, {
      baseDir: BaseDirectory.Document
    });
    
    const data = JSON.parse(content);
    return data;
  } catch (error) {
    return null;
  }
}

export async function loadProjectIndex(): Promise<ProjectData[]> {
  try {
    console.log(' Загрузка списка проектов из:', PROJECTS_DIR);
    
    const files = await readDir(PROJECTS_DIR, {
      baseDir: BaseDirectory.Document
    });
    
    console.log('Найдено файлов:', files.length);
    
    const projects: ProjectData[] = [];
    
    for (const file of files) {
      if (file.isFile && file.name.endsWith('.json') && file.name !== 'index.json') {
        const projectId = file.name.replace('.json', '');
        
        const project = await loadProject(projectId);
        if (project) {
          projects.push(project);
        }
      }
    }
    
    return projects;
  } catch (error) {
    console.error('Ошибка загрузки списка проектов:', error);
    return [];
  }
}