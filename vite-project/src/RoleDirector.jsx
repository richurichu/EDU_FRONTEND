import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom'
import { useSelector} from 'react-redux'

function RoleDirector() {
    const currentRole = useSelector(state => state.roles.currentRole);
  const navigate = useNavigate();
  


  useEffect(() => {
    if (currentRole === "TEACHER") {
        navigate("/faculty-course-manage");
    } else if (currentRole === "ADMIN") {
        navigate("/admin-dash");  
    } else {
        navigate("/");  
    }
  }, [currentRole]);





  return null
}

export default RoleDirector