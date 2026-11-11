import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import { useToast } from '../../../components/common/Toast.jsx';

export default function ContactUsPage() {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.warning('Please fill out name, work email, and message.');
      return;
    }
    setSubmitted(true);
    toast.success('Inquiry sent! Our enterprise team will reach out shortly.');
    setForm({ name: '', email: '', company: '', message: '' });
  };

  return (
    <div className="landing-page">
      <section style={{ padding: '5rem 0 3.5rem', position: 'relative' }}>
        <div className="hero-glow" />
        <div className="website-container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '760px' }}>
          <div className="hero-eyebrow">
            <Sparkles size={13} />
            <span>ENTERPRISE SUPPORT &amp; SALES</span>
          </div>
          <h1 className="hero-title" style={{ marginBottom: '1.15rem' }}>
            Talk with our <em>workforce architects</em>.
          </h1>
          <p className="hero-subtitle">
            Have questions about multi-team rollouts, custom RBAC security, or dedicated MongoDB deployments? Send us a direct note.
          </p>
        </div>
      </section>

      <section style={{ padding: '1rem 0 6rem' }}>
        <div className="website-container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Direct Contact Channels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {[
                {
                  icon: Mail,
                  title: 'Enterprise Email',
                  detail: 'support@employeehub.app',
                  sub: 'Direct response within 4 business hours.',
                },
                {
                  icon: Phone,
                  title: 'Priority Hotline',
                  detail: '+1 (555) 294-8810',
                  sub: 'Mon–Fri, 08:00 AM to 07:00 PM PST.',
                },
                {
                  icon: MapPin,
                  title: 'Global HQ',
                  detail: '548 Market St, San Francisco, CA',
                  sub: 'Remote operations hubs worldwide.',
                },
                {
                  icon: Clock,
                  title: 'Cluster SLA',
                  detail: '99.98% Guaranteed Uptime',
                  sub: 'Real-time status alerts included.',
                },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div
                    key={card.title}
                    style={{
                      padding: '1.35rem 1.5rem',
                      borderRadius: '16px',
                      background: '#121314',
                      border: '1px solid rgba(255,255,255,0.09)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: 'rgba(198,244,50,0.12)',
                      border: '1px solid rgba(198,244,50,0.28)',
                      color: '#C6F432',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={19} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#71717A' }}>
                        {card.title}
                      </div>
                      <div style={{ fontSize: '1.02rem', fontWeight: 700, color: '#FFFFFF', marginTop: '0.15rem' }}>
                        {card.detail}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#A1A1AA', marginTop: '0.2rem' }}>
                        {card.sub}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="contact-card">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.45rem' }}>
                Send us a message
              </h2>
              <p style={{ fontSize: '0.88rem', color: '#A1A1AA', marginBottom: '1.75rem' }}>
                Share your team size and goals so we can tailor your onboarding.
              </p>

              {submitted ? (
                <div style={{
                  padding: '2.25rem 1.5rem',
                  borderRadius: '16px',
                  background: 'rgba(198,244,50,0.08)',
                  border: '1px solid rgba(198,244,50,0.32)',
                  textAlign: 'center',
                }}>
                  <CheckCircle2 size={42} style={{ color: '#C6F432', margin: '0 auto 0.85rem' }} />
                  <h3 style={{ color: '#FFFFFF', fontWeight: 700, marginBottom: '0.4rem' }}>Message Received</h3>
                  <p style={{ color: '#A1A1AA', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                    Thank you! An EmployeeHub onboarding specialist will reach out soon.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="btn btn-primary btn-sm"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name <span className="form-required">*</span></label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Alex Mercer"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Work Email <span className="form-required">*</span></label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="alex@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company / Organization</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Horizon Systems Inc."
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">How can we help? <span className="form-required">*</span></label>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      placeholder="Tell us about your team size, HR workflows, or security requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: '0.25rem' }}>
                    <Send size={16} />
                    Dispatch Inquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
