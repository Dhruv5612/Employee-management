import React, { useState, useEffect } from 'react';
import { announcementApi } from '../services/announcementApi.js';
import Button from '../../../components/common/Button.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useOutletContext } from 'react-router-dom';
import {
  Megaphone,
  Bell,
  Pin,
  Plus,
  Search,
  Calendar,
  AlertCircle,
  Sparkles,
  Users,
  Trash2,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    category: 'Company News',
    priority: 'Normal',
    isPinned: false,
    targetAudience: 'All Employees',
    content: '',
  });

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await announcementApi.listAnnouncements({
        category: selectedCategory,
        q: searchQuery,
      });
      setAnnouncements(data || []);
    } catch (err) {
      console.error(err);
      toastError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchQuery]);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toastError('Please fill in title and content');
      return;
    }

    try {
      await announcementApi.createAnnouncement({
        ...formData,
        author: `${user?.name || 'Administrator'} (${user?.role || 'Admin'})`,
      });
      success('Announcement broadcasted to workforce!');
      setIsCreateModalOpen(false);
      setFormData({
        title: '',
        category: 'Company News',
        priority: 'Normal',
        isPinned: false,
        targetAudience: 'All Employees',
        content: '',
      });
      fetchData();
    } catch (err) {
      toastError('Failed to post announcement');
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await announcementApi.deleteAnnouncement(id);
      success('Announcement removed');
      fetchData();
    } catch (err) {
      toastError('Failed to delete announcement');
    }
  };

  const categories = ['All', 'Company News', 'Urgent Notice', 'Policy Update', 'Event & Celebration'];

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: '#ede9fe',
                color: '#6d28d9',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Megaphone size={14} /> Organization Broadcasts
            </span>
          </div>
          <h1 className="page-title">Company Announcements</h1>
          <p className="page-subtitle">
            Essential company bulletins, corporate notices, and policy updates visible to all staff
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {isAdminOrHR && (
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Post Announcement
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '9999px',
                border: selectedCategory === cat ? '1px solid #4f46e5' : '1px solid #cbd5e1',
                backgroundColor: selectedCategory === cat ? '#4f46e5' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#475569',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: 'relative', width: '260px' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
          />
          <input
            type="text"
            placeholder="Search bulletins..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 0.5rem 0.45rem 2.2rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      {/* Announcements List */}
      {loading ? (
        <div className="card" style={{ padding: '3rem' }}>
          <Loader message="Loading company announcements..." />
        </div>
      ) : announcements.length === 0 ? (
        <EmptyState
          title="No Announcements Found"
          description="There are currently no active announcements matching your selection."
          actionLabel={isAdminOrHR ? 'Publish First Notice' : undefined}
          onAction={isAdminOrHR ? () => setIsCreateModalOpen(true) : undefined}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {announcements.map((item) => (
            <div
              key={item._id}
              className="card"
              style={{
                padding: '1.5rem',
                borderLeft: item.isPinned
                  ? '4px solid #4f46e5'
                  : item.priority === 'High'
                  ? '4px solid #ef4444'
                  : '4px solid #e2e8f0',
                backgroundColor: item.isPinned ? '#faf5ff' : '#ffffff',
                position: 'relative',
              }}
            >
              {/* Top metadata tags */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {item.isPinned && (
                    <span
                      style={{
                        backgroundColor: '#4f46e5',
                        color: '#ffffff',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        fontSize: '0.725rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Pin size={11} /> PINNED NOTICE
                    </span>
                  )}

                  <span
                    style={{
                      backgroundColor:
                        item.category === 'Urgent Notice'
                          ? '#fee2e2'
                          : item.category === 'Policy Update'
                          ? '#fef3c7'
                          : '#e0e7ff',
                      color:
                        item.category === 'Urgent Notice'
                          ? '#991b1b'
                          : item.category === 'Policy Update'
                          ? '#b45309'
                          : '#4338ca',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                    }}
                  >
                    {item.category}
                  </span>

                  {item.priority === 'High' && (
                    <span
                      style={{
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                      }}
                    >
                      HIGH PRIORITY
                    </span>
                  )}

                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Audience: <strong>{item.targetAudience || 'All Employees'}</strong>
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      color: '#64748b',
                    }}
                  >
                    <Calendar size={13} /> {item.date}
                  </span>

                  {isAdminOrHR && (
                    <button
                      type="button"
                      onClick={() => handleDeleteAnnouncement(item._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                      }}
                      title="Delete announcement"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '0.75rem',
                  lineHeight: '1.3',
                }}
              >
                {item.title}
              </h2>

              {/* Content Body */}
              <p
                style={{
                  fontSize: '0.9rem',
                  color: '#334155',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  marginBottom: '1rem',
                }}
              >
                {item.content}
              </p>

              {/* Author Footer */}
              <div
                style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8rem',
                  color: '#64748b',
                }}
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: '#e0e7ff',
                    color: '#4338ca',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '0.7rem',
                  }}
                >
                  {item.author?.charAt(0) || 'A'}
                </div>
                <span>
                  Posted by <strong>{item.author}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Announcement Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Publish Organization Announcement"
        >
          <form onSubmit={handleCreateAnnouncement}>
            <div style={{ marginBottom: '1rem' }}>
              <Input
                label="Headline / Title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="e.g. Q4 Townhall Meeting Schedule"
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                options={[
                  { value: 'Company News', label: 'Company News' },
                  { value: 'Urgent Notice', label: 'Urgent Notice' },
                  { value: 'Policy Update', label: 'Policy Update' },
                  { value: 'Event & Celebration', label: 'Event & Celebration' },
                ]}
              />

              <Select
                label="Priority Level"
                value={formData.priority}
                onChange={(e) => setFormData((prev) => ({ ...prev, priority: e.target.value }))}
                options={[
                  { value: 'Normal', label: 'Normal' },
                  { value: 'High', label: 'High Priority (Red Alert)' },
                  { value: 'Low', label: 'Low / Information' },
                ]}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <Select
                label="Target Audience"
                value={formData.targetAudience}
                onChange={(e) => setFormData((prev) => ({ ...prev, targetAudience: e.target.value }))}
                options={[
                  { value: 'All Employees', label: 'All Employees (Company-wide)' },
                  { value: 'Engineering & IT', label: 'Engineering & IT Only' },
                  { value: 'Management & Leads', label: 'Management & Leads' },
                  { value: 'Human Resources', label: 'Human Resources' },
                ]}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <input
                  type="checkbox"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData((prev) => ({ ...prev, isPinned: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                />
                <span>Pin this announcement at the top of the board</span>
              </label>
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                Announcement Content / Message
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                rows={5}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  lineHeight: '1.5',
                }}
                placeholder="Write full broadcast details here..."
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Broadcast Announcement
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

