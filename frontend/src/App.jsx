import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Timer from './pages/Timer';
import About from './pages/About';
import GoalSelection from './pages/GoalSelection';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/goal-selection" element={<GoalSelection />} />
          <Route path="/timer" element={<Timer />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
