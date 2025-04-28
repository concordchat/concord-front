import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider';
import { GeneralProvider } from './contexts/GeneralProvider';
import { PrivateRoute } from './components/PrivateRoute';
import { Chat } from './components/Chat';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { Toaster } from 'react-hot-toast';
import { useGeneral } from './hooks/useGeneral';

function App() {
  return (
    <AuthProvider>
      <GeneralProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/chat"
              element={
                <PrivateRoute>
                  <Chat />
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/chat" replace />} />
          </Routes>
        </Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F1F23',
              color: '#E4E4E7',
              border: '1px solid #2A2A2F',
            },
            success: {
              iconTheme: {
                primary: '#34AB70',
                secondary: '#1F1F23',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#1F1F23',
              },
            },
          }}
        />
      </GeneralProvider>
    </AuthProvider>
  );
}

export default App;
