import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import { Dashboard } from './components/dashboard/Dashboard';
import { ReflexDrill } from './components/drills/ReflexDrill/ReflexDrill';
import { KeyboardReflexDrill } from './components/drills/KeyboardReflexDrill/KeyboardReflexDrill';
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
          <Route path="/progress" element={<ProgressPage />} />
          {/* TODO: Add other drill routes */}
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </BrowserRouter></ThemeProvider>
      
    </GameProvider>
  );
}

export default App;
