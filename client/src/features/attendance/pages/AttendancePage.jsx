import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../services/attendanceApi.js';
import Button from '../../../components/common/Button.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useOutletContext } from 'react-router-dom';
import {
  CalendarDays,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  CheckSquare,
  Users,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Percent,
} from 'lucide-react';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ total: 0, present: 0, absent: 0, onLeave: 0, halfDay: 0, late: 0, rate: 0 });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes] = await Promise.all([
        attendanceApi.listAttendance(selectedDate),
        attendanceApi.getAttendanceStats(selectedDate),
      ]);

      let list = listRes || [];
      if (!isAdminOrHR) {
        const userEmail = user?.email?.toLowerCase();
        const userName = user?.name?.toLowerCase();
        list = list.filter(
          (r) =>
            (r.employeeEmail && r.employeeEmail.toLowerCase() === userEmail) ||
            (r.employeeName && r.employeeName.toLowerCase() === userName) ||
            (r.employeeId && user?.employeeId && r.employeeId === user.employeeId)
        );
        const present = list.filter((r) => r.status === 'Present').length;
        const absent = list.filter((r) => r.status === 'Absent').length;
        const onLeave = list.filter((r) => r.status === 'On Leave').length;
        const halfDay = list.filter((r) => r.status === 'Half Day').length;
        const late = list.filter((r) => r.status === 'Late').length;
        const total = list.length;
        const rate = total > 0 ? Math.round(((present + halfDay) / total) * 100) : 100;
        setStats({ total, present, absent, onLeave, halfDay, late, rate });
      } else {
        setStats(statsRes || { total: 0, present: 0, absent: 0, onLeave: 0, halfDay: 0, late: 0, rate: 0 });
      }

      setRecords(list);
    } catch (err) {
      console.error(err);
      toastError('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedDate]);

  const handleUpdateStatus = async (recordId, newStatus) => {
    try {
      let checkIn = '09:00 AM';
      let checkOut = '05:30 PM';
      if (newStatus === 'Absent' || newStatus === 'On Leave') {
        checkIn = '-';
        checkOut = '-';
      } else if (newStatus === 'Half Day') {
        checkIn = '09:00 AM';
        checkOut = '01:30 PM';
      } else if (newStatus === 'Late') {
        checkIn = '10:15 AM';
        checkOut = '06:00 PM';
      }

      await attendanceApi.updateAttendance(recordId, {
        status: newStatus,
        checkIn,
        checkOut,
      });
      success(`Updated status to ${newStatus}`);
      fetchData();
    } catch (err) {
      toastError('Failed to update status');
    }
  };

  const handleMarkAllPresent = async () => {
    try {
      await attendanceApi.batchMarkAttendance(selectedDate, 'Present');
      success(`All staff marked as Present for ${selectedDate}!`);
      fetchData();
    } catch (err) {
      toastError('Failed to batch mark attendance');
    }
  };

  const shiftDate = (days) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const departments = ['All', ...new Set(records.map((r) => r.department).filter(Boolean))];

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      !searchQuery ||
      r.employeeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.employeeId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'All' || r.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: '#e0e7ff',
                color: '#4338ca',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <CalendarDays size={14} /> Workforce Operations
            </span>
          </div>
          <h1 className="page-title">
            {isAdminOrHR ? 'Daily Attendance Tracker' : 'My Daily Attendance Log'}
          </h1>
          <p className="page-subtitle">
            {isAdminOrHR
              ? 'Monitor daily check-ins, punctuality metrics, absences, and log staff work hours'
              : 'View your recorded work hours, check-in and check-out logs, and attendance status'}
          </p>
        </div>

        {/* Date Navigator Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.25rem 0.5rem',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
            }}
          >
            <button
              type="button"
              onClick={() => shiftDate(-1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                padding: '4px',
              }}
              title="Previous Day"
            >
              <ChevronLeft size={18} />
            </button>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                border: 'none',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#0f172a',
                padding: '0 0.5rem',
                cursor: 'pointer',
              }}
            />

            <button
              type="button"
              onClick={() => shiftDate(1)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b',
                display: 'flex',
                padding: '4px',
              }}
              title="Next Day"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
          >
            Today
          </Button>

          {isAdminOrHR && (
            <Button size="sm" variant="primary" icon={CheckSquare} onClick={handleMarkAllPresent}>
              Mark All Present
            </Button>
          )}
        </div>
      </div>

      {/* Top 5 Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Present Today</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#dcfce7', color: '#16a34a' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.present}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '0.25rem' }}>
            Active at work stations
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Absent</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fee2e2', color: '#dc2626' }}>
              <XCircle size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.absent}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '0.25rem' }}>
            Unscheduled absences
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>On Leave</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#fef3c7', color: '#b45309' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.onLeave}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '0.25rem' }}>
            Authorized time off
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Late / Half Day</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#f3e8ff', color: '#9333ea' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.late + stats.halfDay}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#9333ea', fontWeight: 600, marginTop: '0.25rem' }}>
            Partial work hours logged
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Turnout Rate</span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#e0e7ff', color: '#4f46e5' }}>
              <Percent size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginTop: '0.5rem' }}>
            {stats.rate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: 600, marginTop: '0.25rem' }}>
            Effective workforce capacity
          </div>
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', flex: 1, minWidth: '280px' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search employee name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#ffffff',
            }}
          >
            {departments.map((d) => (
              <option key={d} value={d}>
                {d === 'All' ? 'All Departments' : d}
              </option>
            ))}
          </select>
        </div>

        <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
          Showing {filteredRecords.length} staff records for {selectedDate}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem' }}>
            <Loader message="Loading attendance records..." />
          </div>
        ) : filteredRecords.length === 0 ? (
          <EmptyState
            title="No Attendance Records"
            description="No employee attendance records match your filter criteria."
          />
        ) : (
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Current Status</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Notes</th>
                  {isAdminOrHR && <th style={{ textAlign: 'center' }}>Quick Status Change</th>}
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <div
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '50%',
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                          }}
                        >
                          {item.employeeName?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#0f172a' }}>{item.employeeName}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.employeeId}</div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {item.department}
                      </span>
                    </td>

                    <td>
                      {item.status === 'Present' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#d1fae5',
                            color: '#065f46',
                          }}
                        >
                          <CheckCircle2 size={12} /> Present
                        </span>
                      ) : item.status === 'Absent' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#fee2e2',
                            color: '#991b1b',
                          }}
                        >
                          <XCircle size={12} /> Absent
                        </span>
                      ) : item.status === 'Half Day' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#fef3c7',
                            color: '#b45309',
                          }}
                        >
                          <Clock size={12} /> Half Day
                        </span>
                      ) : item.status === 'Late' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#f3e8ff',
                            color: '#7e22ce',
                          }}
                        >
                          <Clock size={12} /> Late
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            backgroundColor: '#e0e7ff',
                            color: '#4338ca',
                          }}
                        >
                          <Clock size={12} /> On Leave
                        </span>
                      )}
                    </td>

                    <td style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.checkIn || '-'}</td>
                    <td style={{ fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{item.checkOut || '-'}</td>

                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.notes || '-'}</td>

                    {isAdminOrHR && (
                      <td style={{ textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item._id, 'Present')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: item.status === 'Present' ? '1px solid #10b981' : '1px solid #cbd5e1',
                              backgroundColor: item.status === 'Present' ? '#d1fae5' : '#ffffff',
                              color: item.status === 'Present' ? '#065f46' : '#64748b',
                            }}
                          >
                            P
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item._id, 'Absent')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: item.status === 'Absent' ? '1px solid #ef4444' : '1px solid #cbd5e1',
                              backgroundColor: item.status === 'Absent' ? '#fee2e2' : '#ffffff',
                              color: item.status === 'Absent' ? '#991b1b' : '#64748b',
                            }}
                          >
                            A
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item._id, 'Half Day')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: item.status === 'Half Day' ? '1px solid #f59e0b' : '1px solid #cbd5e1',
                              backgroundColor: item.status === 'Half Day' ? '#fef3c7' : '#ffffff',
                              color: item.status === 'Half Day' ? '#b45309' : '#64748b',
                            }}
                          >
                            HD
                          </button>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(item._id, 'Late')}
                            style={{
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              border: item.status === 'Late' ? '1px solid #a855f7' : '1px solid #cbd5e1',
                              backgroundColor: item.status === 'Late' ? '#f3e8ff' : '#ffffff',
                              color: item.status === 'Late' ? '#7e22ce' : '#64748b',
                            }}
                          >
                            L
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

