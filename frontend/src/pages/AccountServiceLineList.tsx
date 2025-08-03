import { useState, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import AccountServiceLineForm from '../components/AccountServiceLineForm';
import { accountServiceLineAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { AccountServiceLine, AccountServiceLineCreate } from '../types';
import { Upload, Download } from 'lucide-react';

export default function AccountServiceLineList() {
  const [showModal, setShowModal] = useState(false);
  const [editingServiceLine, setEditingServiceLine] = useState<AccountServiceLine | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingServiceLine, setDeletingServiceLine] = useState<AccountServiceLine | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleImport = () => {
    setShowImportModal(true);
    setImportResult(null);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const response = await execute(
        () => accountServiceLineAPI.importExcel(file),
        {
          successMessage: 'File processed successfully',
        }
      );
      
      if (response) {
        setImportResult(response.data);
        refetch(); // Refresh the service lines list
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
      ['account_name', 'service_line', 'edl_name', 'pdl_name', 'sl_spoc'],
      ['Acme Corp', 'Digital Banking', 'John Doe', 'Jane Smith', 'Bob Wilson'],
      ['TechCorp', 'Cloud Solutions', 'Alice Brown', 'Charlie Davis', 'Eva Jones']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'account_service_lines_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const actionButtons = [
    {
      label: 'Import',
      onClick: handleImport,
      icon: <Upload className="h-4 w-4" />,
      variant: 'secondary' as const
    }
  ];

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
        actionButtons={actionButtons}
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

      {/* Import Modal */}
      <Modal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        title="Import Account Service Lines from Excel"
        size="md"
      >
        <div className="space-y-6">
          {!importResult ? (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload an Excel file (.xlsx or .xls) with account service line data</li>
                    <li>• Required columns: <code className="bg-gray-100 px-1 rounded">account_name</code>, <code className="bg-gray-100 px-1 rounded">service_line</code>, <code className="bg-gray-100 px-1 rounded">edl_name</code>, <code className="bg-gray-100 px-1 rounded">pdl_name</code>, <code className="bg-gray-100 px-1 rounded">sl_spoc</code></li>
                    <li>• Account names must match existing accounts in the system</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="service-line-file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Choose Excel file to upload
                        </span>
                        <input
                          ref={fileInputRef}
                          id="service-line-file-upload"
                          name="service-line-file-upload"
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
    </>
  );
} 