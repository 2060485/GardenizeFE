import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import Settings from './Settings';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PlantList from './PlantLeaderboard';
import PrivateRoute from './PrivateRoute';  


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/Settings" 
      element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        }
      />
      <Route path="/Plants" element={
        <PrivateRoute>
          <PlantList/>
        </PrivateRoute>
        } 
      />
      <Route path="/" element={<Home />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="*" element={<NotFound />} /> 
    </Routes>
  );
};

export default AppRoutes;
