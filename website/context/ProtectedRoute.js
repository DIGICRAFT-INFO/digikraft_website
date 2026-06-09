'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessRevoked, setAccessRevoked] = useState(false);

  const verifyUser = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
      router.push('/login');
      return;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized');
      return;
    }

    // Verify with backend that user still exists and is active
    try {
      const res = await API.get('/auth/verify');
      if (res.data && res.data.valid) {
        // Update role if changed by superadmin
        if (res.data.role && res.data.role !== role) {
          localStorage.setItem('role', res.data.role);
          window.location.reload();
          return;
        }
        setIsAuthorized(true);
      } else {
        // User deleted or invalid
        handleAccessRevoked();
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        handleAccessRevoked();
      } else {
        // Network error — allow access with local token (offline mode)
        setIsAuthorized(true);
      }
    }
  };

  const handleAccessRevoked = () => {
    setAccessRevoked(true);
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
  };

  useEffect(() => {
    verifyUser();

    // Re-verify every 30 seconds
    const interval = setInterval(verifyUser, 30000);
    return () => clearInterval(interval);
  }, []);

  if (accessRevoked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', padding: '20px' }}>
        <div style={{ maxWidth: '440px', textAlign: 'center', background: '#fff', borderRadius: '16px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', border: '1px solid #fecaca' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🚫</div>
          <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#991b1b', margin: '0 0 8px 0' }}>Access Revoked</h2>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
            Your access has been revoked by the Super Admin. Please contact the administrator to restore your access.
          </p>
          <button onClick={() => { router.push('/login'); }} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ color: '#6b7280' }}>Verifying access...</p></div>;
  }

  return <>{children}</>;
}
