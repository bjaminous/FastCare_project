import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Props custom styled-components à ne pas forwarder au DOM
const SC_CUSTOM_PROPS = new Set([
  'delay','bg','color','shadow','active','pct','up','danger',
  'activeBg','hoverColor','accent','fullWidth','center','border',
  'variant','selected','size','light','positive','gradient',
]);
const shouldForwardProp = (prop) => !SC_CUSTOM_PROPS.has(prop);
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
import Statistiques from './pages/Statistiques';
import Apprendre from './pages/Apprendre';
import Welcome from './pages/Welcome';

function App() {
  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
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
            <Route path="/welcome" element={
              <PrivateRoute><Welcome /></PrivateRoute>
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
            <Route path="/statistiques" element={
              <PrivateRoute><Statistiques /></PrivateRoute>
            } />
            <Route path="/apprendre" element={
              <PrivateRoute><Apprendre /></PrivateRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </FastingProvider>
      </AuthProvider>
    </ThemeProvider>
    </StyleSheetManager>
  );
}

export default App;
