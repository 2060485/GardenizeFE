import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import Settings from './Settings';
import SignIn from './SignIn';
import SignUp from './SignUp';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/Settings" element={<Settings/>} />
      <Route path="/SignIn" element={<SignIn/>} />
      <Route path="/SignUp" element={<SignUp/>} />
      <Route path="*" element={<NotFound/>} /> 
    </Routes>
  );
};

export default AppRoutes;
