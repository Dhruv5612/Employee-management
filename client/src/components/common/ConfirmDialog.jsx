import React from 'react';
import Modal from './Modal.jsx';
import Button from './Button.jsx';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDestructive = true,
  isLoading = false,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="450px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </Button>
          <Button
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {isDestructive && (
          <div
            style={{
              padding: '0.65rem',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#ef4444',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={24} />
          </div>
        )}
        <div style={{ color: '#475569', fontSize: '0.925rem', lineHeight: 1.5 }}>
          {message}
        </div>
      </div>
    </Modal>
  );
}
