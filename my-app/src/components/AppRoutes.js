import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './NotFound';
import Settings from './Settings';
import SignIn from './SignIn';
import SignUp from './SignUp';
import PlantList from './PlantLeaderboard';
import PrivateRoute from './PrivateRoute';
import UserManagement from './UserManagement';
import Forbidden from './Forbidden';
import YourPlants from './YourPlants';

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
      <Route path="/YourPlants"
        element={
          <PrivateRoute>
            <YourPlants />
          </PrivateRoute>
        }
      />
      <Route path="/Plants" element={
        <PrivateRoute adminOnly={true}>
          <PlantList />
        </PrivateRoute>
      } />
      <Route path="/Users" element={
        <PrivateRoute adminOnly={true}>
          <UserManagement />
        </PrivateRoute>
      } />
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="/" element={<Home />} />
      <Route path="/SignIn" element={<SignIn />} />
      <Route path="/SignUp" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
