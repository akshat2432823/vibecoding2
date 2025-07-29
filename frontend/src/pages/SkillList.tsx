import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import SkillForm from '../components/SkillForm';
import { skillAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { Skill, SkillCreate } from '../types';

export default function SkillList() {
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingSkill, setDeletingSkill] = useState<Skill | null>(null);

  const { data: skills, loading, refetch } = useApiData<Skill>(() => skillAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { key: 'skill_name', label: 'Skill Name' },
    { 
      key: 'category', 
      label: 'Category',
      render: (value: string) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(value)}`}>
          {value || 'General'}
        </span>
      )
    },
    { 
      key: 'description', 
      label: 'Description',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value || '-'}
        </div>
      )
    },
  ];

  const getCategoryColor = (category: string) => {
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

  const handleNew = () => {
    setEditingSkill(null);
    setShowModal(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setShowModal(true);
  };

  const handleDelete = (skill: Skill) => {
    setDeletingSkill(skill);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: SkillCreate) => {
    try {
      if (editingSkill) {
        await execute(
          () => skillAPI.update(editingSkill.id, data),
          { 
            successMessage: 'Skill updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => skillAPI.create(data),
          { 
            successMessage: 'Skill created successfully',
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
    if (!deletingSkill) return;

    try {
      await execute(
        () => skillAPI.delete(deletingSkill.id),
        { 
          successMessage: 'Skill deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingSkill(null);
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
        title="Skills"
        data={skills}
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
        title={editingSkill ? 'Edit Skill' : 'Create New Skill'}
        size="md"
      >
        <SkillForm
          initialData={editingSkill || undefined}
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
            Are you sure you want to delete skill "{deletingSkill?.skill_name}"? This action cannot be undone and will remove the skill from all GenCs.
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