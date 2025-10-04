import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { ReflexDrill } from './components/drills/ReflexDrill/ReflexDrill';
import { KeyboardReflexDrill } from './components/drills/KeyboardReflexDrill/KeyboardReflexDrill';
import { AwarenessDrill } from './components/drills/AwarenessDrill/AwarenessDrill';
import { ImpulseDrill } from './components/drills/ImpulseDrill/ImpulseDrill';
import { FocusDrill } from './components/drills/FocusDrill/FocusDrill';
import { ProgressPage } from './components/progress/ProgressPage';
import { ThemeProvider } from './components/theme-provider';

function App() {
  return (
    <GameProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme"><BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/drill/reflex" element={<ReflexDrill />} />
          <Route path="/drill/keyboard-reflex" element={<KeyboardReflexDrill />} />
          <Route path="/drill/awareness" element={<AwarenessDrill />} />
          <Route path="/drill/impulse" element={<ImpulseDrill />} />
          <Route path="/drill/focus" element={<FocusDrill />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter></ThemeProvider>
      
    </GameProvider>
  );
}

export default App;
