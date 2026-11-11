import React, { useState, useEffect } from 'react';
import { payrollApi } from '../services/payrollApi.js';
import { employeeApi } from '../../employees/services/employeeApi.js';
import Button from '../../../components/common/Button.jsx';
import Modal from '../../../components/common/Modal.jsx';
import Input from '../../../components/common/Input.jsx';
import Select from '../../../components/common/Select.jsx';
import Loader from '../../../components/common/Loader.jsx';
import EmptyState from '../../../components/common/EmptyState.jsx';
import { useToast } from '../../../hooks/useToast.js';
import { useOutletContext } from 'react-router-dom';
import {
  Banknote,
  DollarSign,
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Printer,
  FileText,
  CreditCard,
  Building2,
  Sparkles,
  Trash2,
} from 'lucide-react';

export default function PayrollPage() {
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ totalPayroll: 0, paidCount: 0, pendingCount: 0, avgSalary: 0 });
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [activePayslip, setActivePayslip] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    employeeId: '',
    month: 'October',
    year: 2026,
    baseSalary: 5000,
    allowances: 500,
    deductions: 600,
    paymentStatus: 'Pending',
    paymentMethod: 'Direct Deposit',
    notes: '',
  });

  const { user } = useOutletContext() || {};
  const { success, error: toastError } = useToast();
  const isAdminOrHR = user?.role === 'Admin' || user?.role === 'HR';

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listRes, statsRes, empRes] = await Promise.all([
        payrollApi.listPayroll({ month: selectedMonth, year: selectedYear, status: statusFilter, q: searchQuery }),
        payrollApi.getPayrollStats(),
        employeeApi.listEmployees({ limit: 100 }),
      ]);

      let list = listRes || [];
      if (!isAdminOrHR) {
        const userEmail = user?.email?.toLowerCase();
        const userName = user?.name?.toLowerCase();
        list = list.filter(
          (p) =>
            (p.employeeEmail && p.employeeEmail.toLowerCase() === userEmail) ||
            (p.employeeName && p.employeeName.toLowerCase() === userName) ||
            (p.employeeId && user?.employeeId && p.employeeId === user.employeeId)
        );
        const total = list.reduce((sum, r) => sum + (Number(r.netSalary) || 0), 0);
        const paid = list.filter((r) => r.paymentStatus === 'Paid').length;
        const pending = list.filter((r) => r.paymentStatus === 'Pending' || r.paymentStatus === 'Processing').length;
        const avg = list.length ? Math.round(total / list.length) : 0;
        setStats({ totalPayroll: total, paidCount: paid, pendingCount: pending, avgSalary: avg });
      } else {
        setStats(statsRes || { totalPayroll: 0, paidCount: 0, pendingCount: 0, avgSalary: 0 });
      }

      setRecords(list);
      setEmployees(empRes?.employees || []);
    } catch (err) {
      console.error(err);
      toastError('Failed to load payroll data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear, statusFilter, searchQuery]);

  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    if (!formData.employeeId) {
      toastError('Please select an employee');
      return;
    }

    const emp = employees.find((e) => e.employeeId === formData.employeeId || e._id === formData.employeeId);
    try {
      await payrollApi.createPayroll({
        employeeId: emp?.employeeId || formData.employeeId,
        employeeName: emp?.fullName || 'Employee',
        designation: emp?.designation || 'Specialist',
        department: emp?.department?.name || 'General',
        month: formData.month,
        year: Number(formData.year),
        baseSalary: Number(formData.baseSalary),
        allowances: Number(formData.allowances),
        deductions: Number(formData.deductions),
        paymentStatus: formData.paymentStatus,
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
      });
      success('Payroll processed successfully!');
      setIsCreateModalOpen(false);
      fetchData();
    } catch (err) {
      toastError('Failed to process payroll');
    }
  };

  const handleMarkPaid = async (record) => {
    try {
      await payrollApi.updatePayrollStatus(record._id, {
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString().split('T')[0],
      });
      success(`Marked salary for ${record.employeeName} as Paid!`);
      fetchData();
    } catch (err) {
      toastError('Failed to update status');
    }
  };

  const handleDeletePayroll = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) return;
    try {
      await payrollApi.deletePayroll(id);
      success('Payroll record deleted');
      fetchData();
    } catch (err) {
      toastError('Failed to delete payroll record');
    }
  };

  const openPayslip = (record) => {
    setActivePayslip(record);
    setIsPayslipModalOpen(true);
  };

  const calculatedNet =
    Number(formData.baseSalary || 0) + Number(formData.allowances || 0) - Number(formData.deductions || 0);

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span
              style={{
                backgroundColor: 'rgba(198, 244, 50, 0.14)',
                color: '#C6F432',
                padding: '0.2rem 0.6rem',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <Banknote size={14} /> Finance & Compensation
            </span>
          </div>
          <h1 className="page-title">
            {isAdminOrHR ? 'Payroll & Compensation Management' : 'My Payslips & Compensation'}
          </h1>
          <p className="page-subtitle">
            {isAdminOrHR
              ? 'Configure employee pay runs, disburse compensations, and generate official payslips'
              : 'Access your monthly salary records, compensation breakdown, and download official payslips'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {isAdminOrHR && (
            <Button variant="primary" icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
              Process New Payrun
            </Button>
          )}
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Total Monthly Disbursal' : 'My Total Disbursed'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(198, 244, 50, 0.14)', color: '#C6F432' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            ${stats.totalPayroll.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C6F432', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Net wages across active payruns' : 'Net compensation paid to you'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Disbursed Salaries' : 'My Paid Payslips'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(198, 244, 50, 0.14)', color: '#C6F432' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.paidCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#C6F432', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Completed bank payments' : 'Successfully received disbursements'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Pending Payruns' : 'My Pending Payruns'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: 'rgba(250, 204, 21, 0.14)', color: '#FDE047' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            {stats.pendingCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#FDE047', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Awaiting disbursement approval' : 'In bank processing queue'}
          </div>
        </div>

        <div className="card" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>
              {isAdminOrHR ? 'Average Net Salary' : 'My Average Net Pay'}
            </span>
            <div style={{ padding: '0.4rem', borderRadius: '8px', backgroundColor: '#171918', color: '#D4D4D8' }}>
              <Receipt size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#FFFFFF', marginTop: '0.5rem' }}>
            ${stats.avgSalary.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#A1A1AA', fontWeight: 600, marginTop: '0.25rem' }}>
            {isAdminOrHR ? 'Per employee average compensation' : 'Average net monthly wage'}
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
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#71717A' }}
            />
            <input
              type="text"
              placeholder="Search employee or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.5rem 0.5rem 2.2rem',
                borderRadius: '6px',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#121314',
            }}
          >
            {[
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#121314',
            }}
          >
            {['2025', '2026', '2027'].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.5rem 0.75rem',
              borderRadius: '6px',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              fontSize: '0.85rem',
              fontWeight: 600,
              backgroundColor: '#121314',
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '3rem' }}>
            <Loader message="Loading compensation records..." />
          </div>
        ) : records.length === 0 ? (
          <EmptyState
            title="No Payroll Records Found"
            description="No salary disbursements match your search or filter criteria."
            actionLabel="Process Payrun"
            onAction={() => setIsCreateModalOpen(true)}
          />
        ) : (
          <div className="table-container" style={{ width: '100%', overflowX: 'auto' }}>
            <table className="data-table" style={{ width: '100%', minWidth: '1080px' }}>
              <thead>
                <tr>
                  <th style={{ minWidth: '220px' }}>Employee</th>
                  <th style={{ minWidth: '180px' }}>Department & Role</th>
                  <th style={{ minWidth: '130px' }}>Period</th>
                  <th style={{ minWidth: '130px' }}>Base Salary</th>
                  <th style={{ minWidth: '130px' }}>Allowances</th>
                  <th style={{ minWidth: '130px' }}>Deductions</th>
                  <th style={{ minWidth: '150px' }}>Net Pay</th>
                  <th style={{ minWidth: '140px' }}>Status</th>
                  <th style={{ minWidth: '160px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '10px',
                            background: '#C6F432',
                            color: '#0B0B0C',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.9rem',
                            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
                            flexShrink: 0,
                          }}
                        >
                          {item.employeeName?.charAt(0) || 'E'}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#FFFFFF', fontSize: '0.925rem' }}>
                            {item.employeeName}
                          </div>
                          <span
                            style={{
                              fontFamily: 'monospace',
                              fontSize: '0.725rem',
                              fontWeight: 600,
                              backgroundColor: '#171918',
                              color: '#D4D4D8',
                              padding: '2px 7px',
                              borderRadius: '4px',
                              border: '1px solid rgba(255, 255, 255, 0.10)',
                              display: 'inline-block',
                              marginTop: '3px',
                            }}
                          >
                            {item.employeeId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        <span
                          style={{
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            color: '#FFFFFF',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Building2 size={13} color="#C6F432" />
                          {item.department}
                        </span>
                        <span
                          style={{
                            fontSize: '0.725rem',
                            color: '#A1A1AA',
                            backgroundColor: '#171918',
                            border: '1px solid rgba(255, 255, 255, 0.10)',
                            borderRadius: '4px',
                            padding: '1px 6px',
                            width: 'fit-content',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {item.designation}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          backgroundColor: '#171918',
                          color: '#E4E4E7',
                          border: '1px solid rgba(255, 255, 255, 0.10)',
                          padding: '0.3rem 0.65rem',
                          borderRadius: '6px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        <Calendar size={12} color="#C6F432" />
                        {item.month} {item.year}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          color: '#E4E4E7',
                          fontSize: '0.875rem',
                          backgroundColor: '#171918',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.10)',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ${Number(item.baseSalary).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          color: '#C6F432',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          backgroundColor: 'rgba(198, 244, 50, 0.12)',
                          border: '1px solid rgba(198, 244, 50, 0.30)',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        +${Number(item.allowances).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          color: '#FCA5A5',
                          fontWeight: 700,
                          fontSize: '0.875rem',
                          backgroundColor: 'rgba(239, 68, 68, 0.14)',
                          border: '1px solid rgba(239, 68, 68, 0.30)',
                          padding: '0.25rem 0.55rem',
                          borderRadius: '6px',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        -${Number(item.deductions).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 800,
                          color: '#C6F432',
                          backgroundColor: 'rgba(198, 244, 50, 0.14)',
                          border: '1px solid #C6F432',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          display: 'inline-block',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        ${Number(item.netSalary).toLocaleString()}
                      </span>
                    </td>

                    <td>
                      {item.paymentStatus === 'Paid' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(198, 244, 50, 0.12)',
                            color: '#C6F432',
                            border: '1px solid rgba(198, 244, 50, 0.30)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <CheckCircle2 size={13} color="#C6F432" /> Paid
                        </span>
                      ) : item.paymentStatus === 'Processing' ? (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(198, 244, 50, 0.14)',
                            color: '#C6F432',
                            border: '1px solid rgba(198, 244, 50, 0.30)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Clock size={13} color="#C6F432" /> Processing
                        </span>
                      ) : (
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            backgroundColor: 'rgba(250, 204, 21, 0.12)',
                            color: '#FDE047',
                            border: '1px solid rgba(250, 204, 21, 0.30)',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <Clock size={13} color="#FDE047" /> Pending
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', gap: '0.35rem', whiteSpace: 'nowrap' }}>
                        <button
                          type="button"
                          onClick={() => openPayslip(item)}
                          style={{
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            backgroundColor: '#121314',
                            color: '#E4E4E7',
                            padding: '0.35rem 0.7rem',
                            borderRadius: '6px',
                            fontSize: '0.775rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                          }}
                          title="Generate and view payslip"
                        >
                          <FileText size={13} /> Payslip
                        </button>

                        {isAdminOrHR && item.paymentStatus !== 'Paid' && (
                          <button
                            type="button"
                            onClick={() => handleMarkPaid(item)}
                            style={{
                              border: '1px solid #C6F432',
                              backgroundColor: 'rgba(198, 244, 50, 0.12)',
                              color: '#C6F432',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                            title="Mark as paid"
                          >
                            Mark Paid
                          </button>
                        )}

                        {isAdminOrHR && (
                          <button
                            type="button"
                            onClick={() => handleDeletePayroll(item._id)}
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: '#71717A',
                              padding: '0.3rem',
                              cursor: 'pointer',
                            }}
                            title="Delete entry"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Payrun Modal */}
      {isCreateModalOpen && (
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title="Process Employee Payrun"
        >
          <form onSubmit={handleCreatePayroll}>
            <div style={{ marginBottom: '1rem' }}>
              <Select
                label="Select Employee"
                value={formData.employeeId}
                onChange={(e) => setFormData((prev) => ({ ...prev, employeeId: e.target.value }))}
                options={employees.map((emp) => ({
                  value: emp.employeeId,
                  label: `${emp.fullName} (${emp.employeeId} - ${emp.designation})`,
                }))}
                placeholder="Choose employee..."
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Select
                label="Month"
                value={formData.month}
                onChange={(e) => setFormData((prev) => ({ ...prev, month: e.target.value }))}
                options={[
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                  'July',
                  'August',
                  'September',
                  'October',
                  'November',
                  'December',
                ].map((m) => ({ value: m, label: m }))}
              />
              <Input
                label="Year"
                type="number"
                value={formData.year}
                onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Input
                label="Base Salary ($)"
                type="number"
                value={formData.baseSalary}
                onChange={(e) => setFormData((prev) => ({ ...prev, baseSalary: e.target.value }))}
                required
              />
              <Input
                label="Allowances ($)"
                type="number"
                value={formData.allowances}
                onChange={(e) => setFormData((prev) => ({ ...prev, allowances: e.target.value }))}
              />
              <Input
                label="Deductions ($)"
                type="number"
                value={formData.deductions}
                onChange={(e) => setFormData((prev) => ({ ...prev, deductions: e.target.value }))}
              />
            </div>

            {/* Calculated Net Box */}
            <div
              style={{
                backgroundColor: '#171918',
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '0.85rem', color: '#A1A1AA', fontWeight: 600 }}>Estimated Net Pay:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#C6F432' }}>
                ${calculatedNet.toLocaleString()}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <Select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentMethod: e.target.value }))}
                options={[
                  { value: 'Direct Deposit', label: 'Direct Deposit (ACH)' },
                  { value: 'Bank Transfer', label: 'Bank Wire Transfer' },
                  { value: 'Cheque', label: 'Company Cheque' },
                  { value: 'Cash', label: 'Cash / Petty Cash' },
                ]}
              />
              <Select
                label="Payment Status"
                value={formData.paymentStatus}
                onChange={(e) => setFormData((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                options={[
                  { value: 'Paid', label: 'Paid (Completed)' },
                  { value: 'Processing', label: 'Processing (Pending Bank)' },
                  { value: 'Pending', label: 'Pending (Draft)' },
                ]}
              />
            </div>

            <div style={{ marginBottom: '1.25rem' }}>
              <Input
                label="Remarks / Notes (Optional)"
                value={formData.notes}
                onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="e.g. includes quarterly bonus"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="outline" type="button" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Authorize & Save Payrun
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Payslip View Modal */}
      {isPayslipModalOpen && activePayslip && (
        <Modal
          isOpen={isPayslipModalOpen}
          onClose={() => setIsPayslipModalOpen(false)}
          title={`Employee Payslip: ${activePayslip.employeeName}`}
        >
          <div style={{ padding: '0.5rem 0' }}>
            <div
              id="printable-payslip"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.10)',
                borderRadius: '8px',
                padding: '1.5rem',
                backgroundColor: '#121314',
              }}
            >
              {/* Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '2px solid #FFFFFF',
                  paddingBottom: '1rem',
                  marginBottom: '1rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}>EmployeeHub Enterprise</h3>
                  <div style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>
                    100 Innovation Way, Suite 400 • New York, NY
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#A1A1AA' }}>Tax ID: US-EIN-9920194</div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: 'rgba(198, 244, 50, 0.12)',
                      color: '#C6F432',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                    }}
                  >
                    OFFICIAL PAYSLIP
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '0.3rem', color: '#FFFFFF' }}>
                    {activePayslip.month} {activePayslip.year}
                  </div>
                </div>
              </div>

              {/* Employee Info Block */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  backgroundColor: '#171918',
                  padding: '1rem',
                  borderRadius: '6px',
                  marginBottom: '1.25rem',
                  fontSize: '0.825rem',
                }}
              >
                <div>
                  <div>
                    <span style={{ color: '#A1A1AA' }}>Employee Name:</span>{' '}
                    <strong>{activePayslip.employeeName}</strong>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: '#A1A1AA' }}>Employee ID:</span> <strong>{activePayslip.employeeId}</strong>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: '#A1A1AA' }}>Department:</span> <strong>{activePayslip.department}</strong>
                  </div>
                </div>

                <div>
                  <div>
                    <span style={{ color: '#A1A1AA' }}>Designation:</span>{' '}
                    <strong>{activePayslip.designation}</strong>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: '#A1A1AA' }}>Payment Mode:</span>{' '}
                    <strong>{activePayslip.paymentMethod}</strong>
                  </div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ color: '#A1A1AA' }}>Disbursal Date:</span>{' '}
                    <strong>{activePayslip.paymentDate || 'Pending'}</strong>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
                <div>
                  <h4
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#C6F432',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                      paddingBottom: '0.4rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Earnings
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span>Base Salary:</span>
                    <strong>${Number(activePayslip.baseSalary).toLocaleString()}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span>Allowances & Stipends:</span>
                    <strong>${Number(activePayslip.allowances).toLocaleString()}</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      borderTop: '1px dashed rgba(255, 255, 255, 0.14)',
                      paddingTop: '0.4rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>Gross Earnings:</span>
                    <span>${(Number(activePayslip.baseSalary) + Number(activePayslip.allowances)).toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <h4
                    style={{
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      color: '#FCA5A5',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.10)',
                      paddingBottom: '0.4rem',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Deductions
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.3rem' }}>
                    <span>Tax Withholdings & PF:</span>
                    <strong>${Number(activePayslip.deductions).toLocaleString()}</strong>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      borderTop: '1px dashed rgba(255, 255, 255, 0.14)',
                      paddingTop: '0.4rem',
                      marginTop: '0.5rem',
                    }}
                  >
                    <span>Total Deductions:</span>
                    <span>-${Number(activePayslip.deductions).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Net Payable Highlight */}
              <div
                style={{
                  backgroundColor: '#0B0B0C',
                  border: '1px solid rgba(198, 244, 50, 0.35)',
                  color: '#FFFFFF',
                  padding: '1rem',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#71717A', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Net Disbursed Amount
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.14)' }}>Directly transferred to employee account</div>
                </div>
                <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#C6F432' }}>
                  ${Number(activePayslip.netSalary).toLocaleString()}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button variant="outline" onClick={() => setIsPayslipModalOpen(false)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => {
                  window.print();
                }}
              >
                Print Payslip
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

