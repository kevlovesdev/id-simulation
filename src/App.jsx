import { HashRouter, Routes, Route } from 'react-router-dom';
import SimulationPage from './pages/SimulationPage';
import GuidePage from './pages/GuidePage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<SimulationPage />} />
        <Route path="/guide" element={<GuidePage />} />
      </Routes>
    </HashRouter>
  );
}
