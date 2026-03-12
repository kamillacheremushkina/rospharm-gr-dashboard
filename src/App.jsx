import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layout/AppLayout';
import OverviewPage from './pages/OverviewPage';
import GoalsPage from './pages/GoalsPage';
import RisksPage from './pages/RisksPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Редирект по умолчанию на вкладку Обзор */}
          <Route index element={<Navigate to="/overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="goals" element={<GoalsPage />} />
          <Route path="risks" element={<RisksPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;