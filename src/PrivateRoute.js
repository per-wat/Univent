import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthValue } from './AuthProvider';
import { firestore } from './firebase';
import { getDoc, doc } from 'firebase/firestore';

export function useRole() {
  const [role, setRole] = useState('');
  return [role, setRole];
}

export default function PrivateRoute({ children, requiredRole }) {
  const { currentUser } = useAuthValue();
  const [isUserRoleSet, setIsUserRoleSet] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useRole();

  function checkRole(role) {
    setIsUserRoleSet(true);
    setRole(role);

    if (requiredRole && role !== requiredRole) {
      alert('You are not authorized!')
      navigate('/');
    }
  }

  useEffect(() => {
    async function fetchUserData() {
      try {
        const user = await getDoc(doc(firestore, "users", currentUser.uid));
        const userData = user.data();
        checkRole(userData.role)
      } catch (error) {
        console.error(error);
      }
    }

    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser])

  useEffect(() => {
    if (!isUserRoleSet) {
      const timer = setTimeout(() => {
        // Redirect to login route
        console.log("time done");
        navigate('/');
      }, 1000);  // 1 seconds timeout

      return () => {
        clearTimeout(timer);
      }
    }
  }, [isUserRoleSet])

  return children;
}
