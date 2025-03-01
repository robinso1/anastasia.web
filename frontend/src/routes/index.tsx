import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from '../pages/Login';
import Messages from '../pages/Messages';
import Tasks from '../pages/Tasks';
import Events from '../pages/Events';
import Projects from '../pages/Projects';
import Budget from '../pages/Budget';
import Contacts from '../pages/Contacts';
import { RootState } from '../store/types';

const AppRoutes: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/messages" element={<Messages />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/events" element={<Events />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/budget" element={<Budget />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/" element={<Navigate to="/tasks" replace />} />
      <Route path="*" element={<Navigate to="/tasks" replace />} />
    </Routes>
  );
};

export default AppRoutes; 