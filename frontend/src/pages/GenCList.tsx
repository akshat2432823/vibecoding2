import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import GenCForm from '../components/GenCForm';
import { genCAPI, genCSkillAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { GenC, GenCCreate } from '../types';
import { SelectedSkill } from '../components/GenCSkillSelector';

interface GenCFormData extends GenCCreate {
  skills?: SelectedSkill[];
}

export default function GenCList() {
  const [showModal, setShowModal] = useState(false);
  const [editingGenC, setEditingGenC] = useState<GenC | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingGenC, setDeletingGenC] = useState<GenC | null>(null);

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
      const { skills, ...gencData } = data;
      
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
    </>
  );
} 