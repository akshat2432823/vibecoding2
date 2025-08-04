import { useState, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import MentorForm from '../components/MentorForm';
import { mentorAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { Mentor, MentorCreate } from '../types';
import { Upload, Download } from 'lucide-react';

export default function MentorList() {
  const [showModal, setShowModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingMentor, setDeletingMentor] = useState<Mentor | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: mentors, loading, refetch } = useApiData<Mentor>(() => mentorAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { key: 'associate_id', label: 'Associate ID' },
    { key: 'mentor_name', label: 'Mentor Name' },
    { 
      key: 'designation', 
      label: 'Designation',
      render: (value: string) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {value}
        </span>
      )
    },
    { key: 'service_line', label: 'Service Line' },
  ];

  const handleNew = () => {
    setEditingMentor(null);
    setShowModal(true);
  };

  const handleEdit = (mentor: Mentor) => {
    setEditingMentor(mentor);
    setShowModal(true);
  };

  const handleDelete = (mentor: Mentor) => {
    setDeletingMentor(mentor);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: MentorCreate) => {
    try {
      if (editingMentor) {
        await execute(
          () => mentorAPI.update(editingMentor.id, data),
          { 
            successMessage: 'Mentor updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => mentorAPI.create(data),
          { 
            successMessage: 'Mentor created successfully',
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
    if (!deletingMentor) return;

    try {
      await execute(
        () => mentorAPI.delete(deletingMentor.id),
        { 
          successMessage: 'Mentor deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingMentor(null);
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
        () => mentorAPI.importExcel(file),
        {
          successMessage: 'File processed successfully',
        }
      );
      
      if (response) {
        setImportResult(response.data);
        refetch(); // Refresh the mentors list
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
      ['associate_id', 'mentor_name', 'designation', 'service_line'],
      ['M001', 'John Doe', 'SM', 'Digital Banking'],
      ['M002', 'Jane Smith', 'M', 'Cloud Solutions']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mentor_import_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const actionButtons = [
    {
      label: 'Import',
      onClick: handleImport,
      icon: <Upload className="h-4 w-4" />
    }
  ];

  return (
    <>
      <DataTable
        title="Mentors"
        data={mentors}
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
        title={editingMentor ? 'Edit Mentor' : 'Create New Mentor'}
        size="lg"
      >
        <MentorForm
          initialData={editingMentor || undefined}
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
            Are you sure you want to delete mentor "{deletingMentor?.mentor_name}"? This action cannot be undone.
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
        title="Import Mentors from Excel"
        size="md"
      >
        <div className="space-y-6">
          {!importResult ? (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload an Excel file (.xlsx or .xls) with mentor data</li>
                    <li>• Required columns: <code className="bg-gray-100 px-1 rounded">associate_id</code>, <code className="bg-gray-100 px-1 rounded">mentor_name</code>, <code className="bg-gray-100 px-1 rounded">designation</code>, <code className="bg-gray-100 px-1 rounded">service_line</code></li>
                    <li>• Designation values: D, AD, SM, M, SA, A</li>
                    <li>• Duplicate associate IDs will be skipped</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="mentor-file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Choose Excel file to upload
                        </span>
                        <input
                          ref={fileInputRef}
                          id="mentor-file-upload"
                          name="mentor-file-upload"
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