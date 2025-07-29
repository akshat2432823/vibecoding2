import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import RoleSkillRequirementForm from '../components/RoleSkillRequirementForm';
import { roleSkillRequirementAPI, skillMatrixAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { RoleSkillRequirement, RoleSkillRequirementCreate, RoleRequirementMatrix } from '../types';
import { Award, Target, CheckCircle, XCircle } from 'lucide-react';

export default function RoleRequirements() {
  const [showModal, setShowModal] = useState(false);
  const [editingRequirement, setEditingRequirement] = useState<RoleSkillRequirement | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingRequirement, setDeletingRequirement] = useState<RoleSkillRequirement | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('all');

  const { data: requirements, loading, refetch } = useApiData<RoleSkillRequirement>(() => roleSkillRequirementAPI.getAll());
  const { data: roleMatrix, loading: matrixLoading } = useApiData<RoleRequirementMatrix>(() => skillMatrixAPI.getRoleRequirementsMatrix());
  const { execute, loading: submitting } = useApi();

  // Filter requirements by selected role
  const filteredRequirements = requirements.filter(req => 
    selectedRole === 'all' || req.role === selectedRole
  );

  const roles = [...new Set(requirements.map(req => req.role))].sort();

  const columns = [
    { 
      key: 'role', 
      label: 'Role',
      render: (value: string) => (
        <span className="font-medium text-blue-600">{value}</span>
      )
    },
    { 
      key: 'skill', 
      label: 'Skill',
      render: (_: any, item: RoleSkillRequirement) => (
        <span>{item.skill?.skill_name || 'Unknown Skill'}</span>
      )
    },
    { 
      key: 'skill', 
      label: 'Category',
      render: (_: any, item: RoleSkillRequirement) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(item.skill?.category)}`}>
          {item.skill?.category || 'General'}
        </span>
      )
    },
    { 
      key: 'required_proficiency_level', 
      label: 'Required Level',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(value)}`}>
          {value}
        </span>
      )
    },
    { 
      key: 'is_mandatory', 
      label: 'Mandatory',
      render: (value: string) => (
        <div className="flex items-center gap-1">
          {value === 'Yes' ? (
            <>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-600">Yes</span>
            </>
          ) : (
            <>
              <XCircle className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">No</span>
            </>
          )}
        </div>
      )
    },
  ];

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'technical': return 'bg-blue-100 text-blue-800';
      case 'soft skills': return 'bg-green-100 text-green-800';
      case 'domain': return 'bg-purple-100 text-purple-800';
      case 'programming': return 'bg-orange-100 text-orange-800';
      case 'framework': return 'bg-indigo-100 text-indigo-800';
      case 'database': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProficiencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-red-100 text-red-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-blue-100 text-blue-800';
      case 'expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleNew = () => {
    setEditingRequirement(null);
    setShowModal(true);
  };

  const handleEdit = (requirement: RoleSkillRequirement) => {
    setEditingRequirement(requirement);
    setShowModal(true);
  };

  const handleDelete = (requirement: RoleSkillRequirement) => {
    setDeletingRequirement(requirement);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: RoleSkillRequirementCreate) => {
    try {
      if (editingRequirement) {
        await execute(
          () => roleSkillRequirementAPI.update(editingRequirement.id, data),
          { 
            successMessage: 'Role requirement updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => roleSkillRequirementAPI.create(data),
          { 
            successMessage: 'Role requirement created successfully',
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
    if (!deletingRequirement) return;

    try {
      await execute(
        () => roleSkillRequirementAPI.delete(deletingRequirement.id),
        { 
          successMessage: 'Role requirement deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingRequirement(null);
            refetch();
          }
        }
      );
    } catch (error) {
      // Error handling is done in useApi hook
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Role Requirements</h1>
        <p className="page-subtitle">Manage skill requirements for different roles</p>
      </div>

      {/* Role Matrix Overview */}
      {!matrixLoading && roleMatrix.length > 0 && (
        <div className="mb-6 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Requirements Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roleMatrix.map((role) => (
              <div key={role.role} className="cognizant-card p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{role.role}</h3>
                    <p className="text-sm text-gray-600">{role.requirements.length} skills required</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {role.requirements.slice(0, 3).map((req, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{req.skill_name}</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProficiencyColor(req.required_proficiency_level)}`}>
                          {req.required_proficiency_level}
                        </span>
                                                 {req.is_mandatory === 'Yes' && (
                           <Target className="h-3 w-3 text-red-500" />
                         )}
                      </div>
                    </div>
                  ))}
                  
                  {role.requirements.length > 3 && (
                    <div className="text-xs text-gray-500 text-center pt-2">
                      +{role.requirements.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="form-select w-auto"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          
          <span className="text-sm text-gray-600">
            Showing {filteredRequirements.length} of {requirements.length} requirements
          </span>
        </div>
      </div>

      {/* Requirements Table */}
      <DataTable
        title="Role Skill Requirements"
        data={filteredRequirements}
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
        title={editingRequirement ? 'Edit Role Requirement' : 'Create New Role Requirement'}
        size="md"
      >
        <RoleSkillRequirementForm
          initialData={editingRequirement || undefined}
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
            Are you sure you want to delete this role requirement? This action cannot be undone.
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
    </div>
  );
} 