import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Digikraft Social',
  description: 'Understand how Digikraft Social safeguards, processes, and protects your corporate data and personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="position-relative overflow-hidden pt-100 pb-100" style={{ background: '#0b0f19', color: '#f3f4f6' }}>
      {/* Background Ambient Glows */}
      <div className="position-absolute top-0 start-0 translate-middle rounded-circle" style={{ width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(163,230,53,0.08) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div className="position-absolute bottom-0 end-0 translate-middle-y rounded-circle" style={{ width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(163,230,53,0.04) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div className="container position-relative z-index-1">
        {/* Back Navigation & Breadcrumb */}
        <div className="mb-40 d-flex align-items-center justify-content-between flex-wrap gap-3">
          <Link href="/" className="d-inline-flex align-items-center text-decoration-none transition-all" style={{ color: '#a3e635', fontWeight: '500', gap: '8px' }}>
            <span style={{ transform: 'scale(1.2)', display: 'inline-block' }}>&larr;</span> Back to Home
          </Link>
          <span className="fs-14 text-uppercase tracking-wider" style={{ color: '#6b7280', letterSpacing: '2px' }}>
            Last Updated: June 2026
          </span>
        </div>

        {/* Hero Section */}
        <div className="row justify-content-center mb-60">
          <div className="col-lg-9 text-center">
            <h1 className="display-4 fw-bold mb-20 text-white" style={{ letterSpacing: '-1px' }}>
              Privacy & <span style={{ background: 'linear-gradient(to right, #a3e635, #4befc6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Data Governance</span>
            </h1>
            <p className="fs-18 max-w-700 mx-auto" style={{ color: '#9ca3af', lineHeight: '1.7' }}>
              At Digikraft Social, transparency is at the core of our digital innovations. Learn how we handle, process, and secure your institutional and personal assets.
            </p>
          </div>
        </div>

        {/* Policy Content Blocks */}
        <div className="row justify-content-center">
          <div className="col-lg-9">
            <div className="p-40 p-lg-50 rounded-4 border" style={{ backgroundColor: 'rgba(17, 24, 39, 0.7)', borderColor: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(16px)' }}>
              
              {/* Section 1 */}
              <div className="mb-40 transition-hover">
                <div className="d-flex align-items-center gap-3 mb-15">
                  <span className="fs-14 fw-bold px-12 py-6 rounded-3" style={{ background: 'rgba(163,230,53,0.1)', color: '#a3e635' }}>01</span>
                  <h3 className="h4 fw-semibold text-white m-0">Advanced Information Gathering</h3>
                </div>
                <p style={{ color: '#9ca3af', lineHeight: '1.8', textAlign: 'justify' }}>
                  We securely aggregate personal credentials—including names, corporate email endpoints, and transactional payloads—exclusively when voluntarily provisioned via our onboarding infrastructure, newsletter funnels, or diagnostic contact forms.
                </p>
              </div>

              {/* Section 2 */}
              <div className="mb-40">
                <div className="d-flex align-items-center gap-3 mb-15">
                  <span className="fs-14 fw-bold px-12 py-6 rounded-3" style={{ background: 'rgba(163,230,53,0.1)', color: '#a3e635' }}>02</span>
                  <h3 className="h4 fw-semibold text-white m-0">Strategic Data Utilization</h3>
                </div>
                <p style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                  Collected telemetry is exclusively utilized to architect hyper-personalized brand experiences, systematically upgrade our core digital deliverables, refine institutional client support workflows, and route critical campaign optimizations.
                </p>
              </div>

              {/* Section 3 */}
              <div className="mb-40">
                <div className="d-flex align-items-center gap-3 mb-15">
                  <span className="fs-14 fw-bold px-12 py-6 rounded-3" style={{ background: 'rgba(163,230,53,0.1)', color: '#a3e635' }}>03</span>
                  <h3 className="h4 fw-semibold text-white m-0">Enterprise-Grade Security Protocol</h3>
                </div>
                <p style={{ color: '#9ca3af', lineHeight: '1.8' }}>
                  Our network deploys end-to-end cryptographic layers and stringent multi-factor authorization safeguards to preserve the absolute confidentiality of your operations, mitigating threats of unauthorized database access or zero-day breaches.
                </p>
              </div>

              {/* Section 4 */}
              <div className="mb-0">
                <div className="d-flex align-items-center gap-3 mb-15">
                  <span className="fs-14 fw-bold px-12 py-6 rounded-3" style={{ background: 'rgba(163,230,53,0.1)', color: '#a3e635' }}>04</span>
                  <h3 className="h4 fw-semibold text-white m-0">Global Legal Directives & Inquiries</h3>
                </div>
                <p style={{ color: '#9ca3af', lineHeight: '1.8', marginBottom: '25px' }}>
                  For complex queries regarding this data manifest, or to execute right-to-be-forgotten directives under contemporary digital frameworks, please engage our compliance officers instantly.
                </p>
                <Link href="/contact" className="btn d-inline-flex align-items-center text-black fw-bold px-24 py-12 rounded-3 shadow transition-all" style={{ background: '#a3e635', border: 'none', gap: '8px' }}>
                  Contact Compliance Hub <span>&rarr;</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  );
}