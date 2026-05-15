import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Gallery from './screens/Gallery';
import Editor from './screens/Editor';
import RasterLab from './screens/RasterLab';
import RasterLab1 from './screens/RasterLab1';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen">
        <AnimatePresence mode="wait">
          <Routes>
            {/* Главная страница */}
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Gallery />
                </motion.div>
              }
            />

            {/* Редактор проектов */}
            <Route
              path="/editor/:id"
              element={
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.2 }}
                >
                  <Editor />
                </motion.div>
              }
            />

            {/* ЛР 4 — Растризатор */}
            <Route path="/raster" element={<RasterLab />} />

            {/* ЛР 5 — Система фигур */}
            <Route path="/shapes" element={<RasterLab1 />} />

          </Routes>
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}

export default App;