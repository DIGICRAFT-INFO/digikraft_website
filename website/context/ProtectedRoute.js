'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/utils/api';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [accessRevoked, setAccessRevoked] = useState(false);

  const verifyUser = async (isFirstLoad = false) => {
    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');

    if (!token) {
      router.push('/admin/login');
      return;
    }

    // ✅ On first load — show content immediately if token exists
    // This prevents "Verifying access..." from blocking the UI
    if (isFirstLoad) {
      setIsAuthorized(true);
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized');
      return;
    }

    // Background verify — updates role if changed, revokes if token is invalid
    try {
      const res = await API.get('/auth/verify');
      if (res.data && res.data.valid) {
        // ✅ Update role in localStorage if backend says different
        if (res.data.role && res.data.role !== role) {
          localStorage.setItem('role', res.data.role);
          // Reload to apply new role to sidebar
          window.location.reload();
          return;
        }
        // ✅ Update name if available
        if (res.data.name) {
          localStorage.setItem('userName', res.data.name);
        }
        setIsAuthorized(true);
      } else {
        // Backend says invalid — revoke
        handleAccessRevoked();
      }
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        // Token expired or invalid
        handleAccessRevoked();
      } else {
        // Network error / server down — keep session alive
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
    verifyUser(true); // first load — show content immediately
    const interval = setInterval(() => verifyUser(false), 30000); // background re-verify
    return () => clearInterval(interval);
  }, []);

  if (accessRevoked) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fef2f2',padding:'20px' }}>
        <div style={{ maxWidth:'440px',textAlign:'center',background:'#fff',borderRadius:'16px',padding:'40px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',border:'1px solid #fecaca' }}>
          <div style={{ fontSize:'48px',marginBottom:'16px' }}>🚫</div>
          <h2 style={{ fontSize:'22px',fontWeight:'800',color:'#991b1b',margin:'0 0 8px 0' }}>Access Revoked</h2>
          <p style={{ color:'#6b7280',fontSize:'14px',lineHeight:'1.6',marginBottom:'24px' }}>
            Your access has been revoked. Please contact the administrator.
          </p>
          <button onClick={()=>router.push('/admin/login')} style={{ background:'#dc2626',color:'#fff',border:'none',padding:'12px 24px',borderRadius:'8px',fontSize:'14px',fontWeight:'600',cursor:'pointer' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center' }}>
        <p style={{ color:'#6b7280',fontSize:'14px' }}>Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
