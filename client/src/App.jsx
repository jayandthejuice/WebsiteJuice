// export default App;
import { Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import MainPage from './pages/MainPage';
import MyClasses from './pages/MyClasses';
import ManageClasses from './pages/ManageClasses'; // Import ManageClasses
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute

function App() {
  const { user } = useContext(AuthContext); // Access user from context

  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-classes"
        element={
          <ProtectedRoute>
            <MyClasses />
          </ProtectedRoute>
        }
      />
      <Route
  path="/manage-classes"
  element={
    <ProtectedRoute>
      {user?.role === 'admin' ? <ManageClasses /> : <Navigate to="/" />}
    </ProtectedRoute>
  }
/>
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
