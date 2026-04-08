import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./components/views/LandingPage";
import DashboardView from "./components/views/DashboardView";
import PairingScreen from "./components/views/PairingScreen";
import LoginScreen from "./components/views/LoginScreen";
import { useAuth } from "./context/AuthContext";

// A wrapper for protected routes
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  
  if (!currentUser) {
    // Redirect to login if user isn't authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        {/* If logged in and they hit /login, bounce them to /pair */}
        <Route path="/login" element={currentUser ? <Navigate to="/pair" replace /> : <LoginScreen />} />
        
        {/* Protected Routes */}
        <Route 
          path="/pair" 
          element={
            <ProtectedRoute>
              <PairingScreen />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardView />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}