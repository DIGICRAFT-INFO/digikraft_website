'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // LocalStorage se data read karna
    const token = localStorage.getItem('token'); 
    const role = localStorage.getItem('role'); 

    if (!token) {
      // Token nahi hai toh login pe redirect
      router.push('/login');
    } else if (allowedRoles && role && !allowedRoles.includes(role)) {
      // Role match nahi karta toh unauthorized page pe redirect
      router.push('/unauthorized');
    } else {
      // Access granted
      setIsAuthorized(true);
    }
  }, [router, allowedRoles]);

  // Jab tak check chal raha hai, loading state dikhayein
  if (!isAuthorized) {
    return <div className="p-10 text-center">Loading... verifying access...</div>;
  }

  return <>{children}</>;
}