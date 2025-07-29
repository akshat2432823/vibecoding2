import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AccountServiceLineForm from '../components/AccountServiceLineForm';
import { accountServiceLineAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { AccountServiceLine, AccountServiceLineCreate } from '../types';

export default function AccountServiceLineList() {
  const [showModal, setShowModal] = useState(false);
  const [editingServiceLine, setEditingServiceLine] = useState<AccountServiceLine | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingServiceLine, setDeletingServiceLine] = useState<AccountServiceLine | null>(null);

  const { data: serviceLines, loading, refetch } = useApiData<AccountServiceLine>(() => accountServiceLineAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { 
      key: 'account', 
      label: 'Account', 
      render: (_: any, item: AccountServiceLine) => item.account?.account_name || '-'
    },
    { key: 'service_line', label: 'Service Line' },
    { key: 'edl_name', label: 'EDL Name' },
    { key: 'pdl_name', label: 'PDL Name' },
    { key: 'sl_spoc', label: 'SL SPOC' },
  ];

  const handleNew = () => {
    setEditingServiceLine(null);
    setShowModal(true);
  };

  const handleEdit = (serviceLine: AccountServiceLine) => {
    setEditingServiceLine(serviceLine);
    setShowModal(true);
  };

  const handleDelete = (serviceLine: AccountServiceLine) => {
    setDeletingServiceLine(serviceLine);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: AccountServiceLineCreate) => {
    try {
      if (editingServiceLine) {
        await execute(
          () => accountServiceLineAPI.update(editingServiceLine.id, data),
          { 
            successMessage: 'Service Line updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => accountServiceLineAPI.create(data),
          { 
            successMessage: 'Service Line created successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      }
    } catch (error) {
      // Error handling is done in useApi hook
    }
  };

  const confirmDelete = async () => {
    if (!deletingServiceLine) return;

    try {
      await execute(
        () => accountServiceLineAPI.delete(deletingServiceLine.id),
        { 
          successMessage: 'Service Line deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingServiceLine(null);
            refetch();
          }
        }
      );
    } catch (error) {
      // Error handling is done in useApi hook
    }
  };

  return (
    <>
      <DataTable
        title="Account Service Lines"
        data={serviceLines}
        columns={columns}
        loading={loading}
        onNew={handleNew}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingServiceLine ? 'Edit Service Line' : 'Create New Service Line'}
        size="lg"
      >
        <AccountServiceLineForm
          initialData={editingServiceLine || undefined}
          onSubmit={handleSubmit}
          onCancel={() => setShowModal(false)}
          loading={submitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this service line? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
} 