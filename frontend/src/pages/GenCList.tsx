import { useState, useRef } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import GenCForm from '../components/GenCForm';
import { genCAPI, genCSkillAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { GenC, GenCCreate } from '../types';
import { SelectedSkill } from '../components/GenCSkillSelector';
import { Upload, Download } from 'lucide-react';

interface GenCFormData extends GenCCreate {
  skills?: SelectedSkill[];
}

export default function GenCList() {
  const [showModal, setShowModal] = useState(false);
  const [editingGenC, setEditingGenC] = useState<GenC | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingGenC, setDeletingGenC] = useState<GenC | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: gencs, loading, refetch } = useApiData<GenC>(() => genCAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { key: 'associate_id', label: 'Associate ID' },
    { key: 'genc_name', label: 'Name' },
    { 
      key: 'account', 
      label: 'Account',
      render: (_: any, item: GenC) => item.account?.account_name || '-'
    },
    { 
      key: 'service_line_obj', 
      label: 'Service Line',
      render: (_: any, item: GenC) => item.service_line_obj?.service_line || '-'
    },
    { 
      key: 'mentor', 
      label: 'Mentor',
      render: (_: any, item: GenC) => item.mentor?.mentor_name || '-'
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (value: string) => {
        const statusColors: Record<string, string> = {
          'Idle': 'status-idle',
          'Under Project Training': 'status-training',
          'Customer Onboarded': 'status-onboarded',
          'Billing Planned': 'status-billing-planned',
          'Billing Started': 'status-billing-started',
          'GenC Regularized': 'status-regularized',
          'Feedback Not Good': 'status-feedback-poor',
          'Released/Resigned': 'status-released'
        };
        return (
          <span className={`cognizant-status-badge ${statusColors[value] || 'status-idle'}`}>
            {value}
          </span>
        );
      }
    },
    { key: 'location', label: 'Location' },
    { key: 'current_designation', label: 'Designation' },
    {
      key: 'skills',
      label: 'Skills',
      render: (_: any, item: GenC) => {
        const skillCount = item.skills?.length || 0;
        if (skillCount === 0) {
          return <span className="text-gray-500 text-sm">No skills</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-blue-600">{skillCount} skills</span>
            <div className="flex gap-1">
              {item.skills?.slice(0, 2).map((skill, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                  title={`${skill.skill?.skill_name}: ${skill.proficiency_level}`}
                >
                  {skill.skill?.skill_name}
                </span>
              ))}
              {skillCount > 2 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{skillCount - 2}
                </span>
              )}
            </div>
          </div>
        );
      }
    }
  ];

  const handleNew = () => {
    setEditingGenC(null);
    setShowModal(true);
  };

  const handleEdit = (genc: GenC) => {
    setEditingGenC(genc);
    setShowModal(true);
  };

  const handleDelete = (genc: GenC) => {
    setDeletingGenC(genc);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: GenCFormData) => {
    try {
      const { skills, ...formData } = data;
      
      // Clean up data - convert empty strings to undefined for optional fields
      const gencData = {
        ...formData,
        // Ensure required numeric fields are numbers
        account_id: Number(formData.account_id),
        service_line_id: Number(formData.service_line_id), 
        mentor_id: Number(formData.mentor_id),
        // Clean optional fields
        date_of_allocation: formData.date_of_allocation || undefined,
        allocation_project: formData.allocation_project || undefined,
        team_name: formData.team_name || undefined,
        planned_billing_start_date: formData.planned_billing_start_date || undefined,
        actual_billing_start_date: formData.actual_billing_start_date || undefined,
      };

      console.log('Sending GenC data:', gencData); // Debug log
      
      if (editingGenC) {
        // Update GenC
        await execute(
          () => genCAPI.update(editingGenC.id, gencData),
          { 
            successMessage: 'GenC updated successfully',
            onSuccess: async (updatedGenC) => {
              // Handle skills update
              if (skills && skills.length > 0) {
                // Delete existing skills for this GenC
                if (editingGenC.skills) {
                  for (const existingSkill of editingGenC.skills) {
                    await genCSkillAPI.delete(existingSkill.id);
                  }
                }
                
                // Create new skills
                for (const skill of skills) {
                  await genCSkillAPI.create({
                    genc_id: editingGenC.id,
                    skill_id: skill.skill_id,
                    proficiency_level: skill.proficiency_level,
                    date_acquired: skill.date_acquired ? new Date(skill.date_acquired).toISOString().split('T')[0] : undefined,
                    notes: skill.notes || undefined
                  });
                }
              }
              
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        // Create GenC
        await execute(
          () => genCAPI.create(gencData),
          { 
            successMessage: 'GenC created successfully',
            onSuccess: async (newGenC) => {
              // Handle skills creation
              if (skills && skills.length > 0) {
                for (const skill of skills) {
                  await genCSkillAPI.create({
                    genc_id: newGenC.data.id,
                    skill_id: skill.skill_id,
                    proficiency_level: skill.proficiency_level,
                    date_acquired: skill.date_acquired ? new Date(skill.date_acquired).toISOString().split('T')[0] : undefined,
                    notes: skill.notes || undefined
                  });
                }
              }
              
              setShowModal(false);
              refetch();
            }
          }
        );
      }
    } catch (error) {
      // Error handling is done in useApi hook
      console.error('Error submitting GenC:', error);
    }
  };

  const confirmDelete = async () => {
    if (!deletingGenC) return;

    try {
      await execute(
        () => genCAPI.delete(deletingGenC.id),
        { 
          successMessage: 'GenC deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingGenC(null);
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
        () => genCAPI.importExcel(file),
        {
          successMessage: 'File processed successfully',
        }
      );
      
      if (response) {
        setImportResult(response.data);
        refetch(); // Refresh the GenCs list
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
      ['associate_id', 'genc_name', 'account_name', 'service_line', 'mentor_associate_id', 'status', 'date_of_joining', 'location', 'current_designation'],
      ['G001', 'John Doe', 'Acme Corp', 'Digital Banking', 'M001', 'Active', '2024-01-15', 'Bangalore', 'Programmer Analyst'],
      ['G002', 'Jane Smith', 'TechCorp', 'Cloud Solutions', 'M002', 'Allocated', '2024-02-01', 'Chennai', 'Associate']
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'genc_import_template.csv';
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
        title="GenCs"
        data={gencs}
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
        title={editingGenC ? 'Edit GenC' : 'Create New GenC'}
        size="xl"
      >
        <GenCForm
          initialData={editingGenC || undefined}
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
            Are you sure you want to delete GenC "{deletingGenC?.genc_name}"? This action cannot be undone and will also remove all associated skills and feedback.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="cognizant-button-secondary"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              disabled={submitting}
              className="cognizant-button-primary bg-red-600 hover:bg-red-700 disabled:opacity-50"
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
        title="Import GenCs from Excel"
        size="md"
      >
        <div className="space-y-6">
          {!importResult ? (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 mb-2">Instructions:</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Upload an Excel file (.xlsx or .xls) with GenC data</li>
                    <li>• Required columns: <code className="bg-gray-100 px-1 rounded">associate_id</code>, <code className="bg-gray-100 px-1 rounded">genc_name</code>, <code className="bg-gray-100 px-1 rounded">account_name</code>, <code className="bg-gray-100 px-1 rounded">service_line</code>, <code className="bg-gray-100 px-1 rounded">mentor_associate_id</code>, <code className="bg-gray-100 px-1 rounded">status</code>, <code className="bg-gray-100 px-1 rounded">date_of_joining</code>, <code className="bg-gray-100 px-1 rounded">location</code>, <code className="bg-gray-100 px-1 rounded">current_designation</code></li>
                    <li>• Status values: Active, Allocated, Terminated</li>
                    <li>• Location values: Bangalore, Chennai, Hyderabad, Pune, Mumbai, Kolkata</li>
                    <li>• Designation values: Programmer Analyst, Associate, Senior Associate</li>
                    <li>• Date format: YYYY-MM-DD</li>
                    <li>• Account names, service lines, and mentor associate IDs must exist in the system</li>
                    <li>• Duplicate associate IDs will be skipped</li>
                  </ul>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="genc-file-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Choose Excel file to upload
                        </span>
                        <input
                          ref={fileInputRef}
                          id="genc-file-upload"
                          name="genc-file-upload"
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