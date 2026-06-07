// "use client";

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import Layout from "@/components/layout/Layout";
// import Link from 'next/link';
// import API from "@/utils/api"; 

// export default function Register() {
//     const router = useRouter();
//     const [isMounted, setIsMounted] = useState(false);

//     // Form Input States
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [role, setRole] = useState('author'); 

//     // Request Pipeline Feedback States
//     const [loading, setLoading] = useState(false);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [successMessage, setSuccessMessage] = useState('');

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     if (!isMounted) {
//         return <div style={{ padding: '50px', textAlign: 'center' }}>Initializing Secure Gateway...</div>;
//     }

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setErrorMessage('');
//         setSuccessMessage('');

//         try {
//             const response = await API.post('/auth/register', { name, email, password, role });
            
//             if (response.data) {
//                 setSuccessMessage("Account requested successfully! It will be accessible once Super Admin approves it.");
                
//                 // Clear form
//                 setName('');
//                 setEmail('');
//                 setPassword('');
//                 setRole('author'); 
                
//                 // Redirect to login smoothly after 4 seconds
//                 setTimeout(() => {
//                     router.push('/admin/login'); 
//                 }, 4000);
//             }
//         } catch (err) {
//             console.error("Registration Exception:", err);
//             const extractedError = err.response?.data?.message || err.message || "Pipeline error during registration.";
//             setErrorMessage(extractedError);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <Layout headerStyle={1} footerStyle={1} headerCls="header-style-2 header-style-4">
//             <section className="section-box box-content-login">
//                 <div className="container">
//                     <div className="row align-items-center">
//                         <div className="col-lg-6">
//                             <div className="box-form-register">
//                                 <h3 className="title-register">Create an Account</h3>
//                                 <p className="text-md neutral-700">Join the platform. Note: Accounts require Super Admin approval before activation.</p>
                                
//                                 {errorMessage && (
//                                     <div className="alert alert-danger mt-3 mb-3" role="alert" style={{ borderRadius: '8px' }}>
//                                         {errorMessage}
//                                     </div>
//                                 )}
//                                 {successMessage && (
//                                     <div className="alert alert-success mt-3 mb-3" role="alert" style={{ borderRadius: '8px' }}>
//                                         {successMessage}
//                                     </div>
//                                 )}

//                                 <form className="form-register" onSubmit={handleSubmit}>
//                                     <div className="form-group">
//                                         <label>Full Name<span className="brand-1">*</span></label>
//                                         <input 
//                                             className="form-control" 
//                                             type="text" 
//                                             placeholder="John Doe" 
//                                             value={name}
//                                             onChange={(e) => setName(e.target.value)}
//                                             disabled={loading}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Your Email<span className="brand-1">*</span></label>
//                                         <input 
//                                             className="form-control" 
//                                             type="email" 
//                                             placeholder="email@website.com" 
//                                             value={email}
//                                             onChange={(e) => setEmail(e.target.value)}
//                                             disabled={loading}
//                                             required
//                                         />
//                                     </div>
//                                     <div className="form-group">
//                                         <label>Password<span className="brand-1">*</span></label>
//                                         <input 
//                                             className="form-control" 
//                                             type="password" 
//                                             placeholder="••••••••"
//                                             value={password}
//                                             onChange={(e) => setPassword(e.target.value)}
//                                             disabled={loading}
//                                             minLength="6"
//                                             required
//                                         />
//                                     </div>

//                                     <div className="form-group">
//                                         <label>Select Role<span className="brand-1">*</span></label>
//                                         <select 
//                                             className="form-control" 
//                                             value={role} 
//                                             onChange={(e) => setRole(e.target.value)}
//                                             disabled={loading}
//                                             style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef', height: '50px', borderRadius: '8px' }}
//                                             required
//                                         >
//                                             <option value="author">Author (Default)</option>
//                                             <option value="user">User</option>
//                                             <option value="admin">Admin</option>
//                                             <option value="superadmin">Super Admin</option>
//                                         </select>
//                                     </div>
                                    
//                                     <div className="form-group mt-4">
//                                         <button 
//                                             type="submit" 
//                                             className="btn btn-black btn-rounded" 
//                                             disabled={loading}
//                                             style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', width: '100%' }}
//                                         >
//                                             {loading ? "Submitting Request..." : "Sign Up"}
//                                             {!loading && (
//                                                 <svg xmlns="http://www.w3.org/2000/svg" width={23} height={8} viewBox="0 0 23 8" fill="none">
//                                                     <path d="M22.5 4.00032L18.9791 0.479492V3.3074H0.5V4.69333H18.9791V7.52129L22.5 4.00032Z" fill="currentColor" />
//                                                 </svg>
//                                             )}
//                                         </button>
//                                     </div>
//                                     <div className="other-login mt-45">
//                                         <p className="text-md neutral-500">
//                                             Already have an account? <Link className="brand-1-1" href="/admin/login">Login here</Link>
//                                         </p>
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//                         <div className="col-lg-6">
//                             <div className="box-image-banner-login">
//                                 <img src="/assets/imgs/page/login/banner.png" alt="Nivia" />
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </section>
//         </Layout>
//     );
// }