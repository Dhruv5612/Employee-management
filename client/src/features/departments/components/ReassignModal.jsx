import React, { useState } from 'react';
import Modal from '../../../components/common/Modal.jsx';
import Select from '../../../components/common/Select.jsx';
import Button from '../../../components/common/Button.jsx';
import { departmentApi } from '../services/departmentApi.js';
import { useToast } from '../../../hooks/useToast.js';
import { Users, ArrowRightLeft } from 'lucide-react';

export default function ReassignModal({
  isOpen,
  onClose,
  sourceDepartment,
  departments = [],
  onReassigned,
}) {
  const [targetId, setTargetId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: toastError } = useToast();

  if (!sourceDepartment) return null;

  const availableTargets = departments
    .filter((d) => d._id !== sourceDepartment._id)
    .map((d) => ({
      value: d._id,
      label: `${d.name} (${d.code})`,
    }));

  const handleReassign = async () => {
    if (!targetId) {
      toastError('Please choose a target department');
      return;
    }

    setIsLoading(true);
    try {
      await departmentApi.reassignEmployees(sourceDepartment._id, targetId);
      success(
        `Successfully transferred all employees from ${sourceDepartment.name}`
      );
      onReassigned();
      onClose();
    } catch (err) {
      toastError(err.response?.data?.message || err.message || 'Reassignment failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reassign Department Employees"
      maxWidth="500px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleReassign}
            isLoading={isLoading}
            icon={ArrowRightLeft}
          >
            Confirm Reassignment
          </Button>
        </>
      }
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <div
          style={{
            padding: '0.85rem 1rem',
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: '8px',
            color: '#1e40af',
            fontSize: '0.875rem',
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <Users size={20} />
          <span>
            <strong>{sourceDepartment.name}</strong> currently has{' '}
            <strong>{sourceDepartment.employeeCount}</strong> assigned employee(s).
          </span>
        </div>

        <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1.25rem' }}>
          Select the destination department where all existing members of{' '}
          <strong>{sourceDepartment.name}</strong> will be securely reassigned.
        </p>

        <Select
          label="Destination Department"
          name="targetDepartmentId"
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          options={availableTargets}
          placeholder="Select destination department"
          required
        />
      </div>
    </Modal>
  );
}
