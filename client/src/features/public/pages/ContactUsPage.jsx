import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useToast } from '../../../hooks/useToast.js';

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    topic: 'General Inquiry',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const { success, error: toastError } = useToast();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Please provide your full name.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = 'Please provide a valid work email.';
    }
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a message with at least 10 characters.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toastError('Please correct the errors in the form.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      success('Thank you! Your message has been sent to our customer operations team.');
    }, 800);
  };

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      topic: 'General Inquiry',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
  };

  const contactFaqs = [
    {
      q: 'How fast will our team receive a response?',
      a: 'Our standard customer operations team responds within 2 hours during normal business hours. For enterprise support plans, our critical priority SLA is under 15 minutes 24/7/365.',
    },
    {
      q: 'Can we schedule a live 1-on-1 enterprise demo?',
      a: 'Absolutely! Select "Enterprise Sales & Demo" in the contact form, and an enterprise solutions engineer will reach out with a calendar link to walk your leadership team through our platform.',
    },
    {
      q: 'Can EmployeeHub be deployed with our existing identity provider (SSO)?',
      a: 'Yes, enterprise tiers support SAML 2.0, Okta, Google Workspace, and Azure Active Directory single sign-on integrations.',
    },
    {
      q: 'How do we migrate our existing CSV employee records?',
      a: 'Our onboarding specialists offer complimentary data migration assistance to import existing staff rosters, department assignments, and historical logs safely.',
    },
  ];

  return (
    <div className="landing-page">
      {/* 1. HERO SECTION */}
      <section className="landing-hero" style={{ paddingBottom: '3.5rem' }}>
        <div className="landing-container">
          <div className="landing-badge" id="contact-badge">
            <Sparkles size={16} color="#818cf8" />
            <span>24/7 Enterprise Support</span>
          </div>

          <h1 className="landing-hero-title">
            We’d Love to <span>Hear From You</span>
          </h1>

          <p className="landing-hero-subtitle">
            Have questions about our employee management capabilities, need technical help, or want an enterprise demo?
            Our friendly team of specialists is standing by.
          </p>
        </div>
      </section>

      {/* 2. MAIN CONTACT SECTION: INFO + FORM */}
      <section className="landing-section" style={{ paddingTop: '0' }}>
        <div className="landing-container">
          <div className="contact-grid">
            {/* Left: Contact Info Cards */}
            <div className="contact-info-cards">
              <div className="contact-card">
                <div className="contact-card-icon">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="contact-card-title">Email Us Directly</h3>
                  <p className="contact-card-text">
                    For general questions or support assistance:
                    <br />
                    <strong style={{ color: '#818cf8' }}>support@employeehub.io</strong>
                  </p>
                  <p className="contact-card-text" style={{ marginTop: '0.4rem' }}>
                    For sales and enterprise contracts:
                    <br />
                    <strong style={{ color: '#a5b4fc' }}>sales@employeehub.io</strong>
                  </p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <Phone size={22} />
                </div>
                <div>
                  <h3 className="contact-card-title">Call Us</h3>
                  <p className="contact-card-text">
                    Toll-free (North America):
                    <br />
                    <strong style={{ color: '#ffffff' }}>+1 (800) 555-0199</strong>
                  </p>
                  <p className="contact-card-text" style={{ marginTop: '0.4rem' }}>
                    International Support line:
                    <br />
                    <strong style={{ color: '#ffffff' }}>+1 (415) 555-0142</strong>
                  </p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <MapPin size={22} />
                </div>
                <div>
                  <h3 className="contact-card-title">Global Headquarters</h3>
                  <p className="contact-card-text">
                    EmployeeHub Technologies Inc.
                    <br />
                    100 Market Street, Suite 400
                    <br />
                    San Francisco, CA 94105, USA
                  </p>
                </div>
              </div>

              <div className="contact-card">
                <div className="contact-card-icon">
                  <Clock size={22} />
                </div>
                <div>
                  <h3 className="contact-card-title">Operating Hours</h3>
                  <p className="contact-card-text">
                    Customer Success: Mon – Fri, 8:00 AM – 8:00 PM EST
                    <br />
                    Critical Operations SLA: 24/7/365 Worldwide
                  </p>
                </div>
              </div>

              {/* SLA Guarantee Box */}
              <div
                style={{
                  background: 'rgba(99, 102, 241, 0.1)',
                  border: '1px solid rgba(99, 102, 241, 0.25)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                }}
              >
                <ShieldCheck size={28} color="#818cf8" />
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                  <strong style={{ color: '#ffffff', display: 'block', marginBottom: '0.15rem' }}>
                    Enterprise SLA Guarantee
                  </strong>
                  Sub-15 minute response time for high-priority incidents and dedicated customer success manager.
                </div>
              </div>
            </div>

            {/* Right: Contact Form Card */}
            <div className="contact-form-card" id="contact-form-container">
              {isSubmitted ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                  <div
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: '#34d399',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
                    Message Received!
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', maxWidth: '420px', margin: '0 auto 1.75rem' }}>
                    Thank you, <strong>{formData.name}</strong>. A copy of your request has been routed to our team at{' '}
                    <strong style={{ color: '#a5b4fc' }}>{formData.email}</strong>. We typically respond within 2 hours.
                  </p>
                  <button type="button" onClick={handleReset} className="btn btn-secondary">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>
                      Send Us a Message
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Fill out the form below and an EmployeeHub specialist will get in touch shortly.
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Your Full Name <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Alex Rivera"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: `1px solid ${errors.name ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                      {errors.name && <span style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Work Email <span style={{ color: '#ef4444' }}>*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="alex@company.com"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: `1px solid ${errors.email ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                      {errors.email && <span style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. Acme Tech"
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          background: 'rgba(15, 23, 42, 0.6)',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                        Inquiry Topic
                      </label>
                      <select
                        name="topic"
                        value={formData.topic}
                        onChange={handleChange}
                        style={{
                          width: '100%',
                          padding: '0.7rem 0.9rem',
                          background: '#1e293b',
                          border: '1px solid rgba(255, 255, 255, 0.12)',
                          borderRadius: '8px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          outline: 'none',
                        }}
                      >
                        <option value="General Inquiry">General Questions</option>
                        <option value="Enterprise Sales">Enterprise Sales & Custom Quote</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Role Permissions">Role-Based Security Setup</option>
                        <option value="Partnership">Partnership & Integration</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                      How can we help? <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell us about your team size, workflow requirements, or questions..."
                      style={{
                        width: '100%',
                        padding: '0.75rem 0.9rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: `1px solid ${errors.message ? '#ef4444' : 'rgba(255, 255, 255, 0.12)'}`,
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                    {errors.message && (
                      <span style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.25rem', display: 'block' }}>
                        {errors.message}
                      </span>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary"
                    id="contact-submit-btn"
                    style={{
                      width: '100%',
                      padding: '0.85rem',
                      fontSize: '0.95rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    {isSubmitting ? (
                      <span>Sending Message...</span>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Submit Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREQUENTLY ASKED QUESTIONS */}
      <section className="landing-section" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
        <div className="landing-container">
          <div className="landing-section-header">
            <div className="landing-section-badge">Common Questions</div>
            <h2 className="landing-section-title">Support & Implementation FAQs</h2>
            <p className="landing-section-desc">
              Quick answers to frequently asked questions regarding setup, migration, and enterprise support.
            </p>
          </div>

          <div className="faq-container">
            {contactFaqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="faq-item">
                  <button
                    type="button"
                    className="faq-question"
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    {isOpen ? <ChevronUp size={20} color="#818cf8" /> : <ChevronDown size={20} color="#94a3b8" />}
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
