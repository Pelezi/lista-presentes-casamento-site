import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import AuthRoutes from './routes/AuthRoutes';
import Archive from './pages/Archive';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/Login" element={<Login />} /> */}
          <Route path="/*" element={<AuthRoutes />} />
          {/* <Route path="/*" element={<Archive />} /> */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
};

export default App;
