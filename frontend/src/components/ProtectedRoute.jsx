import {Navigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';

export default function ProtectedRoute({children, adminOnly=false}){
    const {user,loading} = useAuth();

    if(loading) return null;
    if(!user){
        return <Navigate to="/auth" />;
    }

    if(adminOnly && user.role !== 'ADMIN'){
        return <Navigate to="/" />;
    }
    return children;
}


