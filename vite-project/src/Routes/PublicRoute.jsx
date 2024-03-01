import React from 'react'
import { Outlet, Navigate } from 'react-router-dom';
// import { isAuthenticated } from './authh';
import { isAuthenticated } from './NewAuth';

function PublicRoute() {
    if (isAuthenticated()) {
        return <Navigate to="/" replace />; 
      } else {
        return <Outlet />; 
      }
}

export default PublicRoute