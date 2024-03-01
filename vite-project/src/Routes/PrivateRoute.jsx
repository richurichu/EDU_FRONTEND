import React from 'react';
import { Outlet , Navigate } from 'react-router-dom';
// import { isAuthenticated } from './authh';
import { isAuthenticated } from './NewAuth';
import { useDispatch ,useSelector} from 'react-redux'


const PrivateRoute = () => {
   
    console.log(isAuthenticated)
    if (isAuthenticated() ) {
      return <Outlet />;  // renders the child route component
    } else {
      return <Navigate to="/login" replace />;  // redirects to login
    }
  };

export default PrivateRoute;