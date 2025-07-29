import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AccountForm from '../components/AccountForm';
import { accountAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { Account, AccountCreate } from '../types';

export default function AccountList() {
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);

  const { data: accounts, loading, refetch } = useApiData<Account>(() => accountAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { key: 'account_name', label: 'Account Name' },
    { key: 'epl_name', label: 'EPL Name' },
    { key: 'edp_name', label: 'EDP Name' },
  ];

  const handleNew = () => {
    setEditingAccount(null);
    setShowModal(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setShowModal(true);
  };

  const handleDelete = (account: Account) => {
    setDeletingAccount(account);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: AccountCreate) => {
    try {
      if (editingAccount) {
        await execute(
          () => accountAPI.update(editingAccount.id, data),
          { 
            successMessage: 'Account updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => accountAPI.create(data),
          { 
            successMessage: 'Account created successfully',
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
    if (!deletingAccount) return;

    try {
      await execute(
        () => accountAPI.delete(deletingAccount.id),
        { 
          successMessage: 'Account deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingAccount(null);
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
        title="Accounts"
        data={accounts}
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
        title={editingAccount ? 'Edit Account' : 'Create New Account'}
        size="md"
      >
        <AccountForm
          initialData={editingAccount || undefined}
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
            Are you sure you want to delete account "{deletingAccount?.account_name}"? This action cannot be undone.
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