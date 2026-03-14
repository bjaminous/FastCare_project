import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import { AuthProvider } from './context/AuthContext';
import { FastingProvider } from './context/FastingContext';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Timer from './pages/Timer';
import About from './pages/About';
import GoalSelection from './pages/GoalSelection';
import MonEspace from './pages/MonEspace';
import GoalDetail from './pages/GoalDetail';
import Dashboard from './pages/Dashboard';
import SuiviQuotidien from './pages/SuiviQuotidien';
import Journal from './pages/Journal';
import ConseilsSante from './pages/ConseilsSante';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <FastingProvider>
        <Router>
          <Routes>
            {/* Pages publiques */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages protégées */}
            <Route path="/dashboard" element={
              <PrivateRoute><Dashboard /></PrivateRoute>
            } />
            <Route path="/goal-selection" element={
              <PrivateRoute><GoalSelection /></PrivateRoute>
            } />
            <Route path="/timer" element={
              <PrivateRoute><Timer /></PrivateRoute>
            } />
            <Route path="/mon-espace" element={
              <PrivateRoute><MonEspace /></PrivateRoute>
            } />
            <Route path="/goal/:id" element={
              <PrivateRoute><GoalDetail /></PrivateRoute>
            } />
            <Route path="/suivi" element={
              <PrivateRoute><SuiviQuotidien /></PrivateRoute>
            } />
            <Route path="/journal" element={
              <PrivateRoute><Journal /></PrivateRoute>
            } />
            <Route path="/conseils" element={
              <PrivateRoute><ConseilsSante /></PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </FastingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
