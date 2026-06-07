
// import LogoTicker from '@/components/elements/LogoTicker'
// import Layout from "@/components/layout/Layout"
// import Link from 'next/link'
// export default function Register() {

//     return (
//         <>

//             <Layout headerStyle={1} footerStyle={1} >
//                 <div>
//                     <section className="section-box box-content-register">
//                         <div className="container">
//                             <div className="text-center contact-head"><span className="btn btn-brand-5">Sign Up</span>
//                                 <h2 className="heading-2 neutral-0 mb-20 mt-15">Registration</h2>
//                                 <div className="text-center">
//                                     <nav className="container-breadcrumb" style={{ bsBreadcrumbDivider: 'url("data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="8" height="8"%3E%3Cpath d="M2.5 0L1 1.5 3.5 4 1 6.5 2.5 8l4-4-4-4z" fill="currentColor"/%3E%3C/svg%3E")' }} aria-label="breadcrumb">
//                                         <ul className="breadcrumb">
//                                             <li className="breadcrumb-item"><Link href="#">Home</Link></li>
//                                             <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
//                                         </ul>
//                                     </nav>
//                                 </div>
//                             </div>
//                             <div className="row">
//                                 <div className="col-lg-1" />
//                                 <div className="col-lg-10">
//                                     <div className="row align-items-center">
//                                         <div className="col-lg-7 mb-40">
//                                             <div className="box-form-register">
//                                                 <h3 className="title-register">Create New Account</h3>
//                                                 <p className="text-md neutral-700">Already have an account?<Link className="brand-1-1" href="/login">Sign in</Link></p>
//                                                 <form className="form-register" action="#">
//                                                     <div className="form-group">
//                                                         <label>Your Name<span className="brand-1">*</span></label>
//                                                         <input className="form-control" type="text" placeholder="Name" />
//                                                     </div>
//                                                     <div className="form-group">
//                                                         <label>Your Email<span className="brand-1">*</span></label>
//                                                         <input className="form-control" type="text" placeholder="email@website.com" />
//                                                     </div>
//                                                     <div className="form-group">
//                                                         <label>Password *</label>
//                                                         <input className="form-control" type="password" />
//                                                     </div>
//                                                     <div className="form-group">
//                                                         <label>Confirm Password *</label>
//                                                         <input className="form-control" type="password" />
//                                                     </div>
//                                                     <div className="form-group-cb">
//                                                         <label className="text-md">
//                                                             <input className="cb-agree" type="checkbox" />I agree to terms  conditions
//                                                         </label>
//                                                     </div>
//                                                     <div className="form-group">
//                                                         <button className="btn btn-black btn-rounded">Sign Up
//                                                             <svg xmlns="http://www.w3.org/2000/svg" width={23} height={8} viewBox="0 0 23 8" fill="none">
//                                                                 <path d="M22.5 4.00032L18.9791 0.479492V3.3074H0.5V4.69333H18.9791V7.52129L22.5 4.00032Z" fill="true" />
//                                                             </svg>
//                                                         </button>
//                                                     </div>
//                                                     <div className="other-login">
//                                                         <p className="text-lg neutral-500">Or continue with</p>
//                                                         <div className="box-button-register"><Link className="btn btn-login" href="#"><img src="/assets/imgs/page/register/google.svg" alt="Nivia" /><span>Register with Google</span></Link><Link className="btn btn-login" href="#"><img src="/assets/imgs/page/register/twitter.svg" alt="Nivia" /></Link><Link className="btn btn-login" href="#"><img src="/assets/imgs/page/register/linkedin.svg" alt="Nivia" /></Link><Link className="btn btn-login" href="#"><img src="/assets/imgs/page/register/github.svg" alt="Nivia" /></Link></div>
//                                                     </div>
//                                                 </form>
//                                             </div>
//                                         </div>
//                                         <div className="col-lg-5 mb-40">
//                                             <div className="box-border-rounded">
//                                                 <div className="card-casestudy">
//                                                     <div className="card-title">
//                                                         <h6><span className="number">1</span>Signup for Service</h6>
//                                                     </div>
//                                                     <div className="card-desc">
//                                                         <p>This process is straightforward and swift, prioritizing your convenience and experience. It enables you to access tailored solutions and special offers swiftly, ensuring you can quickly begin enjoying our services.</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="box-border-rounded">
//                                                 <div className="card-casestudy">
//                                                     <div className="card-title">
//                                                         <h6><span className="number">2</span>Research  Development</h6>
//                                                     </div>
//                                                     <div className="card-desc">
//                                                         <p>We delve deeply into understanding your needs and objectives. We construct a customized strategy and solutions to ensure they reflect your goals and meet your expectations.</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="box-border-rounded">
//                                                 <div className="card-casestudy">
//                                                     <div className="card-title">
//                                                         <h6><span className="number">3</span>Sales  Earning</h6>
//                                                     </div>
//                                                     <div className="card-desc">
//                                                         <p>We monitor performance, optimize campaigns, and make certain that you attain the results you anticipate. This is the ultimate step to ensure you are well on your way to achieving success and revenue from your project.</p>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                     <section className="section-box box-need-help">
//                         <div className="container">
//                             <div className="box-list-prices">
//                                 <div className="text-center"> <Link className="btn btn-brand-4-sm" href="#">Faq's</Link>
//                                     <h2 className="mb-45 mt-15">Need Any Help ?<br className="d-none d-lg-block" /> Read Popular Questions</h2>
//                                 </div>
//                                 <div className="row">
//                                     <div className="col-md-6">
//                                         <div className="card-faq card-faq-black">
//                                             <div className="item-title">
//                                                 <h6>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
//                                                         <g clipPath="url(#clip0_51_1478)">
//                                                             <path d="M9 0C4.02571 0 0 4.02525 0 9C0 13.9742 4.02525 18 9 18C13.9743 18 18 13.9747 18 9C18 4.02571 13.9747 0 9 0ZM9 16.7442C4.72985 16.7442 1.25582 13.2702 1.25582 9C1.25582 4.72982 4.72985 1.25582 9 1.25582C13.2702 1.25582 16.7442 4.72982 16.7442 9C16.7442 13.2702 13.2702 16.7442 9 16.7442Z" fill="true" />
//                                                             <path d="M8.73434 11.3887C8.23677 11.3887 7.83398 11.8033 7.83398 12.3008C7.83398 12.7866 8.22492 13.2131 8.73434 13.2131C9.24375 13.2131 9.6465 12.7866 9.6465 12.3008C9.6465 11.8033 9.23187 11.3887 8.73434 11.3887Z" fill="true" />
//                                                             <path d="M8.8885 4.48047C7.28917 4.48047 6.55469 5.42825 6.55469 6.06795C6.55469 6.52997 6.94563 6.74323 7.26548 6.74323C7.90521 6.74323 7.6446 5.831 8.85296 5.831C9.44527 5.831 9.91918 6.09164 9.91918 6.6366C9.91918 7.2763 9.25574 7.64355 8.8648 7.97525C8.52122 8.27137 8.07108 8.75712 8.07108 9.77595C8.07108 10.392 8.23695 10.5697 8.72263 10.5697C9.3031 10.5697 9.42157 10.3091 9.42157 10.0839C9.42157 9.46791 9.43342 9.11252 10.085 8.6031C10.4049 8.35434 11.4118 7.54873 11.4118 6.43516C11.4118 5.32158 10.4049 4.48047 8.8885 4.48047Z" fill="true" />
//                                                         </g>
//                                                         <defs>
//                                                             <clipPath id="clip0_51_1478">
//                                                                 <rect width={18} height={18} fill="white" />
//                                                             </clipPath>
//                                                         </defs>
//                                                     </svg>How do I purchase an item?
//                                                 </h6>
//                                             </div>
//                                             <div className="item-info">
//                                                 <p className="text-md">With it profitable sure wrong continued in the queen's perhaps and simple fat denied adding worthy little use as some he so high down am week conduct esteems by cottage to pasture.</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <div className="col-md-6"> </div>
//                                         <div className="card-faq card-faq-black">
//                                             <div className="item-title">
//                                                 <h6>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
//                                                         <g clipPath="url(#clip0_51_1478)">
//                                                             <path d="M9 0C4.02571 0 0 4.02525 0 9C0 13.9742 4.02525 18 9 18C13.9743 18 18 13.9747 18 9C18 4.02571 13.9747 0 9 0ZM9 16.7442C4.72985 16.7442 1.25582 13.2702 1.25582 9C1.25582 4.72982 4.72985 1.25582 9 1.25582C13.2702 1.25582 16.7442 4.72982 16.7442 9C16.7442 13.2702 13.2702 16.7442 9 16.7442Z" fill="true" />
//                                                             <path d="M8.73434 11.3887C8.23677 11.3887 7.83398 11.8033 7.83398 12.3008C7.83398 12.7866 8.22492 13.2131 8.73434 13.2131C9.24375 13.2131 9.6465 12.7866 9.6465 12.3008C9.6465 11.8033 9.23187 11.3887 8.73434 11.3887Z" fill="true" />
//                                                             <path d="M8.8885 4.48047C7.28917 4.48047 6.55469 5.42825 6.55469 6.06795C6.55469 6.52997 6.94563 6.74323 7.26548 6.74323C7.90521 6.74323 7.6446 5.831 8.85296 5.831C9.44527 5.831 9.91918 6.09164 9.91918 6.6366C9.91918 7.2763 9.25574 7.64355 8.8648 7.97525C8.52122 8.27137 8.07108 8.75712 8.07108 9.77595C8.07108 10.392 8.23695 10.5697 8.72263 10.5697C9.3031 10.5697 9.42157 10.3091 9.42157 10.0839C9.42157 9.46791 9.43342 9.11252 10.085 8.6031C10.4049 8.35434 11.4118 7.54873 11.4118 6.43516C11.4118 5.32158 10.4049 4.48047 8.8885 4.48047Z" fill="true" />
//                                                         </g>
//                                                         <defs>
//                                                             <clipPath id="clip0_51_1478">
//                                                                 <rect width={18} height={18} fill="white" />
//                                                             </clipPath>
//                                                         </defs>
//                                                     </svg>Does Nivia share my information with others?
//                                                 </h6>
//                                             </div>
//                                             <div className="item-info">
//                                                 <p className="text-md"> Comfort reached gay perhaps chamber his six detract besides add. Moonlight newspaper. the queen's perhaps and simple fat denied adding worthy little use as some he so high</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <div className="col-md-6"> </div>
//                                         <div className="card-faq card-faq-black">
//                                             <div className="item-title">
//                                                 <h6>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
//                                                         <g clipPath="url(#clip0_51_1478)">
//                                                             <path d="M9 0C4.02571 0 0 4.02525 0 9C0 13.9742 4.02525 18 9 18C13.9743 18 18 13.9747 18 9C18 4.02571 13.9747 0 9 0ZM9 16.7442C4.72985 16.7442 1.25582 13.2702 1.25582 9C1.25582 4.72982 4.72985 1.25582 9 1.25582C13.2702 1.25582 16.7442 4.72982 16.7442 9C16.7442 13.2702 13.2702 16.7442 9 16.7442Z" fill="true" />
//                                                             <path d="M8.73434 11.3887C8.23677 11.3887 7.83398 11.8033 7.83398 12.3008C7.83398 12.7866 8.22492 13.2131 8.73434 13.2131C9.24375 13.2131 9.6465 12.7866 9.6465 12.3008C9.6465 11.8033 9.23187 11.3887 8.73434 11.3887Z" fill="true" />
//                                                             <path d="M8.8885 4.48047C7.28917 4.48047 6.55469 5.42825 6.55469 6.06795C6.55469 6.52997 6.94563 6.74323 7.26548 6.74323C7.90521 6.74323 7.6446 5.831 8.85296 5.831C9.44527 5.831 9.91918 6.09164 9.91918 6.6366C9.91918 7.2763 9.25574 7.64355 8.8648 7.97525C8.52122 8.27137 8.07108 8.75712 8.07108 9.77595C8.07108 10.392 8.23695 10.5697 8.72263 10.5697C9.3031 10.5697 9.42157 10.3091 9.42157 10.0839C9.42157 9.46791 9.43342 9.11252 10.085 8.6031C10.4049 8.35434 11.4118 7.54873 11.4118 6.43516C11.4118 5.32158 10.4049 4.48047 8.8885 4.48047Z" fill="true" />
//                                                         </g>
//                                                         <defs>
//                                                             <clipPath id="clip0_51_1478">
//                                                                 <rect width={18} height={18} fill="white" />
//                                                             </clipPath>
//                                                         </defs>
//                                                     </svg>How do I arrange a replacement item?
//                                                 </h6>
//                                             </div>
//                                             <div className="item-info">
//                                                 <p className="text-md">With it profitable sure wrong continued in the queen's perhaps and simple fat denied adding worthy little use as some he so high down am week conduct esteems by cottage to pasture.</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="col-md-6">
//                                         <div className="col-md-6"> </div>
//                                         <div className="card-faq card-faq-black">
//                                             <div className="item-title">
//                                                 <h6>
//                                                     <svg xmlns="http://www.w3.org/2000/svg" width={18} height={18} viewBox="0 0 18 18" fill="none">
//                                                         <g clipPath="url(#clip0_51_1478)">
//                                                             <path d="M9 0C4.02571 0 0 4.02525 0 9C0 13.9742 4.02525 18 9 18C13.9743 18 18 13.9747 18 9C18 4.02571 13.9747 0 9 0ZM9 16.7442C4.72985 16.7442 1.25582 13.2702 1.25582 9C1.25582 4.72982 4.72985 1.25582 9 1.25582C13.2702 1.25582 16.7442 4.72982 16.7442 9C16.7442 13.2702 13.2702 16.7442 9 16.7442Z" fill="true" />
//                                                             <path d="M8.73434 11.3887C8.23677 11.3887 7.83398 11.8033 7.83398 12.3008C7.83398 12.7866 8.22492 13.2131 8.73434 13.2131C9.24375 13.2131 9.6465 12.7866 9.6465 12.3008C9.6465 11.8033 9.23187 11.3887 8.73434 11.3887Z" fill="true" />
//                                                             <path d="M8.8885 4.48047C7.28917 4.48047 6.55469 5.42825 6.55469 6.06795C6.55469 6.52997 6.94563 6.74323 7.26548 6.74323C7.90521 6.74323 7.6446 5.831 8.85296 5.831C9.44527 5.831 9.91918 6.09164 9.91918 6.6366C9.91918 7.2763 9.25574 7.64355 8.8648 7.97525C8.52122 8.27137 8.07108 8.75712 8.07108 9.77595C8.07108 10.392 8.23695 10.5697 8.72263 10.5697C9.3031 10.5697 9.42157 10.3091 9.42157 10.0839C9.42157 9.46791 9.43342 9.11252 10.085 8.6031C10.4049 8.35434 11.4118 7.54873 11.4118 6.43516C11.4118 5.32158 10.4049 4.48047 8.8885 4.48047Z" fill="true" />
//                                                         </g>
//                                                         <defs>
//                                                             <clipPath id="clip0_51_1478">
//                                                                 <rect width={18} height={18} fill="white" />
//                                                             </clipPath>
//                                                         </defs>
//                                                     </svg>What kind of financial advice do you give?
//                                                 </h6>
//                                             </div>
//                                             <div className="item-info">
//                                                 <p className="text-md"> Comfort reached gay perhaps chamber his six detract besides add. Moonlight newspaper. the queen's perhaps and simple fat denied adding worthy little use as some he so high</p>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </section>
//                     <section className="section-box wow animate__animated animate__fadeIn box-logos-4">
//                         <div className="container">
//                             <div className="carouselTickerLogos2 carouselTicker_vertical" id="slide-logos">
//                                 <LogoTicker />
//                             </div>
//                         </div>
//                     </section>
//                 </div >

//             </Layout >
//         </>
//     )
// }