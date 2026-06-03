import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ObjectDashboard } from '@/components/ObjectDashboard';
import { ObjectDetail } from '@/components/ObjectDetail';

export const App: React.FC = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<ObjectDashboard />} />
      <Route path="/object/:id" element={<ObjectDetail />} />
    </Routes>
  </BrowserRouter>
);

export default App;