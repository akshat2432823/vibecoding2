import { useState } from 'react';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import GenCFeedbackForm from '../components/GenCFeedbackForm';
import { genCFeedbackAPI } from '../api';
import { useApiData, useApi } from '../hooks/useApi';
import { GenCFeedback, GenCFeedbackCreate } from '../types';

export default function GenCFeedbackList() {
  const [showModal, setShowModal] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState<GenCFeedback | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletingFeedback, setDeletingFeedback] = useState<GenCFeedback | null>(null);

  const { data: feedbacks, loading, refetch } = useApiData<GenCFeedback>(() => genCFeedbackAPI.getAll());
  const { execute, loading: submitting } = useApi();

  const columns = [
    { 
      key: 'genc', 
      label: 'GenC', 
      render: (_: any, item: GenCFeedback) => item.genc?.genc_name || '-'
    },
    { 
      key: 'mentor', 
      label: 'Mentor', 
      render: (_: any, item: GenCFeedback) => item.mentor?.mentor_name || '-'
    },
    { 
      key: 'date_of_feedback', 
      label: 'Date',
      render: (value: string) => value ? new Date(value).toLocaleDateString() : '-'
    },
    { 
      key: 'feedback', 
      label: 'Feedback',
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
  ];

  const handleNew = () => {
    setEditingFeedback(null);
    setShowModal(true);
  };

  const handleEdit = (feedback: GenCFeedback) => {
    setEditingFeedback(feedback);
    setShowModal(true);
  };

  const handleDelete = (feedback: GenCFeedback) => {
    setDeletingFeedback(feedback);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (data: GenCFeedbackCreate) => {
    try {
      if (editingFeedback) {
        await execute(
          () => genCFeedbackAPI.update(editingFeedback.id, data),
          { 
            successMessage: 'Feedback updated successfully',
            onSuccess: () => {
              setShowModal(false);
              refetch();
            }
          }
        );
      } else {
        await execute(
          () => genCFeedbackAPI.create(data),
          { 
            successMessage: 'Feedback created successfully',
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
    if (!deletingFeedback) return;

    try {
      await execute(
        () => genCFeedbackAPI.delete(deletingFeedback.id),
        { 
          successMessage: 'Feedback deleted successfully',
          onSuccess: () => {
            setShowDeleteConfirm(false);
            setDeletingFeedback(null);
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
        title="GenC Feedbacks"
        data={feedbacks}
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
        title={editingFeedback ? 'Edit Feedback' : 'Create New Feedback'}
        size="lg"
      >
        <GenCFeedbackForm
          initialData={editingFeedback || undefined}
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
            Are you sure you want to delete this feedback? This action cannot be undone.
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