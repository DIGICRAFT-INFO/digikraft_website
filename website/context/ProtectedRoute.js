'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedRoute({ children, allowedRoles }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [accessRevoked, setAccessRevoked] = useState(false);

  useEffect(() => {
    setMounted(true);

    const token = localStorage.getItem('token');
    const role  = localStorage.getItem('role');

    // No token → redirect to login
    if (!token) {
      router.push('/admin/login');
      return;
    }

    // Role restriction check
    if (allowedRoles && role && !allowedRoles.includes(role)) {
      router.push('/unauthorized');
      return;
    }

    // ✅ Background verify — silently updates role if changed by superadmin
    // Does NOT block rendering — content shows immediately
    const verifyInBackground = async () => {
      try {
        const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.digikraftsocial.com';
        const res = await fetch(`${BASE}/api/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: AbortSignal.timeout(6000),
        });
        if (!res.ok) {
          // 401/403 = token invalid → revoke
          if (res.status === 401 || res.status === 403) {
            setAccessRevoked(true);
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');
          }
          // Other errors (network, 500) = keep session
          return;
        }
        const data = await res.json();
        if (data?.valid) {
          // Update role/name if changed
          if (data.role && data.role !== role) {
            localStorage.setItem('role', data.role);
          }
          if (data.name) {
            localStorage.setItem('userName', data.name);
          }
        }
      } catch {
        // Timeout/network error → keep session alive silently
      }
    };

    verifyInBackground();
    const interval = setInterval(verifyInBackground, 60000); // re-verify every 60s
    return () => clearInterval(interval);
  }, []);

  // Access revoked screen
  if (accessRevoked) {
    return (
      <div style={{ minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#fef2f2',padding:'20px' }}>
        <div style={{ maxWidth:'400px',textAlign:'center',background:'#fff',borderRadius:'16px',padding:'36px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',border:'1px solid #fecaca' }}>
          <div style={{ fontSize:'44px',marginBottom:'14px' }}>🚫</div>
          <h2 style={{ fontSize:'20px',fontWeight:'800',color:'#991b1b',margin:'0 0 8px' }}>Access Revoked</h2>
          <p style={{ color:'#6b7280',fontSize:'13px',lineHeight:'1.6',marginBottom:'20px' }}>
            Your session has been revoked. Please contact the administrator.
          </p>
          <button
            onClick={() => { router.push('/admin/login'); }}
            style={{ background:'#dc2626',color:'#fff',border:'none',padding:'10px 22px',borderRadius:'8px',fontSize:'13px',fontWeight:'600',cursor:'pointer' }}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ✅ Don't block! Show content if mounted (token check above will redirect if no token)
  if (!mounted) return null;

  return <>{children}</>;
}
