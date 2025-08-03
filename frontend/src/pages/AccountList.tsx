import { useState, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AccountForm from '../components/AccountForm';
import { accountAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { Account, AccountCreate } from '../types';
import { Upload, Download, Trash2 } from 'lucide-react';

export default function AccountList() {
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [deleteAllResult, setDeleteAllResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = () => {
    setShowImportModal(true);
    setImportResult(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await execute(
        () => accountAPI.importExcel(file),
        {
          successMessage: 'File processed successfully',
        }
      );
      
      if (response) {
        setImportResult(response.data);
        refetch(); // Refresh the accounts list
      }
    } catch (error) {
      // Error handling is done in useApi hook
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadTemplate = () => {
    const template = [
      ['account_name', 'epl_name', 'edp_name'],
      ['Sample Account 1', 'John Doe', 'Jane Smith'],
      ['Sample Account 2', 'Bob Johnson', 'Alice Brown']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'account_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleDeleteAll = () => {
    setShowDeleteAllConfirm(true);
    setDeleteAllResult(null);
  };

  const confirmDeleteAll = async () => {
    try {
      const response = await execute(
        () => accountAPI.deleteAll(),
        {
          successMessage: 'All accounts and related data deleted successfully',
        }
      );
      
      if (response) {
        setDeleteAllResult(response.data);
        refetch(); // Refresh the accounts list
      }
    } catch (error) {
      // Error handling is done in useApi hook
    }
  };

  const actionButtons = [
    {
      label: 'Import',
      onClick: handleImport,
      icon: <Upload className="h-4 w-4" />,
      variant: 'secondary' as const
    },
    {
      label: 'Delete All',
      onClick: handleDeleteAll,
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'secondary' as const
    }
  ];

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
        actionButtons={actionButtons}
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

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Accounts from Excel"
        size="md"
      >
        <div className="space-y-6">
          {!importResult ? (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload an Excel file (.xlsx or .xls) with account data</li>
                    <li>• Required columns: <code className="bg-gray-100 px-1 rounded">account_name</code>, <code className="bg-gray-100 px-1 rounded">epl_name</code>, <code className="bg-gray-100 px-1 rounded">edp_name</code></li>
                    <li>• Duplicate account names will be skipped</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Choose Excel file to upload
                        </span>
                        <input
                          ref={fileInputRef}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="sr-only"
                        />
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        Supports .xlsx and .xls files
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <button
                  onClick={downloadTemplate}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Download Template
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Import Results</h3>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>Total rows processed: {importResult.total_rows}</p>
                  <p className="text-green-700">Successfully imported: {importResult.imported}</p>
                  {importResult.skipped > 0 && (
                    <p className="text-yellow-700">Skipped: {importResult.skipped}</p>
                  )}
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-red-900 mb-2">Errors:</h4>
                  <ul className="text-sm text-red-800 space-y-1">
                    {importResult.errors.map((error: string, index: number) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportResult(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
                     )}
         </div>
       </Modal>

      {/* Delete All Confirmation Modal */}
      <Modal
        isOpen={showDeleteAllConfirm}
        onClose={() => {
          setShowDeleteAllConfirm(false);
          setDeleteAllResult(null);
        }}
        title="⚠️ Delete All Accounts and Related Data"
        size="md"
      >
        <div className="space-y-6">
          {!deleteAllResult ? (
            <>
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Trash2 className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      This action cannot be undone!
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>This will permanently delete:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>All Accounts</li>
                        <li>All Account Service Lines</li>
                        <li>All GenCs associated with these accounts</li>
                        <li>All GenC Skills and Feedback</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">
                  Are you absolutely sure you want to delete all accounts and their related data?
                </p>
                <p className="text-sm text-gray-500">
                  Type <strong>"DELETE ALL"</strong> below to confirm:
                </p>
                <input
                  type="text"
                  id="confirmDelete"
                  placeholder="Type DELETE ALL to confirm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteAllConfirm(false);
                    setDeleteAllResult(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const input = document.getElementById('confirmDelete') as HTMLInputElement;
                    if (input?.value === 'DELETE ALL') {
                      confirmDeleteAll();
                    } else {
                      alert('Please type "DELETE ALL" to confirm the deletion.');
                    }
                  }}
                  disabled={submitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Deleting...' : 'Delete All Data'}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <h3 className="text-sm font-medium text-green-900 mb-2">Deletion Completed</h3>
                <p className="text-sm text-green-800">{deleteAllResult.message}</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Deleted Items:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p>• Accounts: {deleteAllResult.deleted_counts?.accounts || 0}</p>
                  <p>• Service Lines: {deleteAllResult.deleted_counts?.account_service_lines || 0}</p>
                  <p>• GenCs: {deleteAllResult.deleted_counts?.gencs || 0}</p>
                  <p>• GenC Skills: {deleteAllResult.deleted_counts?.genc_skills || 0}</p>
                  <p>• GenC Feedback: {deleteAllResult.deleted_counts?.genc_feedbacks || 0}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    setShowDeleteAllConfirm(false);
                    setDeleteAllResult(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
} 