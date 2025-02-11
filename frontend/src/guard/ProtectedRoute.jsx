import { Navigate } from "react-router-dom";

export default function ProtectedRoute({children,allowedRoles=[]}) {
  const userRole = 'TEACHER';
  const authenticated = true;

  if(!authenticated) return <Navigate to={'/login'} />
  if(allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to={'/login'} /> 
  return children;
}