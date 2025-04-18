import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import AuthRoutes from './routes/AuthRoutes';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/Login" element={<Login />} /> */}
          <Route path="/*" element={<AuthRoutes />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
};

export default App;
