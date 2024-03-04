import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';


const privateRoute = ({ children, requiredUserGroup, opgroup }) => {
    const tokens = localStorage.getItem('tokens');
    const userGroup = JSON.parse(localStorage.getItem('user_data'));

    // Verifica si el token está presente y no está vacío
    const isAuthenticated = !!tokens;

    // Verifica si el usuario tiene el grupo necesario (si se proporciona)
    const hasRequiredGroup = requiredUserGroup ? userGroup.group === requiredUserGroup : true ;

    // Retorna children si está autenticado y tiene el grupo necesario, de lo contrario, redirecciona a /login
    return isAuthenticated && hasRequiredGroup ? children : <Navigate to='/login' />;
}

export default privateRoute;