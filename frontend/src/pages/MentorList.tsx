import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import MentorForm from '../components/MentorForm';
import { mentorAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { Mentor, MentorCreate } from '../types';

export default function MentorList() {
  const [showModal, setShowModal] = useState(false);
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingMentor, setDeletingMentor] = useState<Mentor | null>(null);

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
    </>
  );
} 