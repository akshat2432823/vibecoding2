import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import ApplicationUserForm from '../components/ApplicationUserForm';
import { applicationUserAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { ApplicationUser, ApplicationUserCreate } from '../types';

export default function ApplicationUserList() {
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<ApplicationUser | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingUser, setDeletingUser] = useState<ApplicationUser | null>(null);

  const { data: users, loading, refetch } = useApiData<ApplicationUser>(() => applicationUserAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { key: 'user_assoc_id', label: 'Associate ID' },
    { key: 'user_name', label: 'User Name' },
    { 
      key: 'user_type', 
      label: 'User Type',
      render: (value: string) => {
        const colorMap: { [key: string]: string } = {
          'PMO Member': 'bg-blue-100 text-blue-800',
          'MDU Member': 'bg-green-100 text-green-800',
          'Mentor': 'bg-purple-100 text-purple-800',
          'SL Member': 'bg-orange-100 text-orange-800',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[value] || 'bg-gray-100 text-gray-800'}`}>
            {value}
          </span>
        );
      }
    },
  ];

  const handleNew = () => {
    setEditingUser(null);
    setShowModal(true);
  };

  const handleEdit = (user: ApplicationUser) => {
    setEditingUser(user);
    setShowModal(true);
  };

  const handleDelete = (user: ApplicationUser) => {
    setDeletingUser(user);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: ApplicationUserCreate) => {
    try {
      if (editingUser) {
        await execute(
          () => applicationUserAPI.update(editingUser.id, data),
          { 
            successMessage: 'User updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => applicationUserAPI.create(data),
          { 
            successMessage: 'User created successfully',
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
    if (!deletingUser) return;

    try {
      await execute(
        () => applicationUserAPI.delete(deletingUser.id),
        { 
          successMessage: 'User deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingUser(null);
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
        title="Application Users"
        data={users}
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
        title={editingUser ? 'Edit User' : 'Create New User'}
        size="md"
      >
        <ApplicationUserForm
          initialData={editingUser || undefined}
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
            Are you sure you want to delete user "{deletingUser?.user_name}"? This action cannot be undone.
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