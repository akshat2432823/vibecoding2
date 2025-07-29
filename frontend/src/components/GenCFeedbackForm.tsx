import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { GenCFeedbackCreate, GenCFeedback } from '../types';
import { genCAPI, mentorAPI } from '../api';
import { useApiData } from '../hooks/useApi';

interface GenCFeedbackFormProps {
  initialData?: GenCFeedback;
  onSubmit: (data: GenCFeedbackCreate) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function GenCFeedbackForm({ initialData, onSubmit, onCancel, loading = false }: GenCFeedbackFormProps) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<GenCFeedbackCreate>();
  const { data: gencs } = useApiData(() => genCAPI.getAll());
  const { data: mentors } = useApiData(() => mentorAPI.getAll());

  useEffect(() => {
    if (initialData) {
      // Convert date string to proper format for input[type="date"]
      const formData = {
        ...initialData,
        date_of_feedback: initialData.date_of_feedback ? new Date(initialData.date_of_feedback).toISOString().split('T')[0] : '',
      };
      reset(formData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* GenC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GenC *
          </label>
          <select
            {...register('genc_id', { required: 'GenC is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select GenC</option>
            {gencs.map((genc: any) => (
              <option key={genc.id} value={genc.id}>
                {genc.genc_name} ({genc.associate_id})
              </option>
            ))}
          </select>
          {errors.genc_id && (
            <p className="text-red-500 text-sm mt-1">{errors.genc_id.message}</p>
          )}
        </div>

        {/* Mentor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mentor *
          </label>
          <select
            {...register('mentor_id', { required: 'Mentor is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Mentor</option>
            {mentors.map((mentor: any) => (
              <option key={mentor.id} value={mentor.id}>
                {mentor.mentor_name} ({mentor.associate_id})
              </option>
            ))}
          </select>
          {errors.mentor_id && (
            <p className="text-red-500 text-sm mt-1">{errors.mentor_id.message}</p>
          )}
        </div>

        {/* Date of Feedback */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Feedback *
          </label>
          <input
            type="date"
            {...register('date_of_feedback', { required: 'Date of Feedback is required' })}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.date_of_feedback && (
            <p className="text-red-500 text-sm mt-1">{errors.date_of_feedback.message}</p>
          )}
        </div>
      </div>

      {/* Feedback */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Feedback *
        </label>
        <textarea
          {...register('feedback', { required: 'Feedback is required' })}
          rows={5}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter detailed feedback..."
        />
        {errors.feedback && (
          <p className="text-red-500 text-sm mt-1">{errors.feedback.message}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Saving...' : initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
} 